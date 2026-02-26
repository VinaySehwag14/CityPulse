// events.validation.ts
// Pure validation functions – no HTTP, no DB, no business logic.
// Per AI_RULES.md §2: validation must be separate from controllers.

import type { CreateEventDto, UpdateEventDto } from './events.types';

export function validateCreateEvent(body: unknown): string | null {
    const b = body as Partial<CreateEventDto>;

    if (!b.title || typeof b.title !== 'string' || b.title.trim() === '') {
        return 'title is required';
    }

    if (b.lat === undefined || b.lat === null || typeof b.lat !== 'number') {
        return 'lat (number) is required';
    }

    if (b.lng === undefined || b.lng === null || typeof b.lng !== 'number') {
        return 'lng (number) is required';
    }

    if (b.lat < -90 || b.lat > 90) {
        return 'lat must be between -90 and 90';
    }

    if (b.lng < -180 || b.lng > 180) {
        return 'lng must be between -180 and 180';
    }

    if (!b.start_time || typeof b.start_time !== 'string') {
        return 'start_time (ISO-8601) is required';
    }

    if (!b.end_time || typeof b.end_time !== 'string') {
        return 'end_time (ISO-8601) is required';
    }

    const start = new Date(b.start_time);
    const end = new Date(b.end_time);

    if (isNaN(start.getTime())) return 'start_time is not a valid date';
    if (isNaN(end.getTime())) return 'end_time is not a valid date';

    // FEATURES.md §2: end_time must be after start_time
    if (end <= start) {
        return 'end_time must be after start_time';
    }

    return null;
}

export function validateUpdateEvent(body: unknown): string | null {
    const b = body as Partial<UpdateEventDto>;

    const allowedKeys = ['title', 'description', 'lat', 'lng', 'start_time', 'end_time'];
    const provided = Object.keys(b as object).filter((k) => allowedKeys.includes(k));

    if (provided.length === 0) {
        return 'At least one field must be provided for update';
    }

    if (b.lat !== undefined && typeof b.lat !== 'number') {
        return 'lat must be a number';
    }

    if (b.lng !== undefined && typeof b.lng !== 'number') {
        return 'lng must be a number';
    }

    if (b.lat !== undefined && (b.lat < -90 || b.lat > 90)) {
        return 'lat must be between -90 and 90';
    }

    if (b.lng !== undefined && (b.lng < -180 || b.lng > 180)) {
        return 'lng must be between -180 and 180';
    }

    // If both times are provided, end must be after start
    if (b.start_time && b.end_time) {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);
        if (isNaN(start.getTime())) return 'start_time is not a valid date';
        if (isNaN(end.getTime())) return 'end_time is not a valid date';
        if (end <= start) return 'end_time must be after start_time';
    }

    return null;
}
