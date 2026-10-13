import { Metadata } from 'next';
import { AgeCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Alderskalkulator – gratis kalkulator på nett',
  description: 'Regn ut nøyaktig alder ut fra fødselsdato. Gratis og uten registrering.',
  keywords: ['alder', 'fødselsdag', 'hvor gammel er jeg', 'alder i dager'],
  alternates: { canonical: '/calculators/productivity/age-calculator' },
  openGraph: {
    title: 'Alderskalkulator',
    description: 'Regn ut nøyaktig alder ut fra fødselsdato',
    url: '/calculators/productivity/age-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Alderskalkulator',
  description: 'Regn ut nøyaktig alder ut fra fødselsdato',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn fødselsdato', text: 'Velg datoen du ble født.' },
  { name: 'Velg til dato (valgfritt)', text: 'La stå tomt for å regne til i dag.' },
  { name: 'Les av alderen', text: 'Du får alder, dager til bursdag og ukedag du ble født.' },
];

const faqs = [
  { question: 'Hvordan regnes alderen ut?', answer: 'Kalkulatoren teller hele år, måneder og dager mellom fødselsdato og valgt dato.' },
  { question: 'Hvor mange dager er det til neste bursdag?', answer: 'Se feltet «Dager til». Hvis bursdagen er i dag, vises tiden til neste år.' },
  { question: 'Hva hvis jeg er født 29. februar?', answer: 'Kalkulatoren håndterer skuddår etter vanlige regler.' },
  { question: 'Når er man myndig i Norge?', answer: 'Fra fylte 18 år. Valgretten kommer ved fylte 18 år i det kalenderåret valget holdes.' },
];

const relatedTools = [
  { href: '/calculators/productivity/date-difference', title: 'Dager mellom to datoer', description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder' },
];

export default function AgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="age-calculator"
          title="Alderskalkulator"
          description="Regn ut nøyaktig alder i år, måneder og dager, dager til neste bursdag, stjernetegn og kinesisk dyrekrets. Gratis og uten registrering."
        />

        <section aria-label="Alderskalkulator">
          <AgeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
