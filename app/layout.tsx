import type { Metadata, Viewport } from 'next';
import { Public_Sans, Bricolage_Grotesque } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SkipLink } from '@/components/ui/skip-link';
import { ServiceWorkerRegister, InstallPrompt } from '@/components/pwa';
import './globals.css';

// Samme fonter som Hjemmetavla: Public Sans til brødtekst, Bricolage Grotesque til overskrifter
const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Viewport-oppsett for mobil
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1D6C6E',
};

export const metadata: Metadata = {
  title: {
    default: 'Kalkulator – Hjemmetavla',
    template: '%s | Hjemmetavla Kalkulator',
  },
  description:
    'Gratis kalkulatorer og omregnere tilpasset Norge: kroner, metriske enheter, bolig, strøm, helse og hverdag.',
  keywords: ['kalkulator', 'omregner', 'enhetsomregner', 'boliglån', 'strømkostnad', 'hjemmetavla'],
  authors: [{ name: 'Hjemmetavla' }],
  creator: 'Hjemmetavla',
  publisher: 'Hjemmetavla',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kalkulator.hjemmetavla.no/'),
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
    locale: 'nb_NO',
    siteName: 'Hjemmetavla Kalkulator',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <head>
        {/* PWA-manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favoritt-ikoner */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />

        {/* Apple Touch-ikoner for iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kalkulator" />

        {/* Microsoft-fliser */}
        <meta name="msapplication-TileColor" content="#1D6C6E" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${publicSans.variable} ${bricolage.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SkipLink href="#main-content" />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />

        {/* PWA-komponenter */}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
