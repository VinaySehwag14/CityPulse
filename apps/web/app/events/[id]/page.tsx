import type { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return { title: `Event ${id.slice(0, 8)}` };
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
    return <EventDetailClient eventId={id} />;
}
