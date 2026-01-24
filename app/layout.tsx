import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { SkipLink } from '@/components/ui/skip-link';
import { ServiceWorkerRegister, InstallPrompt } from '@/components/pwa';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap', // Optimize font loading for better LCP
  preload: true,
});

/**
 * Viewport configuration for mobile optimization
 * @see Requirements 13.2 - Mobile responsiveness
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'OmniTools - Free Online Calculators & Converters',
    template: '%s | OmniTools',
  },
  description: 'Your all-in-one toolkit for everyday calculations. 100+ free online calculators and converters for finance, health, home improvement, and productivity.',
  keywords: ['calculator', 'converter', 'online tools', 'free calculator', 'unit converter', 'omnitools'],
  authors: [{ name: 'OmniTools' }],
  creator: 'OmniTools',
  publisher: 'OmniTools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://omnitools.devtoolcafe.com/'),
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OmniTools',
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    // Add verification tokens when available
    // google: 'google-site-verification-token',
    // yandex: 'yandex-verification-token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icon for iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OmniTools" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <SkipLink href="#main-content" />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieConsent />

        {/* PWA Components */}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
