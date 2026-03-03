require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        console.log('Enabling pgvector extension...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('Adding embedding column to events table...');
        await pool.query('ALTER TABLE events ADD COLUMN IF NOT EXISTS embedding vector(768);');
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
