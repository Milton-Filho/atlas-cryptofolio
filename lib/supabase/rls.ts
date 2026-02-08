import { auth } from '@clerk/nextjs/server';

export async function getOrgContext() {
    const { userId, orgId } = await auth();

    if (!userId) {
        throw new Error('Não autenticado');
    }

    // Se não tem orgId, usa organização pessoal
    const effectiveOrgId = orgId || `personal_${userId}`;

    return {
        userId,
        orgId: effectiveOrgId,
    };
}
