// search.service.ts
// Business logic: geo search + text search over live/future events.
// All DB access here. No HTTP objects. Per AI_RULES.md §1.

import pool from '../../config/db';
import type { SearchQuery, SearchResult } from './search.types';

export async function searchEvents(query: SearchQuery): Promise<SearchResult[]> {
    const { q, lat, lng, radius_km } = query;

    const conditions: string[] = [
        // CRITICAL: Never show expired events (AI_RULES.md §5)
        'e.end_time > NOW()',
    ];
    const values: unknown[] = [];
    let paramIdx = 1;

    // Text search on title + description
    if (q) {
        conditions.push(
            `(e.title ILIKE $${paramIdx} OR e.description ILIKE $${paramIdx})`
        );
        values.push(`%${q}%`);
        paramIdx++;
    }

    // Geo radius filter using PostGIS ST_DWithin
    const hasGeo = lat !== undefined && lng !== undefined && radius_km !== undefined;
    if (hasGeo) {
        const radiusMetres = radius_km! * 1000;
        conditions.push(
            `ST_DWithin(
        e.location,
        ST_SetSRID(ST_MakePoint($${paramIdx}, $${paramIdx + 1}), 4326)::geography,
        $${paramIdx + 2}
      )`
        );
        values.push(lng, lat, radiusMetres);
        paramIdx += 3;
    }

    // Build distance expression – null when no geo query
    const distanceExpr = hasGeo
        ? `ROUND(
        ST_Distance(
          e.location,
          ST_SetSRID(ST_MakePoint($${paramIdx - 3}, $${paramIdx - 2}), 4326)::geography
        ) / 1000.0, 2
      )`
        : 'NULL';

    const sql = `
    SELECT
      e.id,
      e.title,
      e.description,
      ST_Y(e.location::geometry)  AS location_lat,
      ST_X(e.location::geometry)  AS location_lng,
      e.start_time,
      e.end_time,
      e.created_by,
      e.created_at,
      (SELECT COUNT(*)::int FROM event_likes     WHERE event_id = e.id) AS like_count,
      (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count,
      ${distanceExpr}                                                   AS distance_km
    FROM events e
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${hasGeo ? 'distance_km ASC' : 'e.created_at DESC'}
    LIMIT 50
  `;

    const result = await pool.query<SearchResult>(sql, values);
    return result.rows;
}
