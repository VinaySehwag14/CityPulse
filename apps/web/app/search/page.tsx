'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearch } from '@/hooks/useSearch';
import EventCard from '@/components/events/EventCard';
import Spinner from '@/components/ui/Spinner';
import type { FeedEvent, SearchResult } from '@/lib/types';
import { Search, MapPin, List, Map } from 'lucide-react';

// Mapbox uses window — dynamically loaded client-side only
const MapView = dynamic(() => import('@/components/map/SearchMapView'), {
    ssr: false,
    loading: () => <div className="rounded-2xl bg-[#161b22] border border-[#30363d] h-[420px] flex items-center justify-center"><Spinner /></div>,
});

type ViewMode = 'list' | 'map';

export default function SearchPage() {
    const [q, setQ] = useState('');
    const [geoMode, setGeoMode] = useState(false);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [radius, setRadius] = useState('5');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const params = {
        q: q.trim() || undefined,
        lat: geoMode && lat ? parseFloat(lat) : undefined,
        lng: geoMode && lng ? parseFloat(lng) : undefined,
        radius_km: geoMode && radius ? parseFloat(radius) : undefined,
    };

    const { data: results, isLoading, isError } = useSearch(params);

    const useLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude.toFixed(6));
            setLng(pos.coords.longitude.toFixed(6));
            setGeoMode(true);
        });
    };

    const fieldCls = 'bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors';

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gradient">Search Events</h1>
                <p className="text-[#8b949e] text-sm mt-1">Find by name or search near you</p>
            </div>

            {/* Search controls */}
            <div className="glass rounded-2xl p-4 space-y-3 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
                    <input
                        placeholder="Search events…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className={`${fieldCls} w-full pl-9`}
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={useLocation}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#0caee8] border border-[#0caee8]/30 rounded-xl hover:bg-[#0caee8]/10 transition-all"
                    >
                        <MapPin className="w-4 h-4" />
                        Use my location
                    </button>
                    {geoMode && <span className="text-xs text-[#22c55e]">📍 Location set</span>}
                </div>

                {geoMode && (
                    <div className="grid grid-cols-3 gap-2">
                        <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} className={fieldCls} />
                        <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} className={fieldCls} />
                        <select value={radius} onChange={(e) => setRadius(e.target.value)} className={fieldCls}>
                            {[1, 2, 5, 10, 25, 50].map(r => <option key={r} value={r}>{r} km</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* Loading / Error */}
            {isLoading && <div className="flex justify-center py-10"><Spinner /></div>}
            {isError && <p className="text-center text-[#8b949e] py-10">Search failed. Please try again.</p>}

            {/* Results */}
            {results && results.length === 0 && (
                <div className="text-center py-12 text-[#8b949e]">
                    <p className="text-lg font-medium text-[#e6edf3]">No events found</p>
                    <p className="text-sm mt-1">Try a different search or wider radius</p>
                </div>
            )}

            {results && results.length > 0 && (
                <div className="space-y-4">
                    {/* Result count + List/Map toggle */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[#8b949e]">
                            {results.length} event{results.length !== 1 ? 's' : ''} found
                        </p>
                        <div className="flex gap-1 bg-[#161b22] border border-[#30363d] rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-[#0caee8] text-white' : 'text-[#8b949e] hover:text-[#e6edf3]'}`}
                            >
                                <List className="w-3.5 h-3.5" /> List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'map' ? 'bg-[#0caee8] text-white' : 'text-[#8b949e] hover:text-[#e6edf3]'}`}
                            >
                                <Map className="w-3.5 h-3.5" /> Map
                            </button>
                        </div>
                    </div>

                    {/* Map View */}
                    {viewMode === 'map' && (
                        <MapView
                            results={results}
                            center={lat && lng ? [parseFloat(lat), parseFloat(lng)] : undefined}
                        />
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="space-y-3">
                            {results.map((event: SearchResult) => (
                                <div key={event.id} className="relative">
                                    <EventCard event={event as unknown as FeedEvent} />
                                    {event.distance_km !== null && (
                                        <span className="absolute top-3 right-3 text-xs text-[#8b949e] bg-[#1c2128] border border-[#30363d] rounded-full px-2 py-0.5">
                                            {event.distance_km} km away
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
