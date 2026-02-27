// comments.service.ts
// Business logic for event comments. All DB access here.

import pool from '../../config/db';
import type { Comment } from './comments.types';

export async function addComment(
    userId: string,
    eventId: string,
    content: string
): Promise<Comment> {
    const result = await pool.query<Comment>(
        `INSERT INTO event_comments (id, user_id, event_id, content)
     VALUES (gen_random_uuid(), $1, $2, $3)
     RETURNING id, user_id, event_id, content, created_at`,
        [userId, eventId, content]
    );
    return result.rows[0];
}

export async function getComments(
    eventId: string,
    limit = 50
): Promise<Comment[]> {
    const result = await pool.query<Comment>(
        `SELECT id, user_id, event_id, content, created_at
     FROM event_comments
     WHERE event_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
        [eventId, limit]
    );
    return result.rows;
}
