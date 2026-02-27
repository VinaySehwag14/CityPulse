// events.service.ts
// Business logic for Event CRUD.
// All database access lives here. No HTTP objects.
// Per AI_RULES.md: controllers call services, services query DB.

import pool from '../../config/db';
import type { Event, CreateEventDto, UpdateEventDto } from './events.types';

// Shared SELECT projection – avoids SELECT *.
// location decomposed into lat/lng via PostGIS per AI_RULES §8.
const EVENT_SELECT = `
  id,
  title,
  description,
  ST_Y(location::geometry) AS location_lat,
  ST_X(location::geometry) AS location_lng,
  start_time,
  end_time,
  created_by,
  created_at
`;

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createEvent(
    userId: string,
    dto: CreateEventDto
): Promise<Event> {
    const result = await pool.query<Event>(
        `INSERT INTO events (id, title, description, location, start_time, end_time, created_by)
     VALUES (
       gen_random_uuid(),
       $1,
       $2,
       ST_SetSRID(ST_MakePoint($3, $4), 4326),
       $5,
       $6,
       $7
     )
     RETURNING ${EVENT_SELECT}`,
        [
            dto.title.trim(),
            dto.description ?? null,
            dto.lng,
            dto.lat,
            dto.start_time,
            dto.end_time,
            userId,
        ]
    );

    return result.rows[0];
}

// ─── Get by ID ───────────────────────────────────────────────────────────────

export async function getEventById(id: string): Promise<Event | null> {
    const result = await pool.query<Event>(
        `SELECT ${EVENT_SELECT} FROM events e WHERE id = $1`,
        [id]
    );
    return result.rows[0] ?? null;
}

// ─── Get Full Event Detail (API_SPEC.md: comments + like_count + attendees) ──

export interface EventDetail extends Event {
    like_count: number;
    attendee_count: number;
    attendees: Array<{ user_id: string; status: string }>;
    comments: Array<{ id: string; user_id: string; content: string; created_at: Date }>;
}

export async function getEventDetail(id: string): Promise<EventDetail | null> {
    const eventResult = await pool.query<Event>(
        `SELECT ${EVENT_SELECT} FROM events e WHERE id = $1`,
        [id]
    );

    if (!eventResult.rows[0]) return null;

    const [likeCount, attendees, comments] = await Promise.all([
        pool.query<{ count: number }>(
            `SELECT COUNT(*)::int AS count FROM event_likes WHERE event_id = $1`, [id]
        ),
        pool.query<{ user_id: string; status: string }>(
            `SELECT user_id, status FROM event_attendees WHERE event_id = $1`, [id]
        ),
        pool.query<{ id: string; user_id: string; content: string; created_at: Date }>(
            `SELECT id, user_id, content, created_at
       FROM event_comments WHERE event_id = $1
       ORDER BY created_at DESC LIMIT 50`, [id]
        ),
    ]);

    return {
        ...eventResult.rows[0],
        like_count: likeCount.rows[0].count,
        attendee_count: attendees.rows.length, // rowCount is unreliable for SELECT
        attendees: attendees.rows,
        comments: comments.rows,
    };

}


// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateEvent(
    id: string,
    userId: string,
    dto: UpdateEventDto
): Promise<Event> {
    // Fetch first — ownership check in service, not controller (AI_RULES §1)
    const existing = await getEventById(id);

    if (!existing) {
        const err = new Error('Event not found') as Error & { statusCode: number };
        err.statusCode = 404;
        throw err;
    }

    if (existing.created_by !== userId) {
        const err = new Error('Forbidden: you are not the owner of this event') as Error & {
            statusCode: number;
        };
        err.statusCode = 403;
        throw err;
    }

    // Build dynamic SET clause – only update provided fields
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.title !== undefined) {
        setClauses.push(`title = $${paramIndex++}`);
        values.push(dto.title.trim());
    }

    if (dto.description !== undefined) {
        setClauses.push(`description = $${paramIndex++}`);
        values.push(dto.description);
    }

    // Update location only if both lat and lng are provided
    if (dto.lat !== undefined && dto.lng !== undefined) {
        setClauses.push(`location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)`);
        values.push(dto.lng, dto.lat);
    }

    if (dto.start_time !== undefined) {
        setClauses.push(`start_time = $${paramIndex++}`);
        values.push(dto.start_time);
    }

    if (dto.end_time !== undefined) {
        setClauses.push(`end_time = $${paramIndex++}`);
        values.push(dto.end_time);
    }

    values.push(id); // WHERE id = $N

    const result = await pool.query<Event>(
        `UPDATE events
     SET ${setClauses.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING ${EVENT_SELECT}`,
        values
    );

    return result.rows[0];
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteEvent(id: string, userId: string): Promise<void> {
    const existing = await getEventById(id);

    if (!existing) {
        const err = new Error('Event not found') as Error & { statusCode: number };
        err.statusCode = 404;
        throw err;
    }

    if (existing.created_by !== userId) {
        const err = new Error('Forbidden: you are not the owner of this event') as Error & {
            statusCode: number;
        };
        err.statusCode = 403;
        throw err;
    }

    await pool.query('DELETE FROM events WHERE id = $1', [id]);
}
