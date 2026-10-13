import { Metadata } from 'next';
import { TipCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Drikkepengekalkulator – gratis kalkulator på nett',
  description: 'Regn ut drikkepenger og del regningen mellom flere. Gratis og uten registrering.',
  keywords: ['drikkepenger', 'tips', 'del regning', 'restaurant', 'splitt regning'],
  alternates: { canonical: '/calculators/finance/tip-calculator' },
  openGraph: {
    title: 'Drikkepengekalkulator',
    description: 'Regn ut drikkepenger og del regningen mellom flere',
    url: '/calculators/finance/tip-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Drikkepengekalkulator',
  description: 'Regn ut drikkepenger og del regningen mellom flere',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn regningen', text: 'Oppgi totalbeløpet på regningen.' },
  { name: 'Velg drikkepenger', text: 'Velg prosent. I Norge er drikkepenger frivillig, og 0–10 % er vanlig.' },
  { name: 'Del på flere', text: 'Oppgi hvor mange som skal dele regningen.' },
  { name: 'Se beløp per person', text: 'Kalkulatoren viser drikkepenger og totalbeløp per person.' },
];

const faqs = [
  { question: 'Må man gi drikkepenger i Norge?', answer: 'Nei. Lønningene i serveringsbransjen er faste, og drikkepenger er frivillig. Mange runder opp regningen eller gir 5–10 % ved god service.' },
  { question: 'Hvordan deler jeg regningen likt?', answer: 'Oppgi antall personer, så deler kalkulatoren både regning og drikkepenger likt.' },
  { question: 'Er drikkepenger skattepliktig?', answer: 'Ja, drikkepenger regnes som skattepliktig inntekt for mottakeren.' },
];

const relatedTools = [
  { href: '/calculators/finance/sales-tax-calculator', title: 'MVA-kalkulator', description: 'Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA' },
];

export default function TipCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tip-calculator"
          title="Drikkepengekalkulator"
          description="Regn ut drikkepenger og del regningen mellom flere"
        />

        <section aria-label="Drikkepengekalkulator">
          <TipCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
