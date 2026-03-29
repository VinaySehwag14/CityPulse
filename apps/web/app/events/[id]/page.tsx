import { cache } from 'react';
import type { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';
import { apiGet } from '@/lib/api-client';
import type { EventDetail } from '@/lib/types';
import JsonLd from '@/components/seo/JsonLd';

interface Props { params: Promise<{ id: string }> }

// Use cache to deduplicate API calls between generateMetadata and the page content
// Recommended pattern for Next.js 15 server components
const getEventData = cache(async (id: string) => {
    try {
        return await apiGet<EventDetail>(`/events/${id}`);
    } catch (err) {
        console.error('Failed to fetch event data:', id, err);
        return null;
    }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const event = await getEventData(id);
    
    // Construct absolute URL for OG image and Canonical tags
    // This is required for WhatsApp, Twitter, etc. to render 'Cards'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citypulse.vercel.app';
    const absoluteEventUrl = `${siteUrl}/events/${id}`;

    if (!event) return { title: 'Upcoming Event | CityPulse' };

    return {
        title: event.title,
        description: event.description?.slice(0, 160) ?? `Join ${event.title} on CityPulse. Hyperlocal event discovery.`,
        metadataBase: new URL(siteUrl),
        openGraph: {
            title: event.title,
            description: event.description ?? `Discover ${event.title} on CityPulse.`,
            url: absoluteEventUrl,
            siteName: 'CityPulse',
            images: [
                {
                    url: `/events/${id}/opengraph-image`, // Next.js automatically handles absolute conversion with metadataBase
                    width: 1200,
                    height: 630,
                    alt: `Join us for ${event.title}`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description ?? `Join us for ${event.title} on CityPulse.`,
            images: [`/events/${id}/opengraph-image`],
        },
        alternates: {
            canonical: absoluteEventUrl,
        },
    };
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    const event = await getEventData(id);

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

