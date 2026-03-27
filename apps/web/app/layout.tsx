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

export const metadata: Metadata = {
    title: { default: 'CityPulse', template: '%s | CityPulse' },
    description: 'Discover what\'s happening around you right now.',
    keywords: ['events', 'local', 'discovery', 'hyperlocal', 'city', 'india'],
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    openGraph: {
        type: 'website',
        siteName: 'CityPulse',
        title: 'CityPulse – What\'s happening around you',
        description: 'Discover live and upcoming events in your city.',
    },
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
