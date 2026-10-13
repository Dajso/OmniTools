import { Metadata } from 'next';
import { SmokingCostCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Røykekostnad – gratis kalkulator på nett',
  description: 'Regn ut hvor mye penger du bruker på røyking og hva du sparer på å slutte. Gratis og uten registrering.',
  keywords: ['røyking', 'sigaretter', 'slutte å røyke', 'røykekostnad', 'tobakk'],
  alternates: { canonical: '/calculators/health/smoking-cost-calculator' },
  openGraph: {
    title: 'Røykekostnad',
    description: 'Regn ut hvor mye penger du bruker på røyking og hva du sparer på å slutte',
    url: '/calculators/health/smoking-cost-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Røykekostnad',
  description: 'Regn ut hvor mye penger du bruker på røyking og hva du sparer på å slutte',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn forbruk', text: 'Antall sigaretter per dag.' },
  { name: 'Oppgi pris', text: 'Pris per pakke og antall per pakke.' },
  { name: 'Les resultatet', text: 'Se hva det koster over tid.' },
];

const faqs = [
  { question: 'Hva koster en pakke sigaretter i Norge?', answer: 'Prisene ligger ofte rundt 130–180 kroner for en pakke på 20, avhengig av merke. Sjekk prisen i butikken.' },
  { question: 'Hva skjer når jeg slutter?', answer: 'Pulsen og blodtrykket går ned etter 20 minutter, og risikoen for hjerte- og karsykdom synker over tid.' },
  { question: 'Hvor finner jeg hjelp til å slutte?', answer: 'Slutta.no og fastlegen kan hjelpe. Apoteket har også råd om nikotinprodukter.' },
  { question: 'Kan jeg bruke kalkulatoren til snus?', answer: 'Ja, regn med pris per boks som «pakke» og antall porsjoner.' },
];

const relatedTools = [
  { href: '/calculators/finance/emergency-fund-calculator', title: 'Buffersparing', description: 'Beregn hvor stor sparebuffer du trenger' },
];

export default function SmokingCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="smoking-cost-calculator"
          title="Røykekostnad"
          description="Regn ut hva røyking koster deg i kroner per dag, måned og år, og hva du kunne brukt pengene på. Gratis og uten registrering."
        />

        <section aria-label="Røykekostnad">
          <SmokingCostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
