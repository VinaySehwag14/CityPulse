'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Map, Zap, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
    {
        id: 'realtime',
        title: 'Ranked by Real-Time Buzz',
        description: 'No more stale static lists. We rank events by live check-ins, saves, and comments so you always know where the energy is right now.',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        borderColor: 'border-yellow-400/20',
        align: 'left'
    },
    {
        id: 'map',
        title: 'Interactive City Map',
        description: 'Switch to map view to visually explore your neighborhood. Find spontaneous pop-ups, food trucks, and local concerts just around the corner.',
        icon: Map,
        color: 'text-[#0caee8]',
        bg: 'bg-[#0caee8]/10',
        borderColor: 'border-[#0caee8]/20',
        align: 'right'
    },
    {
        id: 'chat',
        title: 'Live Event Lobbies',
        description: 'Every live event gets a temporary chat room. Ask if there\'s a line, coordinate meetups, or just vibe with the crowd before you even arrive.',
        icon: MessageSquare,
        color: 'text-[#22c55e]',
        bg: 'bg-[#22c55e]/10',
        borderColor: 'border-[#22c55e]/20',
        align: 'left'
    }
];

export default function FeatureShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate section title
        gsap.fromTo('.feature-header',
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1,
                scrollTrigger: {
                    trigger: '.feature-header',
                    start: 'top 80%',
                }
            }
        );

        // Animate individual feature rows
        const rows = gsap.utils.toArray('.feature-row') as HTMLElement[];
        
        rows.forEach((row) => {
            const textContent = row.querySelector('.feature-content');
            const visualContent = row.querySelector('.feature-visual');
            const isLeft = row.dataset.align === 'left';

            // Text slides in slightly
            gsap.fromTo(textContent,
                { x: isLeft ? -50 : 50, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 75%',
                    }
                }
            );

            // Visual slides in from opposite side and scales up slightly
            gsap.fromTo(visualContent,
                { x: isLeft ? 50 : -50, scale: 0.9, opacity: 0 },
                {
                    x: 0, scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 75%',
                    }
                }
            );
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 px-4 overflow-hidden relative">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto">
                <div className="feature-header text-center mb-24 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#e6edf3] tracking-tight">
                        Built for <span className="text-[#0caee8]">Discovery</span>
                    </h2>
                    <p className="text-[#8b949e] max-w-xl mx-auto text-lg">
                        CityPulse combines location data with social sentiment to create a living map of your city's culture.
                    </p>
                </div>

                <div className="space-y-32">
                    {FEATURES.map((feat, idx) => {
                        const Icon = feat.icon;
                        const isLeft = feat.align === 'left';

                        return (
                            <div 
                                key={feat.id} 
                                data-align={feat.align}
                                className={`feature-row flex flex-col gap-12 items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                {/* Text Content */}
                                <div className="feature-content flex-1 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl ${feat.bg} border ${feat.borderColor} flex items-center justify-center shrink-0 shadow-lg`}>
                                        <Icon className={`w-7 h-7 ${feat.color}`} />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[#e6edf3]">
                                        {feat.title}
                                    </h3>
                                    <p className="text-[#8b949e] text-lg leading-relaxed">
                                        {feat.description}
                                    </p>
                                </div>

                                {/* Visual Fake "Screenshot" Content */}
                                <div className="feature-visual flex-1 w-full max-w-md">
                                    <div className={`aspect-square sm:aspect-video md:aspect-square w-full rounded-3xl glass border border-[#30363d] p-6 shadow-2xl relative overflow-hidden flex items-center justify-center`}>
                                        
                                        {/* Abstract representations of features instead of real images */}
                                        {feat.id === 'realtime' && (
                                            <div className="w-full space-y-4">
                                                <div className="h-20 glass rounded-xl border border-yellow-400/30 flex items-center px-4 gap-4 animate-pulse-slow">
                                                    <div className="w-12 h-12 rounded-lg bg-[#161b22]"/>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-3 w-1/2 bg-[#30363d] rounded-full"/>
                                                        <div className="h-2 w-1/4 bg-[#30363d] rounded-full"/>
                                                    </div>
                                                    <div className="text-yellow-400 text-sm font-bold">#1 Trending</div>
                                                </div>
                                                <div className="h-20 glass rounded-xl border border-[#30363d] flex items-center px-4 gap-4 opacity-50">
                                                    <div className="w-12 h-12 rounded-lg bg-[#161b22]"/>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-3 w-2/3 bg-[#30363d] rounded-full"/>
                                                        <div className="h-2 w-1/3 bg-[#30363d] rounded-full"/>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {feat.id === 'map' && (
                                            <div className="w-full h-full relative rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
                                                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#30363d_1px,transparent_1px)] [background-size:16px_16px]" />
                                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0caee8] shadow-[0_0_20px_#0caee8]">
                                                    <div className="absolute inset-0 border border-[#0caee8] rounded-full animate-ping" />
                                                 </div>
                                                 <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_15px_#c084fc]" />
                                                 <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_15px_#22c55e]" />
                                            </div>
                                        )}

                                        {feat.id === 'chat' && (
                                            <div className="w-full space-y-3">
                                                <div className="flex justify-start">
                                                    <div className="bg-[#1c2128] border border-[#30363d] text-[#e6edf3] py-2 px-4 rounded-2xl rounded-tl-sm text-sm">
                                                        Is there a long line right now?
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#e6edf3] py-2 px-4 rounded-2xl rounded-tr-sm text-sm">
                                                        Nope, walk right in! Live music just started. 🎸
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
