import type { Metadata } from 'next';
import { EditEventForm } from '@/components/events/EditEventForm';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Event' };

export default async function EditEventPage({ params }: Props) {
    const { id } = await params;
    return <EditEventForm eventId={id} />;
}
