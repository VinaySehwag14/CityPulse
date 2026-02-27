// search.types.ts

import type { Event } from '../events/events.types';

export interface SearchQuery {
    q?: string;          // text query (title / description ILIKE)
    lat?: number;        // user latitude  (required if radius_km set)
    lng?: number;        // user longitude (required if radius_km set)
    radius_km?: number;  // search radius in km (1–100)
}

export interface SearchResult extends Event {
    like_count: number;
    attendee_count: number;
    distance_km: number | null; // null when no geo query provided
}
