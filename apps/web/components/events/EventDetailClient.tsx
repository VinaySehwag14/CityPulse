'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { Heart, Users, Calendar, MessageCircle, Pencil, Trash2, Share2, Copy, CheckCircle2, Sparkles as SparklesIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useEvent, useDeleteEvent } from '@/hooks/useEvents';
import { useLike, useAttend, useAddComment } from '@/hooks/useInteractions';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import ChatWindow from '@/components/chat/ChatWindow';
import MiniMap from '@/components/map/MiniMap';
import ShareButton from '@/components/events/ShareButton';
import InvitationModal from '@/components/events/InvitationModal';

function formatEventTime(startIso: string, endIso: string) {
    const start = new Date(startIso);
    const end = new Date(endIso);

    const sameDay = start.toDateString() === end.toDateString();

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };

    const startDate = start.toLocaleDateString('en-US', dateOptions);
    const startTime = start.toLocaleTimeString('en-US', timeOptions);
    const endTime = end.toLocaleTimeString('en-US', timeOptions);

    if (sameDay) {
        return `${startDate} • ${startTime} - ${endTime}`;
    }

    const endDate = end.toLocaleDateString('en-US', dateOptions);
    return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
    const router = useRouter();
    const { user: clerkUser, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    
    // Hooks
    const { data: event, isLoading, isError } = useEvent(eventId);
    const like = useLike(eventId);
    const attend = useAttend(eventId);
    const addComment = useAddComment(eventId);
    const deleteEvent = useDeleteEvent();
    
    const [comment, setComment] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [interactionError, setInteractionError] = useState<string | null>(null);

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (isError || !event) return <p className="text-center text-[#8b949e] py-20">Event not found.</p>;

    const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) > new Date();
    const isOwner = !!clerkUser && clerkUser.id === event.created_by;
    const isAttending = event.attendees.some(a => a.user_id === clerkUser?.id);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || addComment.isPending) return;
        try {
            await addComment.mutateAsync(comment.trim());
            setComment('');
        } catch (err) {
            console.error('Comment failed', err);
        }
    };

    const handleDelete = async () => {
        if (deleteEvent.isPending) return;
        try {
            await deleteEvent.mutateAsync(eventId);
            router.push('/feed');
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleLike = () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }
        if (like.isPending) return;
        setInteractionError(null);
        like.mutate();
    };

    const handleAttend = () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }
        if (attend.isPending || isAttending) return;
        setInteractionError(null);
        attend.mutate('going');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">

            {/* Header row */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            {isLive ? <Badge variant="live">Live Now</Badge> : <Badge variant="default">Upcoming</Badge>}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e6edf3]">{event.title}</h1>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <ShareButton title={event.title} description={event.description!} />
                    </div>
                </div>

                {event.description && (
                    <p className="text-[#8b949e] text-base leading-relaxed">{event.description}</p>
                )}

                {/* AI Tags */}
                {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {event.tags.map((tag) => (
                            <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#1c2128] text-[#0caee8] border border-[#30363d]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Owner actions */}
                {isOwner && (
                    <div className="flex items-center gap-2 pt-2">
                        <Link href={`/events/${eventId}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 bg-[#1c2128]/50">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                        </Link>
                        {!confirmDelete ? (
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                                <span className="text-xs font-medium text-red-400">Delete event?</span>
                                <Button variant="danger" size="sm" loading={deleteEvent.isPending} onClick={handleDelete} className="h-7 px-3">
                                    {deleteEvent.isPending ? 'Deleting...' : 'Yes'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} className="h-7 px-3 text-[#8b949e]">
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="glass rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1c2128] flex items-center justify-center shrink-0 border border-[#30363d]">
                        <Calendar className="w-5 h-5 text-[#0caee8]" />
                    </div>
                    <div className="pt-0.5">
                        <p className="font-semibold text-[#e6edf3] text-sm">Date & Time</p>
                        <p className="text-sm text-[#8b949e] mt-0.5 leading-snug">
                            {formatEventTime(event.start_time, event.end_time)}
                        </p>
                    </div>
                </div>

                {/* Attendees Summary */}
                <div className="glass rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1c2128] flex items-center justify-center shrink-0 border border-[#30363d]">
                        <Users className="w-5 h-5 text-[#22c55e]" />
                    </div>
                    <div className="pt-0.5">
                        <p className="font-semibold text-[#e6edf3] text-sm">Attendees</p>
                        <p className="text-sm text-[#8b949e] mt-0.5">
                            {event.attendee_count} {event.attendee_count === 1 ? 'person' : 'people'} going
                        </p>
                    </div>
                </div>

                {/* Magic Invitation Card - Premium Trigger Banner */}
                <div 
                    onClick={() => setShowInviteModal(true)}
                    className="sm:col-span-2 relative overflow-hidden group cursor-pointer rounded-2xl transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] shadow-lg hover:shadow-[0_15px_40px_rgba(12,174,232,0.25)] border border-[#0caee8]/30 bg-[#1c2128]"
                >
                    {/* Animated Shimmer Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0caee8]/30 via-transparent to-[#ff9d00]/15" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    
                    <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#0d1117] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#0caee8]/50 transition-all duration-500 shadow-2xl group-hover:scale-110">
                            <SparklesIcon className="w-8 h-8 text-[#ff9d00] group-hover:text-[#0caee8] transition-all duration-500 pulse-slow group-hover:rotate-12" />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-1.5">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <p className="font-extrabold text-white text-lg tracking-tight">
                                    Magic Invitation Pass
                                </p>
                                <span className="text-[10px] font-black bg-gradient-to-r from-[#ff9d00] to-[#ff5000] text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider animate-pulse">
                                    PREMIUM
                                </span>
                            </div>
                            <p className="text-sm text-[#8b949e] font-medium leading-relaxed group-hover:text-white/90 transition-colors">
                                Generate a stunning, personalized invitation pass with a scannable QR to share on your Social Stories.
                            </p>
                        </div>
                        <div className="px-5 py-2.5 rounded-xl bg-[#0caee8] text-[#0d1117] text-sm font-bold shadow-lg hover:bg-white transition-colors group-hover:translate-x-1 duration-500 flex items-center gap-2">
                            Create Now
                            <SparklesIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <InvitationModal 
                event={event} 
                isOpen={showInviteModal} 
                onClose={() => setShowInviteModal(false)} 
            />

            {/* Mini Map */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-[#e6edf3]">Location</h2>
                <MiniMap lat={event.location_lat} lng={event.location_lng} />
            </div>

            {/* Social Actions — Simplified buttons with optimistic feedback */}
            <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleLike}
                        loading={like.isPending}
                        className={clsx(
                            'flex-1 transition-all active:scale-[0.98]',
                            event.like_count > 0 && 'border-red-500/30 bg-red-500/5'
                        )}
                    >
                        <Heart className={clsx(
                            'w-4 h-4 transition-transform group-hover:scale-110',
                            event.like_count > 0 ? 'text-red-500 fill-red-500' : 'text-[#8b949e]'
                        )} />
                        {event.like_count} Like{event.like_count !== 1 ? 's' : ''}
                    </Button>
                    <Button
                        variant={isAttending ? 'secondary' : 'primary'}
                        onClick={handleAttend}
                        loading={attend.isPending}
                        className="flex-1 transition-all active:scale-[0.98]"
                    >
                        {isAttending ? (
                            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                        ) : (
                            <Users className="w-4 h-4" />
                        )}
                        {attend.isPending ? 'Joining...' : (isAttending ? 'Attending' : 'Attend')}
                    </Button>
                </div>
                
                {interactionError && (
                    <div className="text-xs text-red-500 font-medium px-1 flex items-center gap-1.5 animate-shake">
                        <Trash2 className="w-3 h-3" />
                        {interactionError}
                    </div>
                )}
            </div>

            {/* Attendees Facepile */}
            {event.attendees.length > 0 && (
                <div className="pt-4">
                    <h2 className="text-sm font-semibold text-[#e6edf3] mb-3">Who's Going</h2>
                    <div className="flex flex-wrap gap-2">
                        {event.attendees.map((a) => (
                            <div key={a.user_id} className="flex items-center gap-2 bg-[#1c2128] border border-[#30363d] rounded-full pl-1 pr-3 py-1">
                                <Avatar size="sm" name={a.user_id.slice(0, 6)} />
                                <span className="text-xs font-medium text-[#c9d1d9]">User {a.user_id.slice(0, 4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Event Lobby Chat — only visible while event is live (FEATURES.md §6) */}
            {isLive && isSignedIn && (
                <div className="space-y-3 pt-4">
                    <h2 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e] live-dot" />
                        Live Event Lobby
                    </h2>
                    <ChatWindow eventId={eventId} />
                </div>
            )}

            {/* Comments */}
            <div className="glass rounded-2xl p-4 sm:p-5 mt-8">
                <h2 className="text-base font-semibold text-[#e6edf3] mb-5 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#0caee8]" />
                    Discussion ({event.comments.length})
                </h2>

                {isSignedIn && (
                    <form onSubmit={handleComment} className="flex gap-2 mb-6">
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ask a question or leave a comment…"
                            maxLength={1000}
                            className="flex-1 bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#0caee8] transition-colors"
                        />
                        <Button type="submit" loading={addComment.isPending} disabled={!comment.trim()}>
                            Post
                        </Button>
                    </form>
                )}

                <div className="space-y-5">
                    {event.comments.map((c) => (
                        <div key={c.id} className="flex gap-3 group">
                            <Avatar size="md" name={c.user_id.slice(0, 6)} />
                            <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-none p-3 group-hover:border-[#484f58] transition-colors gap-1 flex flex-col">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-xs font-semibold text-[#c9d1d9] tracking-tight">User {c.user_id.slice(0, 4)}</span>
                                    <span className="text-[10px] text-[#8b949e]">{new Date(c.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-[#e6edf3] leading-relaxed">{c.content}</p>
                            </div>
                        </div>
                    ))}
                    {event.comments.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-full bg-[#1c2128] flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="w-5 h-5 text-[#8b949e]" />
                            </div>
                            <p className="text-[#8b949e] text-sm">No discussion yet. Start the conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
