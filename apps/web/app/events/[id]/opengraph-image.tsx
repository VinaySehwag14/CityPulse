import { ImageResponse } from 'next/og';
import { apiGet } from '@/lib/api-client';
import type { EventDetail } from '@/lib/types';

// Performance configuration for Edge Runtime
export const runtime = 'edge';
export const alt = 'Event Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Cache revalidation period (1 hour)
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Fetch event data with a fail-safe fallback and optimized timeout
    // We use a direct fetch to ensure Edge caching works as expected
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://citypulse-api.vercel.app/api';
    
    let event: EventDetail | null = null;
    try {
        const res = await fetch(`${baseUrl}/events/${id}`, {
            next: { revalidate: 3600 }, // Cache the API response as well
            signal: AbortSignal.timeout(3000) // 3s timeout to prevent crawler blocking
        });
        const json = await res.json();
        event = json.success ? json.data : null;
    } catch (e) {
        console.error('OG Image Fetch Error:', e);
    }

    // Common styles for both success and fallback
    const containerStyle: any = {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1117', // Solid background for faster rendering and zero artifacting
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
    };

    if (!event) {
        return new ImageResponse(
            (
                <div style={containerStyle}>
                    <h1 style={{ fontSize: 80, fontWeight: 'black', color: 'white', marginBottom: 20 }}>CityPulse</h1>
                    <p style={{ fontSize: 40, color: '#0caee8', fontWeight: 'bold' }}>Hyperlocal discovery awaiting you.</p>
                </div>
            ),
            {
                ...size,
                headers: {
                    'Cache-Control': 'public, immutable, no-transform, max-age=3600',
                },
            }
        );
    }

    const startDate = new Date(event.start_time);
    
    // Safer date formatting for Edge runtime (some locales might not be present)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dateStr = `${days[startDate.getDay()]}, ${startDate.getDate()} ${months[startDate.getMonth()]}`;

    return new ImageResponse(
        (
            <div style={containerStyle}>
                {/* Simplified Background Accents for faster rendering */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '50%',
                    height: '70%',
                    borderRadius: '100%',
                    background: 'radial-gradient(circle, rgba(12,174,232,0.1) 0%, transparent 70%)',
                    zIndex: 0
                }} />

                {/* CityPulse Branding */}
                <div style={{
                    position: 'absolute',
                    top: 50,
                    left: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#0caee8',
                        borderRadius: 8
                    }} />
                    <span style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>CityPulse</span>
                </div>

                {/* "EXCLUSIVE INVITATION" Tag */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 100,
                    padding: '8px 24px',
                    marginBottom: 32,
                    display: 'flex'
                }}>
                    <span style={{ fontSize: 18, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '4px' }}>Invitation</span>
                </div>

                {/* Event Title */}
                <h1 style={{
                    fontSize: 84,
                    fontWeight: 900,
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: 24,
                    lineHeight: 1,
                    padding: '0 40px',
                    letterSpacing: '-2px'
                }}>
                    {event.title}
                </h1>

                {/* Event Date */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: 'rgba(12, 174, 232, 0.1)',
                    padding: '12px 32px',
                    borderRadius: 20,
                    border: '1px solid rgba(12, 174, 232, 0.2)'
                }}>
                    <span style={{ fontSize: 28, color: '#0caee8', fontWeight: 'bold' }}>{dateStr}</span>
                </div>

                {/* Footer URL */}
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <span style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>citypulse.app</span>
                </div>
            </div>
        ),
        {
            ...size,
            headers: {
                'Cache-Control': 'public, immutable, no-transform, max-age=3600, stale-while-revalidate=86400',
            },
        }
    );
}
