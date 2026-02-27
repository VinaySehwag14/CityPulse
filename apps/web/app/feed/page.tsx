import type { Metadata } from 'next';
import FeedList from '@/components/feed/FeedList';
import { SignedIn, SignedOut } from '@clerk/nextjs';
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
                <div className="glass rounded-2xl p-6 text-center mb-6 border border-[#0caee8]/20">
                    <p className="text-[#e6edf3] font-medium mb-2">Sign in to interact with events</p>
                    <p className="text-[#8b949e] text-sm mb-4">Like, attend, and chat with the community</p>
                    <Link
                        href="/sign-in"
                        className="inline-flex items-center px-5 py-2.5 bg-[#0caee8] text-white text-sm font-medium rounded-xl hover:bg-[#0090c6] transition-colors"
                    >
                        Sign In
                    </Link>
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
