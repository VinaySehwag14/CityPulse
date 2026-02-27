'use client';

import { useState, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search, X } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface GeoResult {
    id: string;
    place_name: string;
    center: [number, number]; // [lng, lat]
}

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ initialLat, initialLng, onChange }: LocationPickerProps) {
    const defaultLat = initialLat ?? 28.6139;
    const defaultLng = initialLng ?? 77.2090;

    const [viewState, setViewState] = useState({
        latitude: defaultLat,
        longitude: defaultLng,
        zoom: initialLat ? 14 : 10,
    });

    const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
        initialLat ? { lat: initialLat, lng: initialLng! } : null
    );

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GeoResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced Mapbox Geocoding API search
    const handleSearch = useCallback((val: string) => {
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!val.trim()) { setResults([]); setShowResults(false); return; }

        debounceRef.current = setTimeout(async () => {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=place,locality,neighborhood,address,poi`;
            const res = await fetch(url);
            const data = await res.json() as { features: GeoResult[] };
            setResults(data.features ?? []);
            setShowResults(true);
        }, 300);
    }, []);

    const selectResult = useCallback((result: GeoResult) => {
        const [lng, lat] = result.center;
        setMarkerPos({ lat, lng });
        setViewState((v) => ({ ...v, latitude: lat, longitude: lng, zoom: 15 }));
        setQuery(result.place_name);
        setResults([]);
        setShowResults(false);
        onChange(lat, lng);
    }, [onChange]);

    // Click on map to place marker
    const handleMapClick = useCallback((e: { lngLat: { lat: number; lng: number } }) => {
        const { lat, lng } = e.lngLat;
        setMarkerPos({ lat, lng });
        onChange(lat, lng);
    }, [onChange]);

    // Drag marker to fine-tune
    const handleMarkerDrag = useCallback((e: { lngLat: { lat: number; lng: number } }) => {
        const { lat, lng } = e.lngLat;
        setMarkerPos({ lat, lng });
        onChange(lat, lng);
    }, [onChange]);

    return (
        <div className="space-y-2">
            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
                <input
                    type="text"
                    placeholder="Search for a place…"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    className="w-full bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2.5 pl-9 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#e6edf3]"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* Autocomplete dropdown */}
                {showResults && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1c2128] border border-[#30363d] rounded-xl shadow-xl z-50 overflow-hidden">
                        {results.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => selectResult(r)}
                                className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-[#252b33] transition-colors text-left"
                            >
                                <MapPin className="w-4 h-4 text-[#0caee8] flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-[#e6edf3] line-clamp-2">{r.place_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#30363d]" style={{ height: 320 }}>
                <Map
                    {...viewState}
                    onMove={(e) => setViewState(e.viewState)}
                    onClick={handleMapClick}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    style={{ width: '100%', height: '100%' }}
                    cursor="crosshair"
                >
                    <NavigationControl position="top-right" />

                    {markerPos && (
                        <Marker
                            latitude={markerPos.lat}
                            longitude={markerPos.lng}
                            draggable
                            onDrag={handleMarkerDrag}
                            anchor="bottom"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-[#0caee8] border-2 border-white flex items-center justify-center shadow-lg"
                                    style={{ boxShadow: '0 0 16px rgba(12,174,232,0.5)' }}>
                                    <MapPin className="w-4 h-4 text-white" fill="white" />
                                </div>
                                <div className="w-0.5 h-3 bg-[#0caee8]" />
                            </div>
                        </Marker>
                    )}
                </Map>
            </div>

            {/* Coordinate display */}
            {markerPos ? (
                <p className="text-xs text-[#8b949e] text-center">
                    📍 {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)} — drag the pin to adjust
                </p>
            ) : (
                <p className="text-xs text-[#8b949e] text-center">
                    Search for a place or click on the map to set location
                </p>
            )}
        </div>
    );
}
