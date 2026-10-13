import { Metadata } from 'next';
import { SeedGerminationTracker } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Spiringslogg – gratis kalkulator på nett',
  description: 'Følg spiring og spiringsprosent for frøene dine. Gratis og uten registrering.',
  keywords: ['frø', 'spiring', 'såing', 'spiringsprosent', 'forkultivering'],
  alternates: { canonical: '/calculators/garden/seed-germination-tracker' },
  openGraph: {
    title: 'Spiringslogg',
    description: 'Følg spiring og spiringsprosent for frøene dine',
    url: '/calculators/garden/seed-germination-tracker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Spiringslogg',
  description: 'Følg spiring og spiringsprosent for frøene dine',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg plante', text: 'Velg fra listen eller skriv inn eget navn.' },
  { name: 'Legg inn dato og antall', text: 'Såddato og hvor mange frø du har sådd.' },
  { name: 'Registrer spiring', text: 'Trykk +1 hver gang et frø spirer.' },
  { name: 'Følg med', text: 'Se spiringsprosent for hver såing og samlet.' },
];

const faqs = [
  { question: 'Hva er en god spiringsprosent?', answer: 'Over 80 % er svært bra, og 50–80 % er bra. Lavere tyder på gamle frø eller dårlige forhold, som for kald eller for våt jord.' },
  { question: 'Hvor lenge bør jeg vente?', answer: 'Spiretiden varierer: salat 2–10 dager, tomat 5–10 dager og gulrot 10–21 dager. Gi frøene litt ekstra tid i kjølig vær.' },
  { question: 'Hvor lagres loggen?', answer: 'Loggen lagres bare i nettleseren på denne enheten. Den deles ikke og følger ikke med til en annen enhet.' },
  { question: 'Kan jeg legge inn egne planter?', answer: 'Ja, velg Annet og skriv inn navnet.' },
];

const relatedTools = [
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Grønnsakavling', description: 'Anslå avling av grønnsaker ut fra antall planter og sort' },
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
];

export default function SeedGerminationTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="seed-germination-tracker"
          title="Spiringslogg"
          description="Hold oversikt over hvor mange frø som spirer, og beregn spiringsprosent for hver såing. Gratis og uten registrering."
        />

        <section aria-label="Spiringslogg">
          <SeedGerminationTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
