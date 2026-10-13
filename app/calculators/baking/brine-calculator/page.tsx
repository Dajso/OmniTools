import { Metadata } from 'next';
import { BrineCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lakeberegner – gratis kalkulator på nett',
  description: 'Regn ut riktig forhold mellom salt og vann i lake til kjøtt og fisk. Gratis og uten registrering.',
  keywords: ['lake', 'saltlake', 'lakekjøtt', 'saltmengde', 'salting'],
  alternates: { canonical: '/calculators/baking/brine-calculator' },
  openGraph: {
    title: 'Lakeberegner',
    description: 'Regn ut riktig forhold mellom salt og vann i lake til kjøtt og fisk',
    url: '/calculators/baking/brine-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lakeberegner',
  description: 'Regn ut riktig forhold mellom salt og vann i lake til kjøtt og fisk',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi vannmengde', text: 'Skriv inn antall liter vann.' },
  { name: 'Velg saltprosent', text: 'Vanlige laker ligger mellom 5 og 10 %.' },
  { name: 'Les resultatet', text: 'Se hvor mange gram salt du trenger.' },
];

const faqs = [
  { question: 'Hvor mye salt trengs per liter?', answer: 'En lake på 5 % betyr 50 g salt per liter vann.' },
  { question: 'Hvor lenge skal maten ligge i lake?', answer: 'Det varierer. Fisk trenger gjerne 15–30 minutter i svak lake, mens kjøtt kan ligge i flere timer.' },
  { question: 'Hvilket salt bør jeg bruke?', answer: 'Bruk vanlig bordsalt eller flingesalt som er uten tilsetninger, og vei det heller enn å måle i spiseskjeer.' },
];

const relatedTools = [
  { href: '/calculators/baking/unit-cost-per-serving', title: 'Kostnad per porsjon', description: 'Regn ut hva en porsjon koster ut fra råvarepriser og antall porsjoner' },
];

export default function BrineCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="brine-calculator"
          title="Lakeberegner"
          description="Regn ut hvor mye salt du trenger i lake til kjøtt og fisk. Gratis og uten registrering."
        />

        <section aria-label="Lakeberegner">
          <BrineCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
