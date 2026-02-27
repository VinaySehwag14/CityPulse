import type { FeedEvent } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { Calendar, MapPin, Heart, Users } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
    event: FeedEvent;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

// Server Component — pure display, no interaction
export default function EventCard({ event }: EventCardProps) {
    return (
        <Link href={`/events/${event.id}`}>
            <article className="glass rounded-2xl p-4 hover:border-[#0caee8]/40 hover:bg-[#1c2128]/80 transition-all duration-200 cursor-pointer group animate-fade-in">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="font-semibold text-[#e6edf3] text-base leading-snug group-hover:text-[#0caee8] transition-colors line-clamp-2">
                        {event.title}
                    </h2>
                    <div className="flex-shrink-0">
                        {event.is_live
                            ? <Badge variant="live">Live Now</Badge>
                            : <Badge variant="default">Upcoming</Badge>
                        }
                    </div>
                </div>

                {/* Description */}
                {event.description && (
                    <p className="text-[#8b949e] text-sm mb-3 line-clamp-2">{event.description}</p>
                )}

                {/* Meta */}
                <div className="flex flex-col gap-1.5 text-xs text-[#8b949e] mb-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#0caee8]" />
                        {formatDate(event.start_time)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#0caee8]" />
                        {event.location_lat.toFixed(4)}, {event.location_lng.toFixed(4)}
                    </div>
                </div>

                {/* Social stats */}
                <div className="flex items-center gap-4 text-xs text-[#8b949e] border-t border-[#30363d] pt-3 mt-1">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-400" />
                        {event.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#0caee8]" />
                        {event.attendee_count} going
                    </span>
                </div>
            </article>
        </Link>
    );
}
