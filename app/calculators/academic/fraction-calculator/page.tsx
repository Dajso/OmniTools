import { Metadata } from 'next';
import { FractionCalculator } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Brøkkalkulator – gratis kalkulator på nett',
  description: 'Legg til, trekk fra, gang, del og forkort brøker. Gratis og uten registrering.',
  keywords: ['brøk', 'brøkregning', 'forkort brøk', 'blandede tall'],
  alternates: { canonical: '/calculators/academic/fraction-calculator' },
  openGraph: {
    title: 'Brøkkalkulator',
    description: 'Legg til, trekk fra, gang, del og forkort brøker',
    url: '/calculators/academic/fraction-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Brøkkalkulator',
  description: 'Legg til, trekk fra, gang, del og forkort brøker',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn første brøk', text: 'Teller og nevner.' },
  { name: 'Velg regneart', text: 'Addisjon, subtraksjon, multiplikasjon, divisjon eller forkorting.' },
  { name: 'Skriv inn andre brøk', text: 'Teller og nevner.' },
  { name: 'Les av svaret', text: 'Svaret vises forkortet, som desimaltall og som blandet tall.' },
];

const faqs = [
  { question: 'Hvordan legger jeg sammen brøker?', answer: 'Finn felles nevner, legg sammen tellerne og forkort. 1/2 + 1/3 = 3/6 + 2/6 = 5/6.' },
  { question: 'Hvordan deler jeg brøker?', answer: 'Gang med den omvendte brøken: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2.' },
  { question: 'Hva betyr å forkorte en brøk?', answer: 'Å dele teller og nevner med samme tall til du ikke kan dele mer. 6/8 forkortes til 3/4.' },
  { question: 'Hva er et blandet tall?', answer: 'Et helt tall og en brøk, for eksempel 1 3/4.' },
];

const relatedTools = [
  { href: '/calculators/academic/scientific-notation-converter', title: 'Standardform (vitenskapelig notasjon)', description: 'Gjør om tall til og fra standardform' },
  { href: '/calculators/productivity/percentage-calculator', title: 'Prosentkalkulator', description: 'Regn ut prosent, økning og nedgang' },
];

export default function FractionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fraction-calculator"
          title="Brøkkalkulator"
          description="Legg sammen, trekk fra, gang og del brøker, og få svaret forkortet, som desimaltall og som blandet tall. Gratis og uten registrering."
        />

        <section aria-label="Brøkkalkulator">
          <FractionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
