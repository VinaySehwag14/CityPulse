'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvent, useUpdateEvent } from '@/hooks/useEvents';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface Props { params: Promise<{ id: string }> }

// This is a client component that wraps the actual form
// Separated from the page shell so we can await params server-side
export function EditEventForm({ eventId }: { eventId: string }) {
    const router = useRouter();
    const { data: event, isLoading } = useEvent(eventId);
    const updateEvent = useUpdateEvent(eventId);

    const [form, setForm] = useState({
        title: '',
        description: '',
        lat: '',
        lng: '',
        start_time: '',
        end_time: '',
    });
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form once event loads
    if (event && !initialized) {
        setForm({
            title: event.title,
            description: event.description ?? '',
            lat: String(event.location_lat),
            lng: String(event.location_lng),
            start_time: new Date(event.start_time).toISOString().slice(0, 16),
            end_time: new Date(event.end_time).toISOString().slice(0, 16),
        });
        setInitialized(true);
    }

    const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const lat = parseFloat(form.lat);
        const lng = parseFloat(form.lng);
        if (!form.title.trim()) return setError('Title is required');
        if (isNaN(lat) || isNaN(lng)) return setError('Valid latitude and longitude are required');
        if (!form.start_time || !form.end_time) return setError('Start and end times are required');
        if (new Date(form.end_time) <= new Date(form.start_time)) return setError('End time must be after start time');

        try {
            await updateEvent.mutateAsync({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                lat, lng,
                start_time: new Date(form.start_time).toISOString(),
                end_time: new Date(form.end_time).toISOString(),
            });
            router.push(`/events/${eventId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

    const fieldCls = 'w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors';
    const labelCls = 'block text-sm font-medium text-[#e6edf3] mb-1.5';

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient">Edit Event</h1>
                <p className="text-[#8b949e] text-sm mt-1">Update your event details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="edit-title" className={labelCls}>Event Title *</label>
                    <input id="edit-title" required value={form.title} onChange={(e) => set('title', e.target.value)} className={fieldCls} maxLength={200} />
                </div>

                <div>
                    <label htmlFor="edit-desc" className={labelCls}>Description</label>
                    <textarea id="edit-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={`${fieldCls} resize-none`} maxLength={2000} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="edit-lat" className={labelCls}>Latitude *</label>
                        <input id="edit-lat" type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} className={fieldCls} required />
                    </div>
                    <div>
                        <label htmlFor="edit-lng" className={labelCls}>Longitude *</label>
                        <input id="edit-lng" type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} className={fieldCls} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="edit-start" className={labelCls}>Start Time *</label>
                        <input id="edit-start" type="datetime-local" value={form.start_time} onChange={(e) => set('start_time', e.target.value)} className={fieldCls} required />
                    </div>
                    <div>
                        <label htmlFor="edit-end" className={labelCls}>End Time *</label>
                        <input id="edit-end" type="datetime-local" value={form.end_time} onChange={(e) => set('end_time', e.target.value)} className={fieldCls} required />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3">
                    <Button type="button" variant="ghost" size="lg" onClick={() => router.back()} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" loading={updateEvent.isPending} className="flex-1">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
