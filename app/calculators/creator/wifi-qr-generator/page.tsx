import { Metadata } from 'next';
import { WifiQRGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'WiFi QR Code Generator - Share WiFi Easily',
  description: 'Generate a QR code for your WiFi network. Guests can scan to connect instantly without typing passwords.',
  keywords: ['wifi qr code', 'wifi qr generator', 'share wifi', 'wifi password qr', 'network qr code'],
  alternates: { canonical: '/calculators/creator/wifi-qr-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WiFi QR Code Generator',
  description: 'Generate a QR code for easy WiFi network sharing',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter network name', text: 'Type your WiFi network name (SSID) exactly as it appears.' },
  { name: 'Select security type', text: 'Choose WPA/WPA2 for most modern networks, or Open for no password.' },
  { name: 'Enter password', text: 'Type your WiFi password (not needed for open networks).' },
  { name: 'Generate QR code', text: 'Click Generate to create your WiFi QR code.' },
  { name: 'Share with guests', text: 'Print or display the QR code for guests to scan.' },
];

const faqs = [
  {
    question: 'How do guests scan the QR code?',
    answer: 'Most modern smartphones can scan QR codes directly from the camera app. Point the camera at the QR code and tap the notification to connect.',
  },
  {
    question: 'Is my WiFi password secure?',
    answer: 'The QR code is generated entirely in your browser. Your password is never sent to any server. However, anyone who can see the QR code can connect to your network.',
  },
  {
    question: 'What security types are supported?',
    answer: 'WPA/WPA2/WPA3 (most common), WEP (legacy, not recommended), and Open (no password) networks are all supported.',
  },
  {
    question: 'Why isn\'t the QR code working?',
    answer: 'Make sure the network name is exactly correct (case-sensitive) and the password is accurate. Also ensure the security type matches your router settings.',
  },
  {
    question: 'Can I use this for a hidden network?',
    answer: 'Yes! Check the "Hidden network" option if your SSID is not broadcast. The QR code will include this information.',
  },
];

const relatedTools = [
  { href: '/calculators/productivity/password-generator', title: 'Password Generator', description: 'Generate secure passwords.' },
];

export default function WifiQRGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wifi-qr-generator"
          title="WiFi QR Code Generator"
          description="Generate a QR code for your WiFi network. Guests can scan to connect instantly without typing passwords."
          colorClass="bg-cyan-100 text-cyan-600"
          category="Creator"
        />

        <section aria-label="WiFi QR Code Generator">
          <WifiQRGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
