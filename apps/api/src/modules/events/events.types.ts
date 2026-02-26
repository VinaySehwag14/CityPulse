// Domain types for the events module.
// Must map to DATABASE.md events table exactly.

export interface Event {
    id: string;
    title: string;
    description: string | null;
    location_lat: number;
    location_lng: number;
    start_time: Date;
    end_time: Date;
    created_by: string;
    created_at: Date;
}

export interface CreateEventDto {
    title: string;
    description?: string;
    lat: number;
    lng: number;
    start_time: string; // ISO-8601 from client
    end_time: string;   // ISO-8601 from client
}

export interface UpdateEventDto {
    title?: string;
    description?: string;
    lat?: number;
    lng?: number;
    start_time?: string;
    end_time?: string;
}
