'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { Search, PlusCircle, Home } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/events/new', label: 'Create', icon: PlusCircle },
];

/** CityPulse brand mark — map pin with pulse wave */
function CityPulseLogo({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="cpGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0caee8" />
                    <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
            </defs>
            {/* Map pin */}
            <path d="M16 3C11.582 3 8 6.582 8 11C8 16.5 16 28 16 28C16 28 24 16.5 24 11C24 6.582 20.418 3 16 3Z" fill="url(#cpGrad)" />
            {/* Pulse wave inside pin */}
            <path d="M10 11H12L13.5 8.5L15 13.5L16.5 9L18 12.5L19.5 11H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#30363d]">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
                    <CityPulseLogo size={28} />
                    <span className="text-gradient tracking-tight font-display font-bold">CityPulse</span>
                </Link>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                pathname === href
                                    ? 'bg-[#0caee8]/10 text-[#0caee8]'
                                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-sm font-medium rounded-xl bg-[#0caee8] text-white hover:bg-[#0090c6] transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[#30363d]">
                <div className="flex items-center justify-around py-2">
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all',
                                pathname === href ? 'text-[#0caee8]' : 'text-[#8b949e]'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
