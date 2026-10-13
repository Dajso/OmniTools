import { Metadata } from 'next';
import { HexToRgbConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'HEX til RGB – gratis kalkulator på nett',
  description: 'Gjør om HEX-fargekoder til RGB-verdier. Gratis og uten registrering.',
  keywords: ['hex til rgb', 'fargekode', 'hex-farge', 'RGB-farge'],
  alternates: { canonical: '/calculators/productivity/hex-to-rgb' },
  openGraph: {
    title: 'HEX til RGB',
    description: 'Gjør om HEX-fargekoder til RGB-verdier',
    url: '/calculators/productivity/hex-to-rgb',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HEX til RGB',
  description: 'Gjør om HEX-fargekoder til RGB-verdier',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'HEX til RGB eller RGB til HEX.' },
  { name: 'Skriv inn fargen', text: 'Skriv for eksempel #1d6c6e eller 29, 108, 110.' },
  { name: 'Les av resultatet', text: 'Du får HEX, RGB og HSL, og en fargeprøve.' },
];

const faqs = [
  { question: 'Hva er HEX?', answer: 'Seks tegn (0–9 og a–f) som angir mengden rødt, grønt og blått, for eksempel #FF0000 for rødt.' },
  { question: 'Hva er HSL?', answer: 'Farge, metning og lysstyrke. HSL er ofte lettere å justere for hånd enn RGB.' },
  { question: 'Kan jeg bruke korte HEX-koder?', answer: 'Ja, #fff blir regnet som #ffffff.' },
  { question: 'Trenger jeg #-tegnet?', answer: 'Nei, det går fint uten.' },
];

const relatedTools = [
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Sideforhold', description: 'Regn ut og omregn sideforhold for bilder og skjermer' },
];

export default function HexToRgbPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hex-to-rgb"
          title="HEX til RGB"
          description="Regn om HEX-fargekoder til RGB og HSL, og tilbake. Gratis og uten registrering."
        />

        <section aria-label="HEX til RGB">
          <HexToRgbConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
