import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import TrendingPreview from '@/components/home/TrendingPreview';
import CreatorCTA from '@/components/home/CreatorCTA';

export const metadata: Metadata = {
    title: 'CityPulse - What\'s happening around you',
    description: 'Discover live and upcoming events in your city. Real-time feed ranked by freshness and social buzz.',
};

export default function HomePage() {
    return (
        <main className="w-full flex-col bg-[#0d1117] overflow-hidden selection:bg-[#0caee8]/30">
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
