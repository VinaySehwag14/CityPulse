import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: { default: 'CityPulse', template: '%s | CityPulse' },
    description: 'Discover what\'s happening around you right now.',
    keywords: ['events', 'local', 'discovery', 'hyperlocal', 'city'],
    openGraph: {
        type: 'website',
        siteName: 'CityPulse',
        title: 'CityPulse – What\'s happening around you',
        description: 'Discover live and upcoming events in your city.',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen bg-[#0d1117] text-[#e6edf3] antialiased">
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
