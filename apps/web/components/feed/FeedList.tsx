'use client';

import { useRef, useCallback, useState, useMemo } from 'react';
import { useFeed } from '@/hooks/useFeed';
import EventCard from '@/components/events/EventCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import type { FeedEvent } from '@/lib/types';

type Tab = 'all' | 'live' | 'trending' | 'upcoming';

const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🌐' },
    { id: 'live', label: 'Live Now', emoji: '🔴' },
    { id: 'trending', label: 'Trending', emoji: '🔥' },
    { id: 'upcoming', label: 'Upcoming', emoji: '📅' },
];

function filterEvents(events: FeedEvent[], tab: Tab): FeedEvent[] {
    switch (tab) {
        case 'live': return events.filter((e) => e.is_live);
        case 'trending': return events.filter((e) => !e.is_live).sort((a, b) => b.score - a.score).slice(0, 20);
        case 'upcoming': return events.filter((e) => !e.is_live).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        default: return events;
    }
}

export default function FeedList() {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        if (isFetchingNextPage) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage();
        });
        if (node) observerRef.current.observe(node);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

    const allEvents = useMemo(() => data?.pages.flatMap((p) => p.events) ?? [], [data]);
    const displayEvents = useMemo(() => filterEvents(allEvents, activeTab), [allEvents, activeTab]);
    const liveCount = allEvents.filter((e) => e.is_live).length;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-4 h-40 animate-pulse bg-[#161b22]" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-16 text-[#8b949e]">
                <p className="text-lg">Failed to load feed. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Section tabs */}
            <div className="flex gap-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-1">
                {TABS.map(({ id, label, emoji }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === id
                                ? 'bg-[#0caee8] text-white shadow-sm'
                                : 'text-[#8b949e] hover:text-[#e6edf3]'
                            }`}
                    >
                        <span className="hidden sm:inline">{emoji}</span>
                        {label}
                        {id === 'live' && liveCount > 0 && (
                            <span className="ml-1 w-4 h-4 rounded-full bg-[#22c55e] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                                {liveCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Empty state — uses Imagen illustration */}
            {displayEvents.length === 0 ? (
                <EmptyState
                    tab={activeTab}
                    onClearFilter={activeTab !== 'all' ? () => setActiveTab('all') : undefined}
                />
            ) : (
                displayEvents.map((event) => <EventCard key={event.id} event={event} />)
            )}

            {/* Infinite scroll sentinel — only on "all" tab */}
            {activeTab === 'all' && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    {isFetchingNextPage && <Spinner size="sm" />}
                    {!hasNextPage && allEvents.length > 0 && (
                        <p className="text-xs text-[#8b949e]">You've seen it all ✨</p>
                    )}
                </div>
            )}
        </div>
    );
}
