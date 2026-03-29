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
            <article className="glass rounded-2xl p-5 hover:border-[#0caee8]/40 hover:bg-[#1c2128]/80 transition-all duration-300 cursor-pointer group animate-fade-in shadow-sm hover:shadow-xl hover:shadow-[#0caee8]/5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="font-bold text-[#e6edf3] text-lg leading-tight group-hover:text-[#0caee8] transition-colors line-clamp-2">
                        {event.title}
                    </h2>
                    <div className="flex-shrink-0 pt-0.5">
                        {event.is_live
                            ? <Badge variant="live">Live Now</Badge>
                            : <Badge variant="default">Upcoming</Badge>
                        }
                    </div>
                </div>

                {/* Description */}
                {event.description && (
                    <p className="text-[#8b949e] text-sm mb-5 line-clamp-2 leading-relaxed">{event.description}</p>
                )}

                {/* AI Tags */}
                {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mb-5">
                        {event.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#1c2128] text-[#0caee8] border border-[#30363d] uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta */}
                <div className="flex flex-col gap-2 text-xs text-[#8b949e] mb-5">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-[#0caee8]/70" />
                        <span className="font-medium">{formatDate(event.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-[#0caee8]/70" />
                        <span className="font-medium tracking-tight">
                            {event.location_lat.toFixed(4)}, {event.location_lng.toFixed(4)}
                        </span>
                    </div>
                </div>

                {/* Social stats */}
                <div className="flex items-center gap-5 text-xs text-[#8b949e] border-t border-[#30363d]/50 pt-4 mt-2">
                    <span className="flex items-center gap-1.5 font-bold">
                        <Heart className="w-4 h-4 text-red-500/80" />
                        {event.like_count}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                        <Users className="w-4 h-4 text-[#0caee8]" />
                        <span className="text-[#0caee8]">{event.attendee_count}</span>
                        <span className="font-medium">going</span>
                    </span>
                </div>
            </article>
        </Link>
    );
}
