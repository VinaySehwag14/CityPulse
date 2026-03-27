import type { Metadata } from 'next';
import FeedList from '@/components/feed/FeedList';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Feed',
    description: 'Discover live and upcoming events happening around you right now.',
};

export default function FeedPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Hero header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient mb-1">What's happening</h1>
                <p className="text-[#8b949e] text-sm">Live events ranked by freshness & buzz</p>
            </div>

            <SignedOut>
                <div className="glass rounded-2xl p-6 text-center mb-6 border border-[#0caee8]/10 bg-[#0caee8]/5">
                    <p className="text-[#e6edf3] font-medium mb-1">New around here?</p>
                    <p className="text-[#8b949e] text-sm mb-4">Sign in to unlock likes, attendance, and live chat!</p>
                    <SignInButton mode="modal">
                        <button className="inline-flex items-center px-6 py-2 bg-[#0caee8] text-white text-sm font-bold rounded-xl hover:bg-[#0090c6] transition-all active:scale-95 shadow-[0_0_20px_rgba(12,174,232,0.2)]">
                            Join the Community
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>


            <SignedIn>
                <div className="mb-6 flex justify-end">
                    <Link
                        href="/events/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0caee8]/10 text-[#0caee8] border border-[#0caee8]/30 rounded-xl text-sm font-medium hover:bg-[#0caee8]/20 transition-all"
                    >
                        + Create Event
                    </Link>
                </div>
            </SignedIn>

            <FeedList />
        </div>
    );
}
