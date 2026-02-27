import { Pool } from 'pg';
import { env } from './env';

// Neon uses a connection pooler (PgBouncer). max=10 prevents exhausting
// the pooler's connection limit on the free tier (max 25 total).
const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,            // max client connections from this API instance
    idleTimeoutMillis: 30_000,  // release idle connections after 30s
    connectionTimeoutMillis: 5_000, // fail fast if cannot connect within 5s
});

pool.on('error', (err) => {
    console.error('[DB] Unexpected pool error:', err.message);
});

export default pool;
