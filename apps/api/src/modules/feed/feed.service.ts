// feed.service.ts
// Business logic: fetch ranked, paginated, fresh event feed.
// All DB access here. No HTTP objects.
// Ranking formula imported from recommendations/ranking.util.ts per AI_RULES.md §2.

import pool from '../../config/db';
import { resolveDbUserId } from '../../lib/resolveUser';
import { getRankingScoreSQL, IS_LIVE_SQL } from '../recommendations/ranking.util';
import type { FeedEvent, FeedQuery, FeedResponse } from './feed.types';

export async function getFeed(query: FeedQuery): Promise<FeedResponse> {
  const { page, limit, clerkId } = query;
  const offset = (page - 1) * limit;

  // PostgreSQL cannot reference sibling SELECT aliases in the same SELECT.
  // Pass the actual subquery expressions so 'score' is self-contained.
  const likesSub = `(SELECT COUNT(*)::int FROM event_likes    WHERE event_id = e.id)`;
  const attendeesSub = `(SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id)`;
  const scoreSQL = getRankingScoreSQL(likesSub, attendeesSub);

  const values: unknown[] = [limit, offset];
  let rankBoost = '0';

  if (clerkId) {
    const dbUserId = await resolveDbUserId(clerkId);
    values.push(dbUserId); // $3
    // Averages the embeddings of all events a user has ever liked to create a personalized preference vector
    const userVibeQuery = `(
          SELECT avg(ev.embedding)
          FROM events ev
          JOIN event_likes el ON ev.id = el.event_id
          WHERE el.user_id = $3
      )`;
    // Uses Cosine Distance (<=>) to determine similarity. Cosine distance ranges from 0 (identical) to 2 (opposite).
    // We invert and scale it to get a massive ranking boost when values are similar.
    rankBoost = `COALESCE((2.0 - (e.embedding <=> ${userVibeQuery})::float) * 50.0, 0)`;
  }

  // Single query with correlated subqueries for counts — avoids N+1 (AI_RULES §8)
  // CRITICAL: end_time > NOW() enforced per AI_RULES.md §5
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
      e.tags,
      (SELECT COUNT(*)::int FROM event_likes    WHERE event_id = e.id) AS like_count,
      (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count,
      (${IS_LIVE_SQL})                                                  AS is_live,
      (${scoreSQL} + ${rankBoost})                                      AS score
    FROM events e
    WHERE e.end_time > NOW()
    ORDER BY score DESC
    LIMIT $1 OFFSET $2
  `;

  const countSQL = `
    SELECT COUNT(*)::int AS total
    FROM events
    WHERE end_time > NOW()
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query<FeedEvent>(sql, values),
    pool.query<{ total: number }>(countSQL),
  ]);

  return {
    events: dataResult.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
}
