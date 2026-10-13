import { Metadata } from 'next';
import { AspectRatioCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sideforhold for video – gratis kalkulator på nett',
  description: 'Regn ut sideforhold og dimensjoner for video og bilder. Gratis og uten registrering.',
  keywords: ['sideforhold', 'videoformat', '16:9', 'oppløsning'],
  alternates: { canonical: '/calculators/photo/aspect-ratio-calculator' },
  openGraph: {
    title: 'Sideforhold for video',
    description: 'Regn ut sideforhold og dimensjoner for video og bilder',
    url: '/calculators/photo/aspect-ratio-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sideforhold for video',
  description: 'Regn ut sideforhold og dimensjoner for video og bilder',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi bredde og høyde', text: 'I piksler.' },
  { name: 'Les av sideforholdet', text: 'Du får forkortet forhold, desimalforhold og megapiksler.' },
  { name: 'Skaler til ny bredde', text: 'Høyden regnes ut med samme proporsjoner.' },
  { name: 'Bruk et ferdig valg', text: 'Velg en vanlig oppløsning eller et sideforhold.' },
];

const faqs = [
  { question: 'Hva er sideforhold?', answer: 'Forholdet mellom bredde og høyde, for eksempel 16:9.' },
  { question: 'Hvilket sideforhold passer for YouTube?', answer: '16:9 er standard. Stående video til Shorts, Reels og TikTok bruker 9:16.' },
  { question: 'Hvordan skalerer jeg uten å forvrenge?', answer: 'Behold sideforholdet og regn ut den nye høyden fra den nye bredden.' },
  { question: 'Hva er megapiksler?', answer: 'Bredde × høyde delt på én million.' },
];

const relatedTools = [
  { href: '/calculators/photo/bitrate-calculator', title: 'Bitrate-kalkulator', description: 'Regn ut videobitrate og filstørrelse' },
  { href: '/calculators/photo/printing-size-calculator', title: 'Utskriftsstørrelse', description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Tidsforløp (timelapse)', description: 'Regn ut intervall og varighet for timelapse-fotografering' },
];

export default function AspectRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="photo-aspect-ratio-calculator"
          title="Sideforhold for video"
          description="Regn ut og forkort sideforhold, skaler bilder og videoer og se vanlige formater for YouTube, Instagram og TikTok. Gratis og uten registrering."
        />

        <section aria-label="Sideforhold for video">
          <AspectRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
