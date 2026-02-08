import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { organizations, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    // Verificar webhook signature
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('CLERK_WEBHOOK_SECRET não configurado');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Erro: Headers faltando', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Erro ao verificar webhook:', err);
        return new Response('Erro: Verificação falhou', {
            status: 400,
        });
    }

    const eventType = evt.type;

    // User Created
    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        // Criar organização pessoal
        const [org] = await db.insert(organizations).values({
            clerkOrgId: `personal_${id}`,
            name: `${first_name || 'User'}'s Organization`,
            slug: `user-${id.slice(0, 8)}`,
        }).returning();

        // Criar usuário
        await db.insert(users).values({
            clerkUserId: id,
            organizationId: org.id,
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            avatarUrl: image_url || null,
        });
    }

    // User Updated
    if (eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        await db.update(users)
            .set({
                email: email_addresses[0]?.email_address || '',
                name: `${first_name || ''} ${last_name || ''}`.trim() || null,
                avatarUrl: image_url || null,
                updatedAt: new Date(),
            })
            .where(eq(users.clerkUserId, id));
    }

    // User Deleted
    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        if (id) {
            await db.update(users)
                .set({ deletedAt: new Date() })
                .where(eq(users.clerkUserId, id));
        }
    }

    // Organization Created
    if (eventType === 'organization.created') {
        const { id, name, slug } = evt.data;

        await db.insert(organizations).values({
            clerkOrgId: id,
            name,
            slug: slug || `org-${id.slice(0, 8)}`,
        });
    }

    // Organization Updated
    if (eventType === 'organization.updated') {
        const { id, name, slug } = evt.data;

        await db.update(organizations)
            .set({
                name,
                slug: slug || undefined,
                updatedAt: new Date(),
            })
            .where(eq(organizations.clerkOrgId, id));
    }

    // Organization Deleted
    if (eventType === 'organization.deleted') {
        const { id } = evt.data;

        if (id) {
            await db.update(organizations)
                .set({ deletedAt: new Date() })
                .where(eq(organizations.clerkOrgId, id));
        }
    }

    return new Response('', { status: 200 });
}
