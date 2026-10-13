import { Metadata } from 'next';
import { ChocolateTemperingCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Temperering av sjokolade – gratis kalkulator på nett',
  description: 'Temperaturer for temperering av mørk, melke- og hvit sjokolade. Gratis og uten registrering.',
  keywords: ['temperere sjokolade', 'mørk sjokolade', 'melkesjokolade', 'hvit sjokolade'],
  alternates: { canonical: '/calculators/baking/chocolate-tempering-calculator' },
  openGraph: {
    title: 'Temperering av sjokolade',
    description: 'Temperaturer for temperering av mørk, melke- og hvit sjokolade',
    url: '/calculators/baking/chocolate-tempering-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Temperering av sjokolade',
  description: 'Temperaturer for temperering av mørk, melke- og hvit sjokolade',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg sjokoladetype', text: 'Mørk, melke eller hvit.' },
  { name: 'Følg temperaturene', text: 'Smelt, kjøl ned og varm opp igjen til arbeidstemperatur.' },
];

const faqs = [
  { question: 'Hvorfor tempererer man sjokolade?', answer: 'Riktig temperering gir blank overflate, god knekk og gjør at sjokoladen ikke får grå flekker.' },
  { question: 'Hvordan vet jeg at sjokoladen er tempert?', answer: 'Dypp en kniv i sjokoladen. Den skal stivne blank og jevn i løpet av noen minutter ved romtemperatur.' },
  { question: 'Må jeg bruke termometer?', answer: 'Ja, et digitalt kjøkkentermometer gir best resultat.' },
];

const relatedTools = [
  { href: '/calculators/baking/brine-calculator', title: 'Lakeberegner', description: 'Regn ut riktig forhold mellom salt og vann i lake til kjøtt og fisk' },
];

export default function ChocolateTemperingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="chocolate-tempering-calculator"
          title="Temperering av sjokolade"
          description="Se temperaturene for temperering av mørk, melke- og hvit sjokolade. Gratis og uten registrering."
        />

        <section aria-label="Temperering av sjokolade">
          <ChocolateTemperingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
