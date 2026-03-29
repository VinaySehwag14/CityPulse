import type { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';
import { apiGet } from '@/lib/api-client';
import type { EventDetail } from '@/lib/types';
import JsonLd from '@/components/seo/JsonLd';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const event = await apiGet<EventDetail>(`/events/${id}`);
        return {
            title: event.title,
            description: event.description?.slice(0, 160) ?? `Join ${event.title} on CityPulse. Hyperlocal event discovery.`,
            openGraph: {
                title: event.title,
                description: event.description ?? `Discover ${event.title} on CityPulse.`,
                url: `/events/${id}`,
            },
            alternates: {
                canonical: `/events/${id}`,
            },
        };
    } catch (err) {
        console.error('Failed to generate metadata for event:', id, err);
        return { title: 'Upcoming Event | CityPulse' };
    }
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    
    // Attempt to fetch event data for server-side JSON-LD injection
    let event: EventDetail | null = null;
    try {
        event = await apiGet<EventDetail>(`/events/${id}`);
    } catch (err) {
        // We'll let the client handle the error state if it doesn't exist
        console.error('Failed to fetch event for JSON-LD:', id, err);
    }

    const eventJsonLd = event ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description,
        startDate: event.start_time,
        endDate: event.end_time,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: 'CityPulse Event Location',
            geo: {
                '@type': 'GeoCoordinates',
                latitude: event.location_lat,
                longitude: event.location_lng,
            },
        },
    } : null;

    return (
        <>
            {eventJsonLd && <JsonLd data={eventJsonLd} />}
            <EventDetailClient eventId={id} />
        </>
    );
}

