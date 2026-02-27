'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EmptyStateProps {
    tab?: string; // which feed tab is selected, for contextual messaging
    onClearFilter?: () => void;
}

// Floating particle — purely CSS animated dots
function Particle({ style }: { style: React.CSSProperties }) {
    return (
        <div
            className="absolute rounded-full bg-[#0caee8] opacity-20 pointer-events-none"
            style={style}
        />
    );
}

const PARTICLE_CONFIGS = [
    { width: 4, height: 4, top: '15%', left: '10%', animationDelay: '0s', animationDuration: '6s' },
    { width: 6, height: 6, top: '25%', left: '85%', animationDelay: '1.5s', animationDuration: '8s' },
    { width: 3, height: 3, top: '65%', left: '20%', animationDelay: '0.8s', animationDuration: '5s' },
    { width: 5, height: 5, top: '70%', left: '78%', animationDelay: '2.2s', animationDuration: '7s' },
    { width: 4, height: 4, top: '40%', left: '5%', animationDelay: '3s', animationDuration: '9s' },
    { width: 3, height: 3, top: '80%', left: '60%', animationDelay: '1s', animationDuration: '6.5s' },
];

const MESSAGES: Record<string, { headline: string; sub: string; cta: string; href: string }> = {
    live: { headline: 'Nothing live right now', sub: 'The city is quiet... for now. Check back soon or catch the upcoming buzz.', cta: 'See Upcoming Events', href: '#upcoming' },
    trending: { headline: 'No trending events yet', sub: 'Be the spark — create an event and watch the buzz build around it.', cta: 'Create an Event', href: '/events/new' },
    upcoming: { headline: 'No upcoming events', sub: 'A blank canvas. The next great city event could be yours to start.', cta: 'Create an Event', href: '/events/new' },
    all: { headline: 'The city is quiet', sub: 'No events yet — but every great movement starts with one person and one idea.', cta: 'Create an Event', href: '/events/new' },
};

export default function EmptyState({ tab = 'all', onClearFilter }: EmptyStateProps) {
    const [visible, setVisible] = useState(false);
    const msg = MESSAGES[tab] ?? MESSAGES.all;

    // Trigger entrance animation
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center py-8 px-4 overflow-hidden select-none">
            {/* Floating particles */}
            {PARTICLE_CONFIGS.map((cfg, i) => (
                <Particle
                    key={i}
                    style={{
                        width: cfg.width,
                        height: cfg.height,
                        top: cfg.top,
                        left: cfg.left,
                        animation: `floatY ${cfg.animationDuration} ease-in-out ${cfg.animationDelay} infinite alternate`,
                    }}
                />
            ))}

            {/* Radial glow behind image */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(12,174,232,0.08) 0%, transparent 70%)',
                }}
            />

            {/* Illustration */}
            <div
                className="relative transition-all duration-700 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                }}
            >
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-3xl"
                    style={{ boxShadow: '0 0 60px rgba(12,174,232,0.12), 0 0 120px rgba(12,174,232,0.05)' }}
                />
                <Image
                    src="/empty-city.png"
                    alt="Quiet city — no events yet"
                    width={340}
                    height={340}
                    priority
                    className="rounded-3xl mx-auto"
                    style={{ filter: 'saturate(1.1) contrast(1.05)' }}
                />
            </div>

            {/* Text content */}
            <div
                className="text-center mt-7 space-y-2 transition-all duration-700 delay-150 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                }}
            >
                <h2 className="text-xl font-bold text-[#e6edf3]">{msg.headline}</h2>
                <p className="text-[#8b949e] text-sm max-w-xs mx-auto leading-relaxed">{msg.sub}</p>
            </div>

            {/* CTA buttons */}
            <div
                className="flex flex-col sm:flex-row gap-3 mt-7 transition-all duration-700 delay-300 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(12px)',
                }}
            >
                <Link
                    href={msg.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0caee8] text-white font-semibold rounded-xl hover:bg-[#0090c6] active:scale-[0.97] transition-all duration-200 text-sm"
                    style={{ boxShadow: '0 0 20px rgba(12,174,232,0.25)' }}
                >
                    ⚡ {msg.cta}
                </Link>
                {onClearFilter && (
                    <button
                        onClick={onClearFilter}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1c2128] text-[#8b949e] font-medium rounded-xl border border-[#30363d] hover:text-[#e6edf3] hover:border-[#0caee8]/40 active:scale-[0.97] transition-all duration-200 text-sm"
                    >
                        View All Events
                    </button>
                )}
            </div>

            {/* Inline keyframe for float animation */}
            <style jsx>{`
        @keyframes floatY {
          from { transform: translateY(0px); }
          to   { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
