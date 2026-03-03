'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Copy, CheckCircle2, MessageCircle, Instagram, MoreHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ShareButtonProps {
    title: string;
    description?: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [justCopied, setJustCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out "${title}" on CityPulse! ${url}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setJustCopied(true);
            setTimeout(() => setJustCopied(false), 2000);
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleWhatsApp = () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank');
        setIsOpen(false);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out ${title} on CityPulse!`,
                    url: url
                });
            } catch (err) {
                // Ignore AbortError (user closed the share sheet)
            }
        } else {
            // Fallback if native share isn't supported
            handleCopy();
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 p-0 rounded-full"
                aria-label="Share options"
            >
                {justCopied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden glass border border-[#30363d] shadow-2xl z-50 animate-fade-in-up">
                    <div className="flex flex-col py-1">
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#1c2128] transition-colors text-left"
                        >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            WhatsApp
                        </button>

                        <button
                            onClick={handleNativeShare}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#1c2128] transition-colors text-left"
                        >
                            <Instagram className="w-4 h-4 text-pink-500" />
                            Instagram / Others
                        </button>

                        <div className="h-px bg-[#30363d] my-1 mx-2" />

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#1c2128] transition-colors text-left"
                        >
                            {justCopied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#8b949e]" />}
                            {justCopied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
