// lib/resolveUser.ts
// Resolves a Clerk user ID (e.g. "user_xxx") to the internal DB UUID (users.id).
//
// ALL authenticated writes must call this before any DB operation
// because the schema stores users.id (UUID) as foreign keys, not clerk_id (TEXT).
// The /api/auth/sync endpoint populates users; if the record is missing,
// the user needs to complete sign-in so the sync fires.

import pool from '../config/db';

export async function resolveDbUserId(clerkId: string): Promise<string> {
    const result = await pool.query<{ id: string }>(
        'SELECT id FROM users WHERE clerk_id = $1',
        [clerkId]
    );

    if (!result.rows[0]) {
        const err = new Error(
            'User profile not found. Please sign out and sign back in to complete account setup.'
        ) as Error & { statusCode: number };
        err.statusCode = 401;
        throw err;
    }

    return result.rows[0].id;
}
