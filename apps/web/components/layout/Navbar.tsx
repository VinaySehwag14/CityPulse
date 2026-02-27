'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { Zap, Search, PlusCircle, Home } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/events/new', label: 'Create', icon: PlusCircle },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#30363d]">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Zap className="w-5 h-5 text-[#0caee8]" fill="currentColor" />
                    <span className="text-gradient">CityPulse</span>
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
