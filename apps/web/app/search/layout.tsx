import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Discover Events – Search by Keyword or Location',
    description:
        'Search for events near you by keyword, category, or location. Find bhandaras, garba nights, meetups, house parties & more using AI-powered semantic search.',
    openGraph: {
        title: 'Discover Events – Search by Keyword or Location | CityPulse',
        description:
            'Search for events near you by keyword, category, or location. AI-powered semantic discovery.',
        url: '/search',
    },
    alternates: {
        canonical: '/search',
    },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
