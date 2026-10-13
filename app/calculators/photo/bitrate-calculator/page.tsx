import { Metadata } from 'next';
import { BitrateCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bitrate-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut videobitrate og filstørrelse. Gratis og uten registrering.',
  keywords: ['bitrate', 'videofilstørrelse', 'lagring', 'koding'],
  alternates: { canonical: '/calculators/photo/bitrate-calculator' },
  openGraph: {
    title: 'Bitrate-kalkulator',
    description: 'Regn ut videobitrate og filstørrelse',
    url: '/calculators/photo/bitrate-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bitrate-kalkulator',
  description: 'Regn ut videobitrate og filstørrelse',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg oppløsning og bildefrekvens', text: 'For eksempel Full HD ved 25 b/s.' },
  { name: 'Velg kodek og kvalitet', text: 'H.264, H.265, ProRes og flere.' },
  { name: 'Oppgi videolengde', text: 'I sekunder.' },
  { name: 'Les av bitrate og størrelse', text: 'Se også størrelse per minutt og time.' },
];

const faqs = [
  { question: 'Hva er bitrate?', answer: 'Hvor mye data som brukes per sekund video, målt i megabit i sekundet (Mbit/s).' },
  { question: 'Hva er forskjellen på kodekene?', answer: 'H.265 og AV1 komprimerer mer enn H.264. ProRes og DNxHD gir store filer som er enkle å redigere.' },
  { question: 'Hvor nøyaktig er resultatet?', answer: 'Det er et overslag. Faktisk bitrate avhenger av innholdet og kodekens innstillinger.' },
  { question: 'Hvilken bitrate anbefaler plattformene?', answer: 'Se anbefalingene under resultatet. De endres av og til, så sjekk plattformens egne retningslinjer.' },
];

const relatedTools = [
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Sideforhold', description: 'Regn ut og omregn sideforhold for bilder og skjermer' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Tidsforløp (timelapse)', description: 'Regn ut intervall og varighet for timelapse-fotografering' },
  { href: '/calculators/photo/printing-size-calculator', title: 'Utskriftsstørrelse', description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI' },
];

export default function BitrateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bitrate-calculator"
          title="Bitrate-kalkulator"
          description="Regn ut videobitrate og filstørrelse ut fra oppløsning, bildefrekvens, kodek og kvalitet. Gratis og uten registrering."
        />

        <section aria-label="Bitrate-kalkulator">
          <BitrateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
