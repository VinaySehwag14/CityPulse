import type { Metadata } from 'next';
import UserProfileClient from '@/components/users/UserProfileClient';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return { title: `User ${id.slice(0, 8)}` };
}

export default async function UserProfilePage({ params }: Props) {
    const { id } = await params;
    return <UserProfileClient userId={id} />;
}
