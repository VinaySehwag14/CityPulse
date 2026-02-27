'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Heart, Users, Calendar, MapPin, MessageCircle, Pencil, Trash2 } from 'lucide-react';

import { useEvent, useDeleteEvent } from '@/hooks/useEvents';
import { useLike, useAttend, useAddComment } from '@/hooks/useInteractions';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import ChatWindow from '@/components/chat/ChatWindow';

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
    const router = useRouter();
    const { user: clerkUser, isSignedIn } = useUser();

    const { data: event, isLoading, isError } = useEvent(eventId);
    const like = useLike(eventId);
    const attend = useAttend(eventId);
    const addComment = useAddComment(eventId);
    const deleteEvent = useDeleteEvent();

    const [comment, setComment] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (isError || !event) return <p className="text-center text-[#8b949e] py-20">Event not found.</p>;

    const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) > new Date();
    // Owner check: compare Clerk userId against event.created_by (DB stores clerk_id)
    const isOwner = !!clerkUser && clerkUser.id === event.created_by;

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        await addComment.mutateAsync(comment.trim());
        setComment('');
    };

    const handleDelete = async () => {
        await deleteEvent.mutateAsync(eventId);
        router.push('/feed');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">

            {/* Header row */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {isLive ? <Badge variant="live">Live Now</Badge> : <Badge variant="default">Upcoming</Badge>}
                    </div>
                    {/* Owner actions */}
                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <Link href={`/events/${eventId}/edit`}>
                                <Button variant="ghost" size="sm" className="gap-1.5">
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </Button>
                            </Link>
                            {!confirmDelete ? (
                                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)} className="gap-1.5">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </Button>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-red-400">Sure?</span>
                                    <Button variant="danger" size="sm" loading={deleteEvent.isPending} onClick={handleDelete}>
                                        Yes
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                                        No
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-[#e6edf3]">{event.title}</h1>
                {event.description && (
                    <p className="text-[#8b949e] text-base leading-relaxed">{event.description}</p>
                )}
            </div>

            {/* Meta */}
            <div className="glass rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#8b949e]">
                    <Calendar className="w-4 h-4 text-[#0caee8] flex-shrink-0" />
                    <div>
                        <p>{formatDate(event.start_time)}</p>
                        <p className="text-xs opacity-75">Ends: {formatDate(event.end_time)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#8b949e]">
                    <MapPin className="w-4 h-4 text-[#0caee8] flex-shrink-0" />
                    {event.location_lat.toFixed(5)}, {event.location_lng.toFixed(5)}
                </div>
            </div>

            {/* Social Actions */}
            {isSignedIn && (
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => like.mutate()} loading={like.isPending} className="flex-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        {event.like_count} Like{event.like_count !== 1 ? 's' : ''}
                    </Button>
                    <Button variant="primary" onClick={() => attend.mutate('going')} loading={attend.isPending} className="flex-1">
                        <Users className="w-4 h-4" />
                        {event.attendee_count} Going
                    </Button>
                </div>
            )}

            {/* Attendees */}
            {event.attendees.length > 0 && (
                <div className="glass rounded-2xl p-4">
                    <h2 className="text-sm font-semibold text-[#e6edf3] mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0caee8]" />
                        Attendees ({event.attendee_count})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {event.attendees.slice(0, 10).map((a) => (
                            <div key={a.user_id} className="flex items-center gap-1.5 text-xs text-[#8b949e]">
                                <Avatar size="sm" name={a.user_id.slice(0, 6)} />
                                <Badge variant={a.status === 'going' ? 'going' : 'interested'}>{a.status}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Event Lobby Chat — only visible while event is live (FEATURES.md §6) */}
            {isLive && isSignedIn && (
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
                        Live Chat
                    </h2>
                    <ChatWindow eventId={eventId} />
                </div>
            )}

            {/* Comments */}
            <div className="glass rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-[#e6edf3] mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#0caee8]" />
                    Comments ({event.comments.length})
                </h2>

                {isSignedIn && (
                    <form onSubmit={handleComment} className="flex gap-2 mb-4">
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment…"
                            maxLength={1000}
                            className="flex-1 bg-[#1c2128] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors"
                        />
                        <Button type="submit" size="sm" loading={addComment.isPending} disabled={!comment.trim()}>
                            Post
                        </Button>
                    </form>
                )}

                <div className="space-y-3">
                    {event.comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                            <Avatar size="sm" name={c.user_id.slice(0, 6)} />
                            <div className="flex-1">
                                <p className="text-sm text-[#e6edf3]">{c.content}</p>
                                <p className="text-xs text-[#8b949e] mt-0.5">{new Date(c.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                    {event.comments.length === 0 && (
                        <p className="text-[#8b949e] text-sm text-center py-4">No comments yet. Be the first!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
