'use client';

import { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { SearchResult } from '@/lib/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface SearchMapViewProps {
    results: SearchResult[];
    center?: [number, number]; // [lat, lng]
}

export default function SearchMapView({ results, center }: SearchMapViewProps) {
    const defaultLat = center?.[0] ?? (results[0]?.location_lat ?? 28.6139);
    const defaultLng = center?.[1] ?? (results[0]?.location_lng ?? 77.2090);

    const [viewState, setViewState] = useState({
        latitude: defaultLat,
        longitude: defaultLng,
        zoom: 12,
    });

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedEvent = results.find((r) => r.id === selectedId);

    return (
        <div className="rounded-2xl overflow-hidden border border-[#30363d]" style={{ height: 420 }}>
            <Map
                {...viewState}
                onMove={(e) => setViewState(e.viewState)}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                style={{ width: '100%', height: '100%' }}
            >
                <NavigationControl position="top-right" />

                {results.map((event) => {
                    const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) > new Date();
                    return (
                        <Marker
                            key={event.id}
                            latitude={event.location_lat}
                            longitude={event.location_lng}
                            anchor="bottom"
                            onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedId(event.id); }}
                        >
                            <div className="cursor-pointer flex flex-col items-center group">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isLive ? 'bg-[#22c55e]' : 'bg-[#0caee8]'
                                        }`}
                                    style={{ boxShadow: isLive ? '0 0 12px rgba(34,197,94,0.5)' : '0 0 12px rgba(12,174,232,0.4)' }}
                                >
                                    <MapPin className="w-4 h-4 text-white" fill="white" />
                                </div>
                                <div className="w-0.5 h-2 bg-white opacity-60" />
                            </div>
                        </Marker>
                    );
                })}

                {selectedEvent && (
                    <Popup
                        latitude={selectedEvent.location_lat}
                        longitude={selectedEvent.location_lng}
                        anchor="top"
                        offset={[0, -40]}
                        onClose={() => setSelectedId(null)}
                        closeButton={true}
                        closeOnClick={false}
                    >
                        <div className="min-w-[180px] p-1">
                            <p className="font-semibold text-sm text-gray-900 mb-1">{selectedEvent.title}</p>
                            {new Date(selectedEvent.start_time) <= new Date() && new Date(selectedEvent.end_time) > new Date() && (
                                <span className="text-xs text-green-600 font-medium">🟢 Live now</span>
                            )}
                            {selectedEvent.distance_km !== null && (
                                <p className="text-xs text-gray-500 mt-0.5">{selectedEvent.distance_km} km away</p>
                            )}
                            <Link
                                href={`/events/${selectedEvent.id}`}
                                className="block mt-2 text-xs text-blue-600 hover:underline font-medium"
                            >
                                View event →
                            </Link>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
