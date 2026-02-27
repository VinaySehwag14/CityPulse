// interactions.service.ts
// Business logic for likes and attendance.
// All DB access here. No HTTP objects.

import pool from '../../config/db';
import type { AttendStatus, ToggleLikeResult, AttendResult } from './interactions.types';

// ─── Likes ────────────────────────────────────────────────────────────────────

export async function toggleLike(
    userId: string,
    eventId: string
): Promise<ToggleLikeResult> {
    // Check if like already exists
    const existing = await pool.query(
        `SELECT id FROM event_likes WHERE user_id = $1 AND event_id = $2`,
        [userId, eventId]
    );

    let liked: boolean;

    if (existing.rows.length > 0) {
        // Unlike
        await pool.query(
            `DELETE FROM event_likes WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        );
        liked = false;
    } else {
        // Like
        await pool.query(
            `INSERT INTO event_likes (id, user_id, event_id)
       VALUES (gen_random_uuid(), $1, $2)`,
            [userId, eventId]
        );
        liked = true;
    }

    const countResult = await pool.query<{ count: number }>(
        `SELECT COUNT(*)::int AS count FROM event_likes WHERE event_id = $1`,
        [eventId]
    );

    return { liked, like_count: countResult.rows[0].count };
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export async function markAttendance(
    userId: string,
    eventId: string,
    status: AttendStatus
): Promise<AttendResult> {
    // UPSERT — if already attending, update status
    await pool.query(
        `INSERT INTO event_attendees (id, user_id, event_id, status)
     VALUES (gen_random_uuid(), $1, $2, $3)
     ON CONFLICT (user_id, event_id)
     DO UPDATE SET status = EXCLUDED.status`,
        [userId, eventId, status]
    );

    const countResult = await pool.query<{ count: number }>(
        `SELECT COUNT(*)::int AS count FROM event_attendees WHERE event_id = $1`,
        [eventId]
    );

    return { status, attendee_count: countResult.rows[0].count };
}
