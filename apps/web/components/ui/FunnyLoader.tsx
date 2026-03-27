'use client';

import { useState, useEffect } from 'react';
import { Coffee, Cloud, Sparkles, Zap, Heart, Ghost, Rocket } from 'lucide-react';

const MESSAGES = [
    { text: "Waking up the hamsters in the server room...", icon: Ghost },
    { text: "The database is still putting on its tie...", icon: Coffee },
    { text: "Searching for the coolest events in your area...", icon: Zap },
    { text: "Almost there! Just counting the social buzz...", icon: Heart },
    { text: "Polishing the map icons with virtual wax...", icon: Sparkles },
    { text: "Consulting with the city's coolest ghosts...", icon: Cloud },
    { text: "Launching the discovery rockets...", icon: Rocket },
    { text: "Negotiating with the API for faster data...", icon: Zap },
    { text: "Brewing extra caffeine for the backend...", icon: Coffee },
];

export default function FunnyLoader() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const { text, icon: Icon } = MESSAGES[index];

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 animate-fade-in">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0caee8]/10 border border-[#0caee8]/20 flex items-center justify-center animate-bounce">
                    <Icon className="w-8 h-8 text-[#0caee8]" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#22c55e] rounded-full border-2 border-[#0d1117] live-dot" />
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
                <p className="text-[#e6edf3] font-medium text-lg leading-tight transition-all duration-500">
                    {text}
                </p>
                <div className="flex justify-center gap-1.5 pt-2">
                    {MESSAGES.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-[#0caee8]' : 'w-1 bg-[#30363d]'}`} 
                        />
                    ))}
                </div>
            </div>

            <p className="text-[#8b949e] text-xs pt-4 max-w-[200px]">
                Our free-tier hosting takes a few seconds to wake up. Thanks for your patience! ✨
            </p>
        </div>
    );
}
