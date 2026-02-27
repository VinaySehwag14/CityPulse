// search.validation.ts
// Pure validation for geo search inputs. No HTTP, no DB.

import type { SearchQuery } from './search.types';

export function validateSearchQuery(raw: Record<string, unknown>): string | null {
    const lat = raw.lat !== undefined ? Number(raw.lat) : undefined;
    const lng = raw.lng !== undefined ? Number(raw.lng) : undefined;
    const radius_km = raw.radius_km !== undefined ? Number(raw.radius_km) : undefined;

    // Geo search requires lat + lng + radius together
    const hasGeo = lat !== undefined || lng !== undefined || radius_km !== undefined;

    if (hasGeo) {
        if (lat === undefined || isNaN(lat)) return 'lat (number) is required for geo search';
        if (lng === undefined || isNaN(lng)) return 'lng (number) is required for geo search';
        if (radius_km === undefined || isNaN(radius_km)) return 'radius_km is required for geo search';
        if (lat < -90 || lat > 90) return 'lat must be between -90 and 90';
        if (lng < -180 || lng > 180) return 'lng must be between -180 and 180';
        if (radius_km < 1 || radius_km > 100) return 'radius_km must be between 1 and 100';
    }

    if (raw.q !== undefined && typeof raw.q !== 'string') {
        return 'q must be a string';
    }

    if (!raw.q && !hasGeo) {
        return 'Provide at least a text query (q) or geo params (lat, lng, radius_km)';
    }

    return null;
}

export function parseSearchQuery(raw: Record<string, unknown>): SearchQuery {
    return {
        q: raw.q ? String(raw.q).trim() : undefined,
        lat: raw.lat !== undefined ? Number(raw.lat) : undefined,
        lng: raw.lng !== undefined ? Number(raw.lng) : undefined,
        radius_km: raw.radius_km !== undefined ? Number(raw.radius_km) : undefined,
    };
}
