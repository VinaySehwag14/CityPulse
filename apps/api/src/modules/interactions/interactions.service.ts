// interactions.service.ts
// Business logic for likes and attendance.
// All DB access here. No HTTP objects.

import pool from '../../config/db';
import { resolveDbUserId } from '../../lib/resolveUser';
import type { AttendStatus, ToggleLikeResult, AttendResult } from './interactions.types';

// ─── Likes ────────────────────────────────────────────────────────────────────

export async function toggleLike(
    clerkId: string,
    eventId: string
): Promise<ToggleLikeResult> {
    const userId = await resolveDbUserId(clerkId);

    // Atomic toggle using a single CTE — eliminates race condition from
    // the previous check-then-insert pattern (3 round trips → 1).
    const result = await pool.query<{ liked: boolean; like_count: number }>(
        `WITH del AS (
       DELETE FROM event_likes
       WHERE user_id = $1 AND event_id = $2
       RETURNING id
     ),
     ins AS (
       INSERT INTO event_likes (id, user_id, event_id)
       SELECT gen_random_uuid(), $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM del)
       RETURNING id
     )
     SELECT
       EXISTS (SELECT 1 FROM ins)                             AS liked,
       (SELECT COUNT(*)::int FROM event_likes WHERE event_id = $2) AS like_count`,
        [userId, eventId]
    );

    return result.rows[0];
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export async function markAttendance(
    clerkId: string,
    eventId: string,
    status: AttendStatus
): Promise<AttendResult> {
    const userId = await resolveDbUserId(clerkId);

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
