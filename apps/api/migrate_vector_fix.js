require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        console.log('Recreating embedding column as vector(3072)...');
        await pool.query('ALTER TABLE events DROP COLUMN IF EXISTS embedding;');
        await pool.query('ALTER TABLE events ADD COLUMN embedding vector(3072);');
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
