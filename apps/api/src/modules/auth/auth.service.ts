// auth.service.ts
// Business logic: upsert authenticated Clerk user into the local users table.
// No HTTP objects here. Controller calls this.

import pool from '../../config/db';
import type { User, UpsertUserPayload } from '../users/users.types';

export async function upsertUser(payload: UpsertUserPayload): Promise<User> {
    const { clerkId, email, name, avatar } = payload;

    const result = await pool.query<User>(
        `INSERT INTO users (id, clerk_id, email, name, avatar)
     VALUES (gen_random_uuid(), $1, $2, $3, $4)
     ON CONFLICT (clerk_id)
     DO UPDATE SET
       email  = EXCLUDED.email,
       name   = EXCLUDED.name,
       avatar = EXCLUDED.avatar
     RETURNING id, clerk_id, email, name, avatar, bio, created_at`,
        [clerkId, email, name, avatar]
    );

    return result.rows[0];
}
