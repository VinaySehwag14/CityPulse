import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import TrendingPreview from '@/components/home/TrendingPreview';
import CreatorCTA from '@/components/home/CreatorCTA';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'CityPulse – Discover Live Events & Things to Do Near You',
    description:
        'Find bhandaras, garba nights, house parties, meetups & more happening around you right now. AI-powered hyperlocal event discovery ranked by freshness and social buzz.',
    openGraph: {
        title: 'CityPulse – Discover Live Events & Things to Do Near You',
        description:
            'Find bhandaras, garba nights, house parties, meetups & more happening around you right now.',
        url: '/',
    },
    alternates: {
        canonical: '/',
    },
};



// Schema.org structured data for Google Rich Results
const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CityPulse',
    description:
        'Hyperlocal event discovery platform. Find bhandaras, garba nights, meetups, house parties & more near you.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citypulse.vercel.app',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citypulse.vercel.app'}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
};

const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CityPulse',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citypulse.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citypulse.vercel.app'}/favicon.svg`,
    sameAs: ['https://github.com/VinaySehwag14/CityPulse'],
};

export default function HomePage() {
    return (
        <main className="w-full flex-col bg-[#0d1117] overflow-hidden selection:bg-[#0caee8]/30">
            {/* JSON-LD for Google Rich Results */}
            <JsonLd data={websiteJsonLd} />
            <JsonLd data={orgJsonLd} />
            {/* 1. Hero / Landing */}
            <HeroSection />

            {/* 2. Scrolling Features Map */}
            <FeatureShowcase />

            {/* 3. Live Teaser Ribbon */}
            <TrendingPreview />

            {/* 4. Event Creator Conversion */}
            <CreatorCTA />
            
            {/* Simple Footer built-in */}
            <footer className="py-8 text-center text-[#8b949e] border-t border-[#30363d]/50 bg-[#0d1117] text-sm">
                <p>© {new Date().getFullYear()} CityPulse. All rights reserved.</p>
            </footer>
        </main>
    );
}
