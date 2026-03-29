import { ImageResponse } from 'next/og';
import { apiGet } from '@/lib/api-client';
import type { EventDetail } from '@/lib/types';

// Image generation config
export const runtime = 'edge';
export const alt = 'Event Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Fetch event data (Edge compatible)
    // Note: We use absolute API URL because edge might not have the same base
    const event = await apiGet<EventDetail>(`/events/${id}`).catch(() => null);

    if (!event) {
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0d1117',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}>
                    <h1 style={{ fontSize: 60, fontWeight: 'black', marginBottom: 20 }}>CityPulse</h1>
                    <p style={{ fontSize: 30, color: '#8b949e' }}>Experience Your City</p>
                </div>
            )
        );
    }

    const startDate = new Date(event.start_time);
    const dateStr = startDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return new ImageResponse(
        (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #050a12 0%, #0d1117 100%)',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Mesh Gradient Background */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '60%',
                    height: '80%',
                    borderRadius: '100%',
                    background: 'radial-gradient(circle, rgba(12,174,232,0.15) 0%, transparent 70%)',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-10%',
                    width: '50%',
                    height: '70%',
                    borderRadius: '100%',
                    background: 'radial-gradient(circle, rgba(255,157,0,0.1) 0%, transparent 70%)',
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
                    <span style={{ fontSize: 32, fontWeight: 'black', color: 'white', letterSpacing: '-1px' }}>CityPulse</span>
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

                {/* "Join the Discovery" CTA */}
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    right: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <span style={{ fontSize: 24, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.4)' }}>Discover More at</span>
                    <span style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>citypulse.vercel.app</span>
                </div>
            </div>
        )
    );
}
