import { Metadata } from 'next';
import { WifiQRGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'WiFi QR-kode – gratis kalkulator på nett',
  description: 'Lag QR-koder for enkel deling av WiFi-nettverk. Gratis og uten registrering.',
  keywords: ['wifi qr', 'qr-kode', 'dele wifi', 'nettverk'],
  alternates: { canonical: '/calculators/creator/wifi-qr-generator' },
  openGraph: {
    title: 'WiFi QR-kode',
    description: 'Lag QR-koder for enkel deling av WiFi-nettverk',
    url: '/calculators/creator/wifi-qr-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WiFi QR-kode',
  description: 'Lag QR-koder for enkel deling av WiFi-nettverk',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn nettverksnavnet', text: 'SSID, eksakt slik det skrives.' },
  { name: 'Velg sikkerhetstype', text: 'Vanligvis WPA/WPA2.' },
  { name: 'Skriv inn passordet', text: 'Passordet lagres ikke.' },
  { name: 'Last ned QR-koden', text: 'Skriv den ut eller vis den på skjerm.' },
];

const faqs = [
  { question: 'Hvordan kobler gjestene til?', answer: 'De åpner mobilkameraet og skanner koden. Telefonen foreslår å koble til nettverket.' },
  { question: 'Er det trygt å lage QR-koden her?', answer: 'Ja. Alt skjer i nettleseren din, og passordet sendes ikke til noen server.' },
  { question: 'Hvilken sikkerhetstype skal jeg velge?', answer: 'WPA er vanligvis riktig. Velg «åpent» bare for nettverk uten passord.' },
  { question: 'Hva om nettverket er skjult?', answer: 'Kryss av for skjult nettverk, så tar QR-koden med dette.' },
];

const relatedTools = [
  { href: '/calculators/creator/signature-generator', title: 'Signaturgenerator', description: 'Lag signaturer i håndskriftstil til dokumenter og e-post' },
];

export default function WifiQRGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wifi-qr-generator"
          title="WiFi QR-kode"
          description="Lag en QR-kode som lar gjester koble til wifi uten å skrive passord. Gratis og uten registrering."
        />

        <section aria-label="WiFi QR-kode">
          <WifiQRGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
