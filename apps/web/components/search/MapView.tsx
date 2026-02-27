'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import type { SearchResult } from '@/lib/types';

// Fix Leaflet default marker icon broken by webpack
// https://github.com/Leaflet/Leaflet/issues/4968
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Live event: green dot marker
const LiveIcon = L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid white;box-shadow:0 0 8px rgba(34,197,94,0.6)"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

interface MapViewProps {
    results: SearchResult[];
    center?: [number, number];
}

export default function MapView({ results, center }: MapViewProps) {
    const mapCenter: [number, number] = center ?? (
        results.length > 0
            ? [results[0].location_lat, results[0].location_lng]
            : [28.6139, 77.2090] // default: New Delhi
    );

    return (
        <div className="rounded-2xl overflow-hidden border border-[#30363d]" style={{ height: 420 }}>
            <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%', background: '#0d1117' }}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {results.map((event) => {
                    const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) > new Date();
                    return (
                        <Marker
                            key={event.id}
                            position={[event.location_lat, event.location_lng]}
                            icon={isLive ? LiveIcon : DefaultIcon}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <p className="font-semibold text-sm mb-1">{event.title}</p>
                                    {isLive && <span className="text-xs text-green-600 font-medium">🟢 Live now</span>}
                                    {event.distance_km !== null && (
                                        <p className="text-xs text-gray-500 mt-0.5">{event.distance_km} km away</p>
                                    )}
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="block mt-2 text-xs text-blue-600 hover:underline"
                                    >
                                        View details →
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
