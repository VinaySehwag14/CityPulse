import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CityPulse – What\'s happening around you',
    description: 'Discover live and upcoming events in your city. Real-time feed ranked by freshness and social buzz.',
};

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                {/* Hero */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0caee8]/10 border border-[#0caee8]/30 rounded-full text-[#0caee8] text-xs font-medium mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
                        Live events near you
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-gradient leading-tight">
                        What's happening<br />around you?
                    </h1>
                    <p className="text-[#8b949e] text-lg max-w-md mx-auto">
                        CityPulse surfaces the freshest local events ranked by buzz. Live, trending, and just for you.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link
                        href="/feed"
                        className="px-8 py-3.5 bg-[#0caee8] text-white font-semibold rounded-xl hover:bg-[#0090c6] active:scale-[0.97] transition-all duration-200 inline-flex items-center gap-2 brand-glow"
                    >
                        Explore Feed
                    </Link>
                    <Link
                        href="/search"
                        className="px-8 py-3.5 bg-[#1c2128] text-[#e6edf3] font-semibold rounded-xl border border-[#30363d] hover:border-[#0caee8]/40 hover:bg-[#252b33] active:scale-[0.97] transition-all duration-200"
                    >
                        Search Events
                    </Link>
                </div>

                {/* Value props */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                        { icon: '⚡', label: 'Live ranked', sub: 'Never stale' },
                        { icon: '📍', label: 'Geo search', sub: 'Find nearby' },
                        { icon: '🔥', label: 'Social proof', sub: 'See what\'s hot' },
                    ].map(({ icon, label, sub }) => (
                        <div key={label} className="glass rounded-2xl p-4 text-center">
                            <div className="text-2xl mb-2">{icon}</div>
                            <p className="text-sm font-semibold text-[#e6edf3]">{label}</p>
                            <p className="text-xs text-[#8b949e] mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
