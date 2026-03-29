import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import '@/styles/globals.css';

// Display font for headings — geometric, modern, startup-premium feel
const spaceGrotesk = Space_Grotesk({ 
    subsets: ['latin'], 
    variable: '--font-display',
    weight: ['300', '400', '500', '600', '700'],
});

// Body font — warm, legible, feels human
const dmSans = DM_Sans({ 
    subsets: ['latin'], 
    variable: '--font-body',
    weight: ['300', '400', '500', '600', '700'],
});

// Resolve the base URL for metadata (sitemap, OG images, canonical)
const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000');

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: { default: 'CityPulse – Discover Events Near You', template: '%s | CityPulse' },
    description:
        'CityPulse is a hyperlocal event discovery platform. Find bhandaras, garba nights, meetups, house parties & more happening around you right now.',
    keywords: [
        'events near me', 'local events', 'hyperlocal', 'city events',
        'bhandara near me', 'garba night', 'jagrata', 'live events india',
        'event discovery', 'things to do near me', 'meetups', 'house party',
        'CityPulse', 'real-time events', 'trending events',
    ],

    // ── Google Search Console Verification ──────────────────────────
    verification: {
        google: 'SSr6osljNjF_lr1hc4mPHjCjFdpMer_Xbv0BhQKT2VM',
    },

    // ── Icons ───────────────────────────────────────────────────────
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },

    // ── Canonical URL ───────────────────────────────────────────────
    alternates: {
        canonical: '/',
    },

    // ── OpenGraph (Facebook, LinkedIn, WhatsApp) ────────────────────
    openGraph: {
        type: 'website',
        siteName: 'CityPulse',
        title: 'CityPulse – Discover Events Near You',
        description:
            'Find bhandaras, garba, meetups, house parties & live events in your city. AI-powered hyperlocal discovery.',
        locale: 'en_IN',
        url: '/',
    },

    // ── Twitter Card ────────────────────────────────────────────────
    twitter: {
        card: 'summary_large_image',
        title: 'CityPulse – Discover Events Near You',
        description:
            'Real-time, AI-powered event discovery for your city. Bhandaras, garba, meetups & more.',
    },

    // ── Misc SEO ────────────────────────────────────────────────────
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'events',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
            <body className="min-h-screen bg-[#0d1117] text-[#e6edf3] antialiased" suppressHydrationWarning>
                <Providers>
                    <Navbar />
                    <main className="pt-16">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
