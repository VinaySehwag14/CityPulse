'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CreatorCTA() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.cta-card',
                start: 'top 80%',
            }
        });

        tl.fromTo('.cta-card',
            { scale: 0.95, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo('.cta-element',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
            '-=0.4'
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="cta-card relative overflow-hidden rounded-3xl glass border border-[#30363d] p-8 md:p-16 text-center">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#0caee8]/20 to-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#22c55e]/10 to-transparent rounded-full blur-[60px] pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <div className="cta-element inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c2128] border border-[#30363d] text-sm text-[#c9d1d9] mb-2 font-medium">
                            <span className="text-xl">✨</span> For Creators & Organizers
                        </div>
                        
                        <h2 className="cta-element text-4xl md:text-5xl font-bold text-[#e6edf3] tracking-tight">
                            Got something <span className="text-[#0caee8]">planned?</span>
                        </h2>
                        
                        <p className="cta-element text-[#8b949e] text-lg md:text-xl">
                            Stop fighting algorithms. Drop your event on the map, let our AI handle the tags, and instantly reach locals looking for exactly what you're hosting.
                        </p>
                        
                        <div className="cta-element pt-8">
                            <Link
                                href="/events/new"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e6edf3] text-[#0d1117] font-bold rounded-2xl hover:bg-white active:scale-[0.97] transition-all duration-200 shadow-[0_0_20px_rgba(230,237,243,0.3)] hover:shadow-[0_0_30px_rgba(230,237,243,0.5)]"
                            >
                                Drop Your Event
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
