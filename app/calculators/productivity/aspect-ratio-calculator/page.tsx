import { Metadata } from 'next';
import { AspectRatioCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sideforhold – gratis kalkulator på nett',
  description: 'Regn ut og omregn sideforhold for bilder og skjermer. Gratis og uten registrering.',
  keywords: ['sideforhold', 'skjermforhold', '16:9', 'bildeformat'],
  alternates: { canonical: '/calculators/productivity/aspect-ratio-calculator' },
  openGraph: {
    title: 'Sideforhold',
    description: 'Regn ut og omregn sideforhold for bilder og skjermer',
    url: '/calculators/productivity/aspect-ratio-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sideforhold',
  description: 'Regn ut og omregn sideforhold for bilder og skjermer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg modus', text: 'Regn ut forhold, eller endre størrelse etter bredde eller høyde.' },
  { name: 'Skriv inn bredde og høyde', text: 'For eksempel 1920 × 1080.' },
  { name: 'Les av forholdet', text: 'Du får forhold, desimaltall, format og vanlig navn.' },
  { name: 'Endre størrelse', text: 'Skriv inn ny bredde eller høyde og se den andre dimensjonen.' },
];

const faqs = [
  { question: 'Hva er 16:9?', answer: 'Standardformatet for TV, video og de fleste skjermer: bredden er 16/9 av høyden.' },
  { question: 'Hvilket forhold har et vanlig bilde?', answer: 'Mobilkameraer bruker ofte 4:3, speilreflekskameraer 3:2.' },
  { question: 'Hvilket forhold passer til Instagram og Tiktok?', answer: 'Stående video har 9:16, mens bilder i feeden ofte er 4:5 eller 1:1.' },
  { question: 'Hva er A4-forholdet?', answer: 'A-formatene har forholdet 1:√2, ca. 1:1,414.' },
];

const relatedTools = [
  { href: '/calculators/productivity/image-resolution-calculator', title: 'Bildeoppløsning', description: 'Regn ut DPI/PPI for bilder og trykk' },
];

export default function AspectRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="aspect-ratio-calculator"
          title="Sideforhold"
          description="Regn ut og endre størrelse med riktig sideforhold for bilder, video og skjermer. Gratis og uten registrering."
        />

        <section aria-label="Sideforhold">
          <AspectRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
