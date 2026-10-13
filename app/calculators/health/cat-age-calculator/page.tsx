import { Metadata } from 'next';
import { CatAgeCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kattealder i menneskeår – gratis kalkulator på nett',
  description: 'Regn om kattens alder til menneskeår. Gratis og uten registrering.',
  keywords: ['kattealder', 'katteår', 'menneskeår', 'kjæledyr'],
  alternates: { canonical: '/calculators/health/cat-age-calculator' },
  openGraph: {
    title: 'Kattealder i menneskeår',
    description: 'Regn om kattens alder til menneskeår',
    url: '/calculators/health/cat-age-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kattealder i menneskeår',
  description: 'Regn om kattens alder til menneskeår',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi alder', text: 'År og måneder.' },
  { name: 'Les resultatet', text: 'Se alder i menneskeår og livsfase.' },
];

const faqs = [
  { question: 'Hvor gammel blir en katt?', answer: 'Innekatter blir ofte 14–18 år, noen blir over 20.' },
  { question: 'Hvor gammel er en 1 år gammel katt i menneskeår?', answer: 'Omtrent 15 år.' },
  { question: 'Hva er livsfasene?', answer: 'Kattunge, ung, voksen, moden, senior og gammel.' },
  { question: 'Er resultatet nøyaktig?', answer: 'Det er et anslag.' },
];

const relatedTools = [
  { href: '/calculators/health/dog-age-calculator', title: 'Hundealder i menneskeår', description: 'Regn om hundens alder til menneskeår' },
];

export default function CatAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cat-age-calculator"
          title="Kattealder i menneskeår"
          description="Regn kattens alder om til menneskeår. Gratis og uten registrering."
        />

        <section aria-label="Kattealder i menneskeår">
          <CatAgeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
