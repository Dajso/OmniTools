import { Metadata } from 'next';
import { DogAgeCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hundealder i menneskeår – gratis kalkulator på nett',
  description: 'Regn om hundens alder til menneskeår. Gratis og uten registrering.',
  keywords: ['hundealder', 'hundeår', 'menneskeår', 'kjæledyr'],
  alternates: { canonical: '/calculators/health/dog-age-calculator' },
  openGraph: {
    title: 'Hundealder i menneskeår',
    description: 'Regn om hundens alder til menneskeår',
    url: '/calculators/health/dog-age-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hundealder i menneskeår',
  description: 'Regn om hundens alder til menneskeår',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg størrelse', text: 'Liten, middels, stor eller kjempestor.' },
  { name: 'Oppgi alder', text: 'År og måneder.' },
  { name: 'Les resultatet', text: 'Se alder i menneskeår og livsfase.' },
];

const faqs = [
  { question: 'Er 1 hundeår lik 7 menneskeår?', answer: 'Nei, det er en forenkling. Hunder eldes raskere de første årene, og store raser eldes raskere enn små.' },
  { question: 'Hvor gammel blir en hund?', answer: 'Små raser blir ofte 13–16 år, store 8–12 år.' },
  { question: 'Hvor mye veier en middels stor hund?', answer: 'Rundt 9–23 kg.' },
  { question: 'Er resultatet nøyaktig?', answer: 'Det er et anslag. Rase, helse og gener har stor betydning.' },
];

const relatedTools = [
  { href: '/calculators/health/cat-age-calculator', title: 'Kattealder i menneskeår', description: 'Regn om kattens alder til menneskeår' },
];

export default function DogAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dog-age-calculator"
          title="Hundealder i menneskeår"
          description="Regn hundens alder om til menneskeår etter størrelse. Gratis og uten registrering."
        />

        <section aria-label="Hundealder i menneskeår">
          <DogAgeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
