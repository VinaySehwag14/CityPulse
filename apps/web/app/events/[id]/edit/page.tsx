'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEvent, useUpdateEvent } from '@/hooks/useEvents';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const { userId } = useAuth();
    
    const eventId = params?.id as string;
    
    const { data: event, isLoading, error } = useEvent(eventId);
    const updateEvent = useUpdateEvent(eventId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState<number | ''>('');
    const [lng, setLng] = useState<number | ''>('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    // Set initial data once
    const [initialized, setInitialized] = useState(false);
    if (event && !initialized) {
        setTitle(event.title);
        setDescription(event.description || '');
        setLat(event.location_lat);
        setLng(event.location_lng);
        // HTML datetime-local requires YYYY-MM-DDThh:mm format
        setStartTime(new Date(event.start_time).toISOString().slice(0,16));
        setEndTime(new Date(event.end_time).toISOString().slice(0,16));
        setInitialized(true);
    }

    if (isLoading) return <div className="p-8 justify-center flex"><Spinner /></div>;
    if (error || !event) return <div className="p-8 text-center text-red-400">Error loading event.</div>;
    
    if (event.created_by !== userId) {
        return <div className="p-8 text-center text-red-400">You are not authorized to edit this event.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lat === '' || lng === '') return;
        
        await updateEvent.mutateAsync({
            title,
            description,
            lat,
            lng,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString()
        });
        
        router.push(`/events/${eventId}`);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 lg:py-12 px-4 sm:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#e6edf3]">Edit Event</h1>
                <p className="text-[#8b949e] mt-1">Update your event details</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#0d1117] border border-[#30363d] p-6 lg:p-8 rounded-2xl">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e6edf3]">Event Title *</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none transition-colors"
                        placeholder="e.g. Summer Music Festival"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e6edf3]">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none min-h-[120px] resize-y transition-colors"
                        placeholder="Tell people what this event is about..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#e6edf3]">Start Time *</label>
                        <input
                            type="datetime-local"
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none transition-colors [color-scheme:dark]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#e6edf3]">End Time *</label>
                        <input
                            type="datetime-local"
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none transition-colors [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#e6edf3]">Latitude *</label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={lat}
                            onChange={(e) => setLat(parseFloat(e.target.value))}
                            className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none transition-colors"
                            placeholder="e.g. 40.7128"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#e6edf3]">Longitude *</label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={lng}
                            onChange={(e) => setLng(parseFloat(e.target.value))}
                            className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-[#e6edf3] focus:border-[#0caee8] focus:ring-1 focus:ring-[#0caee8] outline-none transition-colors"
                            placeholder="e.g. -74.0060"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-[#30363d] flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" loading={updateEvent.isPending}>Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
