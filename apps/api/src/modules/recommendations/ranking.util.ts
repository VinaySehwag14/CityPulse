// recommendations/ranking.util.ts
// Ranking formula for the feed — lives here per AI_RULES.md §2.
// Pure SQL expression builder — no HTTP, no DB access.

/**
 * Returns a SQL expression that computes the ranking score for each event.
 *
 * Formula (all computed in SQL to avoid N+1):
 *   score = (likes * 2 + attendees * 1.5)
 *           * EXP(-0.1 * hours_since_created)   ← time decay
 *           * (is_live ? 2.0 : 1.0)              ← live boost
 *
 * Rules enforced per AI_RULES.md §5 (CRITICAL):
 *   - end_time > NOW() filter applied separately in feed.service.ts
 *   - Live events (start_time <= NOW() <= end_time) receive 2× score
 *   - Older events decay exponentially
 */
export function getRankingScoreSQL(
    likesAlias: string,
    attendeesAlias: string
): string {
    return `
    (
      (${likesAlias} * 2.0 + ${attendeesAlias} * 1.5)
      * EXP(-0.1 * EXTRACT(EPOCH FROM (NOW() - e.created_at)) / 3600.0)
      * CASE
          WHEN e.start_time <= NOW() AND e.end_time > NOW() THEN 2.0
          ELSE 1.0
        END
    )
  `.trim();
}

/**
 * SQL expression that evaluates to TRUE when the event is currently live.
 */
export const IS_LIVE_SQL =
    `e.start_time <= NOW() AND e.end_time > NOW()` as const;
