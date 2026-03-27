'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Mock data showcasing Indian events
const MOCK_EVENTS = [
    { id: 1, title: 'Bhandara @ Sector 17 Gurudwara', time: 'Live Now', likes: 312, attendees: 450, tag: 'Bhandara', color: 'orange' },
    { id: 2, title: 'Raat Bhar Jagrata — Ram Mandir Colony', time: 'Tonight 11PM', likes: 189, attendees: 200, tag: 'Jagrata', color: 'purple' },
    { id: 3, title: 'Garba Night • Navratri Special', time: 'In 3 hours', likes: 540, attendees: 800, tag: 'Garba', color: 'pink' },
    { id: 4, title: 'Startup Founders Chai Pe Charcha', time: 'Tomorrow 6PM', likes: 230, attendees: 60, tag: 'Tech', color: 'blue' },
    { id: 5, title: 'House Party at Rohan\'s Terrace 🏠', time: 'Saturday 9PM', likes: 78, attendees: 35, tag: 'Party', color: 'blue' },
    { id: 6, title: 'Sunday Cricket League — Ground B', time: 'Sunday 7AM', likes: 95, attendees: 22, tag: 'Cricket', color: 'orange' },
    { id: 7, title: 'Dandiya Raas — Shiv Mandir Mela', time: 'Live Now', likes: 401, attendees: 600, tag: 'Dandiya', color: 'pink' },
    { id: 8, title: 'Antakshri Raat — Colony Maidaan', time: 'In 1 hour', likes: 130, attendees: 80, tag: 'Fun', color: 'purple' },
];

export default function TrendingPreview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate section entrance
        gsap.fromTo('.trending-header',
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1,
                scrollTrigger: {
                    trigger: '.trending-header',
                    start: 'top 85%',
                }
            }
        );

        // Infinite Marquee Effect
        if (trackRef.current) {
            // Duplicate the content to make it seamless
            const trackWidth = trackRef.current.scrollWidth / 2;
            
            gsap.to(trackRef.current, {
                x: -trackWidth,
                duration: 20,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    // This creates the seamless loop loop
                    x: gsap.utils.unitize((x) => parseFloat(x) % trackWidth)
                }
            });
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 border-y border-[#30363d] bg-[#0d1117] relative overflow-hidden">
            {/* Soft gradient backgrounds */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0caee8]/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4">
                <div className="trending-header text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#e6edf3] mb-4 tracking-tight">
                        Trending <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">Right Now</span>
                    </h2>
                    <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
                        See what the city is buzzing about. Join the crowd or start your own wave.
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden flex whitespace-nowrap mask-edges">
                    <div ref={trackRef} className="flex gap-6 w-max items-center">
                        {/* Render items twice for infinite loop effect */}
                        {[...MOCK_EVENTS, ...MOCK_EVENTS].map((event, idx) => (
                            <div key={`${event.id}-${idx}`} className="w-[300px] shrink-0 glass rounded-2xl p-5 border border-[#30363d] hover:border-[#0caee8]/50 hover:shadow-[0_0_20px_rgba(12,174,232,0.15)] transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded bg-${event.color}-500/10 text-${event.color}-400 border border-${event.color}-500/20`}>
                                        #{event.tag}
                                    </span>
                                    {event.time === 'Live Now' && (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#22c55e]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" /> Live
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-[#e6edf3] whitespace-normal line-clamp-2 mb-4">
                                    {event.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4 text-red-400" /> {event.likes}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-[#0caee8]" /> {event.attendees}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/feed"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1c2128] text-[#e6edf3] font-semibold rounded-xl border border-[#30363d] hover:border-[#0caee8]/40 hover:bg-[#252b33] active:scale-[0.97] transition-all duration-200"
                    >
                        View Full Feed
                    </Link>
                </div>
            </div>
            
            {/* Add global class for the CSS masking effect to fade out edges of marquee */}
            <style jsx global>{`
                .mask-edges {
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </section>
    );
}
