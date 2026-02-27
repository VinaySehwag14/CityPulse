'use client';

import { useRef, useCallback } from 'react';
import { useFeed } from '@/hooks/useFeed';
import EventCard from '@/components/events/EventCard';
import Spinner from '@/components/ui/Spinner';

export default function FeedList() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed();

    // Intersection Observer for infinite scroll
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        if (isFetchingNextPage) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage();
        });
        if (node) observerRef.current.observe(node);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

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

    const events = data?.pages.flatMap((p) => p.events) ?? [];

    if (events.length === 0) {
        return (
            <div className="text-center py-16 text-[#8b949e]">
                <p className="text-2xl mb-2">🌆</p>
                <p className="text-lg font-medium text-[#e6edf3]">Nothing happening right now</p>
                <p className="text-sm mt-1">Be the first to create an event!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="flex justify-center py-4">
                {isFetchingNextPage && <Spinner size="sm" />}
                {!hasNextPage && events.length > 0 && (
                    <p className="text-xs text-[#8b949e]">You've seen it all ✨</p>
                )}
            </div>
        </div>
    );
}
