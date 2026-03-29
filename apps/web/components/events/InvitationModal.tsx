'use client';

import { useState, useRef } from 'react';
import { X, Share2, Copy, Check, Sparkles, Calendar } from 'lucide-react';
import { EventDetail } from '@/lib/types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InvitationModalProps {
    event: EventDetail;
    isOpen: boolean;
    onClose: () => void;
}

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export default function InvitationModal({ event, isOpen, onClose }: InvitationModalProps) {
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    if (!isOpen) return null;

    const eventUrl = `${window.location.origin}/events/${event.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(eventUrl)}&bgcolor=ffffff&color=000000&margin=10`;

    const handleCopy = () => {
        navigator.clipboard.writeText(eventUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `You're invited: ${event.title}. Check it out on CityPulse!`,
                url: eventUrl,
            }).catch(() => handleCopy());
        } else {
            handleCopy();
        }
    };

    const handleWhatsAppShare = () => {
        const text = `You're invited to ${event.title}! Check out the details and get your pass here: ${eventUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate tilt (limit to 10 degrees)
        const rotY = (e.clientX - centerX) / (rect.width / 2) * 10;
        const rotX = -(e.clientY - centerY) / (rect.height / 2) * 10;
        
        setTilt({ x: rotX, y: rotY });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setTilt({ x: 0, y: 0 });
    };

    // Helper to pick theme based on content
    const getTheme = () => {
        const title = event.title.toLowerCase();
        if (title.includes('bhandara') || title.includes('puja') || title.includes('jagrata') || title.includes('bhajan')) {
            return {
                bg: 'bg-[#120a05]',
                mesh: 'bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,157,0,0.3)_0%,transparent_60%),radial-gradient(circle_at_0%_0%,rgba(255,80,0,0.2)_0%,transparent_40%)]',
                accent: 'text-[#ff9d00]',
                border: 'border-[#ff9d00]/30',
                glow: 'shadow-[0_0_80px_rgba(255,157,0,0.25)]',
                label: 'Sacred Gathering',
                icon: '🪔'
            };
        }
        if (title.includes('party') || title.includes('club') || title.includes('dj') || title.includes('dance')) {
            return {
                bg: 'bg-[#0a0512]',
                mesh: 'bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(191,0,255,0.3)_0%,transparent_60%),radial-gradient(circle_at_100%_100%,rgba(0,174,232,0.2)_0%,transparent_50%)]',
                accent: 'text-[#bf00ff]',
                border: 'border-[#bf00ff]/30',
                glow: 'shadow-[0_0_80px_rgba(191,0,255,0.25)]',
                label: 'The Pulse Night',
                icon: '🎆'
            };
        }
        if (title.includes('cricket') || title.includes('match') || title.includes('sports') || title.includes('yoga')) {
            return {
                bg: 'bg-[#05120a]',
                mesh: 'bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(34,197,94,0.3)_0%,transparent_60%),radial-gradient(circle_at_0%_100%,rgba(6,182,212,0.2)_0%,transparent_30%)]',
                accent: 'text-[#22c55e]',
                border: 'border-[#22c55e]/30',
                glow: 'shadow-[0_0_80px_rgba(34,197,94,0.25)]',
                label: 'Active Living',
                icon: '🎾'
            };
        }
        // Default Brand Azure
        return {
            bg: 'bg-[#050a12]',
            mesh: 'bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(12,174,232,0.3)_0%,transparent_60%),radial-gradient(circle_at_0%_100%,rgba(56,189,248,0.2)_0%,transparent_50%)]',
            accent: 'text-[#0caee8]',
            border: 'border-[#0caee8]/30',
            glow: 'shadow-[0_0_80px_rgba(12,174,232,0.25)]',
            label: 'Exclusive Discovery',
            icon: '✨'
        };
    };

    const theme = getTheme();
    const startDate = new Date(event.start_time);
    const formattedDate = startDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const formattedTime = startDate.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Ultra-dark backdrop with heavy blur */}
            <div 
                className="absolute inset-0 bg-[#000]/90 backdrop-blur-md animate-fade-in" 
                onClick={onClose} 
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm flex flex-col items-center gap-8 animate-slide-up perspective-2000">
                
                {/* 3D Invitation Card */}
                <div 
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: isHovering ? 'none' : 'all 0.5s ease'
                    } as React.CSSProperties}
                    className={cn(
                        "w-full aspect-[4/5] relative overflow-hidden rounded-[3rem] border border-white/10 p-10 flex flex-col items-center justify-between transition-all duration-700 cursor-default",
                        theme.bg,
                        theme.glow,
                        "transform-gpu translate-z-10"
                    )}
                >
                    {/* Mesh Gradient Overlay - Dynamic Flare */}
                    <div 
                        className={cn("absolute inset-0 pointer-events-none opacity-80 mix-blend-screen", theme.mesh)} 
                        style={{ 
                            '--x': `${(tilt.y + 10) * 5}%`, 
                            '--y': `${(-tilt.x + 10) * 5}%` 
                        } as React.CSSProperties}
                    />
                    
                    {/* Gloss Flare Effect */}
                    <div 
                        className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                        style={{
                            transform: `translateX(${tilt.y * 5}px) translateY(${-tilt.x * 5}px)`,
                            opacity: isHovering ? 0.3 : 0
                        } as React.CSSProperties}
                    />

                    {/* TOP SECTION: Invitation Tag */}
                    <div className="relative z-10 flex flex-col items-center gap-4 translate-z-20">
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2">
                            <Sparkles className={cn("w-3.5 h-3.5", theme.accent)} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Invitation</span>
                        </div>
                    </div>

                    {/* MIDDLE SECTION: Title & Event Type */}
                    <div className="relative z-10 text-center space-y-4 px-2 translate-z-30">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                            {event.title}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">{theme.icon}</span>
                            <span className={cn("text-sm font-bold tracking-widest uppercase opacity-90", theme.accent)}>
                               {theme.label}
                            </span>
                        </div>
                    </div>

                    {/* DETAILS SECTION: Metadata */}
                    <div className="relative z-10 w-full px-4 space-y-6 translate-z-20">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between text-left">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">When</span>
                                    <p className="text-base font-bold text-white leading-none">{formattedDate}</p>
                                    <p className={cn("text-xs font-semibold opacity-70", theme.accent)}>{formattedTime}</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white/60" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </div>

                    {/* BOTTOM SECTION: Branding & CTA */}
                    <div className="relative z-10 flex flex-col items-center gap-4 translate-z-40">
                        <div className="group relative">
                            {/* Real QR Code - Functional */}
                            <div className="w-20 h-20 bg-white p-1 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl overflow-hidden flex items-center justify-center">
                                <img src={qrCodeUrl} alt="Event QR Code" className="w-[85%] h-[85%] object-contain" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Powered By</span>
                            <span className="text-base font-bold text-gradient tracking-tight">CityPulse</span>
                        </div>
                    </div>
                </div>

                {/* Main Actions - Grid Layout */}
                <div className="grid grid-cols-2 gap-3 w-full animate-delay-200">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95"
                    >
                        <Share2 className="w-4 h-4" />
                        Options
                    </button>
                    
                    {/* Dedicated WhatsApp Share - Standout Button */}
                    <button 
                        onClick={handleWhatsAppShare}
                        className="col-span-2 flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-[#25D366] text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#25D366]/20 group"
                    >
                        <svg className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Share on WhatsApp
                    </button>

                    <button 
                        onClick={onClose}
                        className="col-span-2 flex items-center justify-center gap-2 py-4 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mt-2"
                    >
                        <X className="w-4 h-4" />
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
