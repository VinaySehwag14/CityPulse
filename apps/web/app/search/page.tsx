'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import EventCard from '@/components/events/EventCard';
import Spinner from '@/components/ui/Spinner';
import type { FeedEvent, SearchResult } from '@/lib/types';
import { Search, MapPin, List, Map, X, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

// Mapbox uses window — dynamically loaded client-side only
const SearchMapView = dynamic(() => import('@/components/map/SearchMapView'), {
    ssr: false,
    loading: () => <div className="rounded-2xl bg-[#161b22] border border-[#30363d] h-[420px] flex items-center justify-center"><Spinner /></div>,
});

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[320px] flex items-center justify-center"><Spinner /></div>,
});

type ViewMode = 'list' | 'map';

export default function SearchPage() {
    // Search Params State
    const [q, setQ] = useState('');
    const [geoMode, setGeoMode] = useState(false);
    const [lat, setLat] = useState<number | undefined>();
    const [lng, setLng] = useState<number | undefined>();
    const [radius, setRadius] = useState<number>(10);

    // UI State
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [showFilters, setShowFilters] = useState(false);
    const [locationName, setLocationName] = useState<string | null>(null);

    // Debounced Params (Wait 400ms after user stops typing/sliding before fetching)
    const debouncedQ = useDebounce(q, 400);
    const debouncedRadius = useDebounce(radius, 400);
    const debouncedLat = useDebounce(lat, 400);
    const debouncedLng = useDebounce(lng, 400);

    const params = {
        q: debouncedQ.trim() || undefined,
        lat: geoMode ? debouncedLat : undefined,
        lng: geoMode ? debouncedLng : undefined,
        radius_km: geoMode ? debouncedRadius : undefined,
    };

    const { data: results, isLoading, isError } = useSearch(params);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Reverse Geocoding to get human-readable name when lat/lng changes
    useEffect(() => {
        if (!geoMode || !lat || !lng || !mapboxToken) {
            if (!geoMode) setLocationName(null);
            return;
        }

        async function fetchAddress() {
            try {
                const res = await fetch(
                    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxToken}`
                );
                const data = await res.json();
                if (data.features?.[0]) {
                    const feature = data.features[0];
                    const place = feature.properties.name || feature.properties.context?.place?.name || '';
                    setLocationName(place || 'Pin location');
                } else {
                    setLocationName('Pin location');
                }
            } catch (err) {
                console.error('Reverse geocoding failed:', err);
                setLocationName('Selected location');
            }
        }

        // Only fetch if it's the exact debounced value to avoid over-fetching while dragging
        if (lat === debouncedLat && lng === debouncedLng) {
            fetchAddress();
        }
    }, [debouncedLat, debouncedLng, geoMode, mapboxToken, lat, lng]);

    const handleUseCurrentLocation = () => {
        setShowFilters(true); // Open the filter drawer
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude);
                setLng(pos.coords.longitude);
                setGeoMode(true);
            },
            (err) => {
                console.error("Geolocation error:", err);
                alert("Please enable location permissions in your browser.");
            }
        );
    };

    const handleLocationPicked = (pickedLat: number, pickedLng: number) => {
        setLat(pickedLat);
        setLng(pickedLng);
        setGeoMode(true);
        setLocationName('Locating...'); // Temporary state while reverse geocoding
    };

    const clearLocation = () => {
        setGeoMode(false);
        setLat(undefined);
        setLng(undefined);
        setLocationName(null);
    };

    const fieldCls = 'bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-3 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors';

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#e6edf3] tracking-tight">Discover</h1>
                    <p className="text-[#8b949e] text-sm mt-1">Find events and communities near you</p>
                </div>
            </div>

            {/* Search Controls Layer */}
            <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 mb-8">
                {/* Main Search Bar */}
                <div className="flex gap-2 relative">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#0caee8] transition-colors" />
                        <input
                            placeholder="What are you looking for?"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className={`${fieldCls} w-full pl-11 shadow-sm font-medium`}
                        />
                        {q && (
                            <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#e6edf3] p-1">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <Button
                        variant={showFilters || geoMode ? "primary" : "secondary"}
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 shrink-0 transition-colors shadow-sm"
                        aria-label="Location filters"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline-block ml-2">{geoMode ? 'Location Set' : 'Filters'}</span>
                    </Button>
                </div>

                {/* Filter / Location Drawer */}
                {showFilters && (
                    <div className="pt-4 border-t border-[#30363d] animate-fade-in space-y-5">

                        {/* Current Location Badge & Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-medium text-[#e6edf3]">Search Area</h3>
                                {!geoMode ? (
                                    <button
                                        onClick={handleUseCurrentLocation}
                                        className="text-xs text-[#0caee8] bg-[#0caee8]/10 hover:bg-[#0caee8]/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                                    >
                                        <MapPin className="w-3.5 h-3.5" /> Use my location
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 pl-3 pr-1 py-1 rounded-full text-[#22c55e] text-xs">
                                        <span className="font-medium flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {locationName || 'Location set'}
                                        </span>
                                        <button onClick={clearLocation} className="p-1 hover:bg-[#22c55e]/20 rounded-full transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Distance Slider (Only visible if geo mode is on) */}
                            {geoMode && (
                                <div className="flex items-center gap-3 min-w-[200px]">
                                    <span className="text-xs text-[#8b949e] whitespace-nowrap">Within</span>
                                    <div className="flex-1 flex items-center gap-3 bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-1.5">
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            step="1"
                                            value={radius}
                                            onChange={(e) => setRadius(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#0caee8]"
                                        />
                                        <span className="text-sm font-semibold text-[#e6edf3] min-w-[36px] text-right">{radius}km</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Picker */}
                        <div className="bg-[#161b22] rounded-xl overflow-hidden border border-[#30363d] p-1">
                            <LocationPicker
                                initialLat={lat}
                                initialLng={lng}
                                onChange={handleLocationPicked}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 min-h-[40px]">
                <div className="flex items-center gap-3">
                    {/* Status Display */}
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                            <Spinner size="sm" /> <span>Searching...</span>
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-[#e6edf3]">
                            {results ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Ready to search'}
                        </p>
                    )}
                </div>

                {/* View Toggles */}
                {results && results.length > 0 && (
                    <div className="flex bg-[#161b22] border border-[#30363d] rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-[#30363d] text-[#e6edf3] shadow-sm' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                        >
                            <List className="w-4 h-4" /> <span className="hidden sm:block">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-[#30363d] text-[#e6edf3] shadow-sm' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                        >
                            <Map className="w-4 h-4" /> <span className="hidden sm:block">Map</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Error States */}
            {isError && (
                <div className="glass rounded-2xl p-6 text-center border-red-500/20 bg-red-500/5 my-8">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-base font-semibold text-[#e6edf3] mb-1">Search temporarily unavailable</p>
                    <p className="text-sm text-[#8b949e]">The database might be waking up (cold start). Give it a few seconds and try adjusting your search.</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && results && results.length === 0 && (
                <div className="glass rounded-2xl p-10 text-center my-8">
                    <div className="w-16 h-16 rounded-full bg-[#1c2128] flex items-center justify-center mx-auto mb-4 grayscale opacity-60 border border-[#30363d]">
                        <Search className="w-6 h-6 text-[#8b949e]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#e6edf3] mb-2">No events found</h3>
                    <p className="text-[#8b949e] max-w-sm mx-auto">
                        We couldn't find any events matching your current filters. Try expanding your search radius or modifying your keywords.
                    </p>
                    {geoMode && (
                        <button
                            onClick={() => setRadius(Math.min(radius + 10, 50))}
                            className="mt-6 text-[#0caee8] text-sm font-medium hover:underline"
                        >
                            + Expand radius by 10km
                        </button>
                    )}
                </div>
            )}

            {/* Main Content Area */}
            {!isError && results && results.length > 0 && (
                <div className="animate-fade-in">
                    {viewMode === 'map' ? (
                        <div className="shadow-2xl shadow-[#000]/50 rounded-2xl">
                            <SearchMapView
                                results={results}
                                center={lat && lng ? [lat, lng] : undefined}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {results.map((event: SearchResult) => (
                                <div key={event.id} className="relative group transition-transform hover:-translate-y-1 duration-300">
                                    <EventCard event={event as unknown as FeedEvent} />
                                    {event.distance_km !== null && (
                                        <div className="absolute top-4 right-4 text-xs font-semibold text-[#0caee8] bg-[#0caee8]/10 border border-[#0caee8]/20 backdrop-blur-md rounded-full px-2.5 py-1 pointer-events-none group-hover:bg-[#0caee8] group-hover:text-white transition-colors">
                                            {event.distance_km} km
                                        </div>
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
