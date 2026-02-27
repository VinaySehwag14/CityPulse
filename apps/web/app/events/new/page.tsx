'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateEvent } from '@/hooks/useEvents';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export default function CreateEventPage() {
    const router = useRouter();
    const createEvent = useCreateEvent();

    const [form, setForm] = useState({
        title: '',
        description: '',
        lat: '',
        lng: '',
        start_time: '',
        end_time: '',
    });
    const [error, setError] = useState('');

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
            const event = await createEvent.mutateAsync({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                lat, lng,
                start_time: new Date(form.start_time).toISOString(),
                end_time: new Date(form.end_time).toISOString(),
            });
            router.push(`/events/${event.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        }
    };

    const fieldCls = 'w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors';
    const labelCls = 'block text-sm font-medium text-[#e6edf3] mb-1.5';

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient">Create Event</h1>
                <p className="text-[#8b949e] text-sm mt-1">Share what's happening in your city</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="title" className={labelCls}>Event Title *</label>
                    <input id="title" required placeholder="What's happening?" value={form.title} onChange={(e) => set('title', e.target.value)} className={fieldCls} maxLength={200} />
                </div>

                <div>
                    <label htmlFor="description" className={labelCls}>Description</label>
                    <textarea id="description" placeholder="Tell people more about this event…" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={`${fieldCls} resize-none`} maxLength={2000} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="lat" className={labelCls}>Latitude *</label>
                        <input id="lat" type="number" step="any" placeholder="28.6139" value={form.lat} onChange={(e) => set('lat', e.target.value)} className={fieldCls} required />
                    </div>
                    <div>
                        <label htmlFor="lng" className={labelCls}>Longitude *</label>
                        <input id="lng" type="number" step="any" placeholder="77.2090" value={form.lng} onChange={(e) => set('lng', e.target.value)} className={fieldCls} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="start_time" className={labelCls}>Start Time *</label>
                        <input id="start_time" type="datetime-local" value={form.start_time} onChange={(e) => set('start_time', e.target.value)} className={fieldCls} required />
                    </div>
                    <div>
                        <label htmlFor="end_time" className={labelCls}>End Time *</label>
                        <input id="end_time" type="datetime-local" value={form.end_time} onChange={(e) => set('end_time', e.target.value)} className={fieldCls} required />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
                )}

                <Button type="submit" size="lg" loading={createEvent.isPending} className="w-full mt-2">
                    Publish Event
                </Button>
            </form>
        </div>
    );
}
