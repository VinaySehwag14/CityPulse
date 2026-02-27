// feed.types.ts
// Feed-specific types extending the base Event.
// API_SPEC.md GET /feed – required fields.

import type { Event } from '../events/events.types';

export interface FeedEvent extends Event {
    like_count: number;
    attendee_count: number;
    is_live: boolean;
    score: number;
}

export interface FeedQuery {
    page: number;
    limit: number;
}

export interface FeedResponse {
    events: FeedEvent[];
    total: number;
    page: number;
    limit: number;
}
