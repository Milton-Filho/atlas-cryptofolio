import { config } from 'dotenv';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    console.log('🔌 Connecting to database...');
    console.log('📜 Reading RLS policies...');

    const rlsSqlPath = path.join(process.cwd(), 'lib', 'db', 'migrations', 'rls.sql');
    const rlsSql = fs.readFileSync(rlsSqlPath, 'utf-8');

    // Split by statement to execute one by one (optional, but safer for some drivers)
    // Postgres.js can handle multiple statements if configured or just simple query
    // But let's verify if simples query works for multiple statements. 
    // postgres.js usually creates a prepared statement. 
    // For migration scripts, `sql.file` is good but we have content. 

    try {
        console.log('🚀 Applying RLS policies...');
        // We execute the whole file as a single block. 
        // Note: If policies already exist, this might fail unless we use IF NOT EXISTS or drop first.
        // For now, we assume fresh DB or user handles errors.

        // To be safe against "policy already exists", we could drop them first, but standard SQL doesn't have "CREATE OR REPLACE POLICY".
        // We'll wrap in a transaction.

        await sql.begin(async sql => {
            await sql.unsafe(rlsSql);
        });

        console.log('✅ RLS Policies applied successfully!');
    } catch (error) {
        console.error('❌ Error applying RLS:', error);
    } finally {
        await sql.end();
    }
}

main();
