// chat.service.ts
// Business logic for event lobby chat.
// Rules per FEATURES.md §6:
//   - Chat only active when event is live (start_time <= NOW() <= end_time)
//   - Messages persisted in event_comments table

import pool from '../../config/db';
import type { ChatMessage } from './chat.types';

// Guard: is the event active right now?
export async function isEventActive(eventId: string): Promise<boolean> {
    const result = await pool.query<{ active: boolean }>(
        `SELECT (start_time <= NOW() AND end_time > NOW()) AS active
     FROM events WHERE id = $1`,
        [eventId]
    );
    return result.rows[0]?.active ?? false;
}

// Save a chat message (reuses event_comments table)
export async function saveMessage(
    userId: string,
    eventId: string,
    content: string
): Promise<ChatMessage> {
    const result = await pool.query<ChatMessage>(
        `INSERT INTO event_comments (id, user_id, event_id, content)
     VALUES (gen_random_uuid(), $1, $2, $3)
     RETURNING id, event_id, user_id, content, created_at`,
        [userId, eventId, content]
    );
    return result.rows[0];
}

// Fetch recent messages for a lobby (only if event is active)
export async function getRecentMessages(
    eventId: string,
    limit = 50
): Promise<ChatMessage[]> {
    const active = await isEventActive(eventId);
    if (!active) return [];

    const result = await pool.query<ChatMessage>(
        `SELECT id, event_id, user_id, content, created_at
     FROM event_comments
     WHERE event_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
        [eventId, limit]
    );
    return result.rows;
}
