'use client';

import { useState } from 'react';
import { useUserProfile, useFollowers, useFollowing, useToggleFollow } from '@/hooks/useUser';
import { useUser } from '@clerk/nextjs';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import type { User } from '@/lib/types';

interface TabProps { active: boolean; label: string; count: number; onClick: () => void }
function Tab({ active, label, count, onClick }: TabProps) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${active ? 'border-[#0caee8] text-[#0caee8]' : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'}`}
        >
            {label} <span className="ml-1 text-xs opacity-70">{count}</span>
        </button>
    );
}

export default function UserProfileClient({ userId }: { userId: string }) {
    const { user: clerkUser } = useUser();
    const { data: profile, isLoading } = useUserProfile(userId);
    const { data: followers = [] } = useFollowers(userId);
    const { data: following = [] } = useFollowing(userId);
    const toggleFollow = useToggleFollow(userId);
    const [tab, setTab] = useState<'followers' | 'following'>('followers');

    const isOwnProfile = clerkUser?.id === profile?.clerk_id;

    if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
    if (!profile) return <p className="text-center text-[#8b949e] py-16">User not found.</p>;

    const listToShow: User[] = tab === 'followers' ? followers : following;

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            {/* Profile header */}
            <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-5">
                <Avatar src={profile.avatar} name={profile.name} size="lg" />
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-[#e6edf3] truncate">{profile.name}</h1>
                    {profile.bio && <p className="text-sm text-[#8b949e] mt-0.5 line-clamp-2">{profile.bio}</p>}
                </div>
                {!isOwnProfile && clerkUser && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleFollow.mutate()}
                        loading={toggleFollow.isPending}
                    >
                        {toggleFollow.data?.following === false ? 'Follow' : 'Following'}
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="glass rounded-2xl overflow-hidden mb-4">
                <div className="flex border-b border-[#30363d]">
                    <Tab active={tab === 'followers'} label="Followers" count={followers.length} onClick={() => setTab('followers')} />
                    <Tab active={tab === 'following'} label="Following" count={following.length} onClick={() => setTab('following')} />
                </div>
                <div className="divide-y divide-[#30363d]">
                    {listToShow.length === 0 ? (
                        <p className="text-center text-[#8b949e] text-sm py-8">
                            {tab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                        </p>
                    ) : (
                        listToShow.map((u) => (
                            <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1c2128] transition-colors">
                                <Avatar src={u.avatar} name={u.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#e6edf3] truncate">{u.name}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
