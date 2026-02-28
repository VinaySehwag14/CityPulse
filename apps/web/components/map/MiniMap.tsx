'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

interface MiniMapProps {
    lat: number;
    lng: number;
}

export default function MiniMap({ lat, lng }: MiniMapProps) {
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Use Mapbox Static Images API for a clean, non-interactive mini map
    // Width 600px, height 160px. Pin style: pin-s+0caee8 (cyan)
    const staticMapUrl = mapboxToken
        ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+0caee8(${lng},${lat})/${lng},${lat},14,0/600x160?access_token=${mapboxToken}`
        : '';

    // Reverse geocode to get human-readable address
    useEffect(() => {
        if (!mapboxToken) {
            setLoading(false);
            return;
        }

        async function fetchAddress() {
            try {
                const res = await fetch(
                    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxToken}`
                );
                const data = await res.json();
                if (data.features?.[0]) {
                    // Extract a friendly string, e.g., "Connaught Place, New Delhi"
                    const feature = data.features[0];
                    const poi = feature.properties.name || '';
                    const place = feature.properties.context?.place?.name || '';
                    const district = feature.properties.context?.district?.name || '';

                    const parts = [poi, place, district].filter(Boolean);
                    setAddress(parts.length > 0 ? parts.join(', ') : 'Location on Map');
                } else {
                    setAddress('Location on Map');
                }
            } catch (err) {
                console.error('Reverse geocoding failed:', err);
                setAddress('Location on Map');
            } finally {
                setLoading(false);
            }
        }

        fetchAddress();
    }, [lat, lng, mapboxToken]);

    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    return (
        <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block group overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] transition-colors hover:border-[#8b949e]"
        >
            {/* The Map Image */}
            <div className="h-32 w-full relative bg-[#0d1117]">
                {mapboxToken ? (
                    <img
                        src={staticMapUrl}
                        alt="Map location"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8b949e] text-sm">
                        Map unavailable (Missing Token)
                    </div>
                )}
            </div>

            {/* Address Bar */}
            <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1c2128] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0caee8]/10 transition-colors">
                    <MapPin className="w-4 h-4 text-[#0caee8]" />
                </div>
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="h-4 bg-[#30363d] rounded w-2/3 animate-pulse" />
                    ) : (
                        <p className="text-sm font-medium text-[#e6edf3] truncate">
                            {address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
                        </p>
                    )}
                    <p className="text-xs text-[#8b949e] mt-0.5 group-hover:text-[#0caee8] transition-colors">
                        Open in Google Maps ↗
                    </p>
                </div>
            </div>
        </a>
    );
}
