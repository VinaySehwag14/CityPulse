'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.hero-badge',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        )
            .fromTo('.hero-title',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
                '-=0.6'
            )
            .fromTo('.hero-subtitle',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.6'
            )
            .fromTo('.hero-cta',
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' },
                '-=0.4'
            );

        // Continuous subtle rotation for decorative blur blobs
        gsap.to('.hero-blob-1', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'linear',
            transformOrigin: 'center center'
        });
        gsap.to('.hero-blob-2', {
            rotation: -360,
            duration: 25,
            repeat: -1,
            ease: 'linear',
            transformOrigin: 'center center'
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden pt-20">
            {/* Animated Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] hero-blob-1 pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] hero-blob-2 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                {/* Badge */}
                <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 bg-[#0caee8]/10 border border-[#0caee8]/30 rounded-full text-[#0caee8] text-xs font-medium mb-4">
                    <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#0caee8" />
                                <stop offset="100%" stopColor="#38bdf8" />
                            </linearGradient>
                        </defs>
                        <path d="M16 3C11.582 3 8 6.582 8 11C8 16.5 16 28 16 28C16 28 24 16.5 24 11C24 6.582 20.418 3 16 3Z" fill="url(#bGrad)" />
                        <path d="M10 11H12L13.5 8.5L15 13.5L16.5 9L18 12.5L19.5 11H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot shadow-[0_0_8px_#22c55e]" />
                    Live Events Near You
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    <span className="hero-title block text-[#e6edf3]">Feel the pulse</span>
                    <span className="hero-title block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#0caee8] to-purple-400">of your city.</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle text-[#8b949e] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    CityPulse surfaces the freshest local events ranked by real-time social buzz. Find out what's trending, live, and happening right now.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/feed"
                        className="hero-cta px-8 py-4 bg-[#0caee8] text-white font-semibold rounded-2xl hover:bg-[#0090c6] active:scale-[0.97] transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_#0caee8]"
                    >
                        Explore Trending Events
                        <svg className="w-5 h-5 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <Link
                        href="/events/new"
                        className="hero-cta px-8 py-4 bg-[#1c2128] text-[#e6edf3] font-semibold rounded-2xl border border-[#30363d] hover:border-[#0caee8]/40 hover:bg-[#252b33] active:scale-[0.97] transition-all duration-200 inline-flex items-center justify-center gap-2"
                    >
                        Host an Event
                    </Link>
                </div>

                {/* Floating Mock Elements (Decorative) */}
                <div className="mt-16 relative h-32 md:h-48 w-full max-w-3xl mx-auto hidden sm:block">
                    <div className="absolute left-0 top-10 glass p-4 rounded-2xl border border-[#30363d]/50 shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">🪔</div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#e6edf3]">Bhandara @ Sector 12</p>
                                <p className="text-xs text-[#22c55e] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span> Live Now • 312 attended</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 glass p-4 rounded-2xl border border-[#30363d]/50 shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">💃</div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#e6edf3]">Mata ka Jagrata • Navratri</p>
                                <p className="text-xs text-[#8b949e]">Starts in 3 hours • 800 going</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <svg className="w-6 h-6 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
