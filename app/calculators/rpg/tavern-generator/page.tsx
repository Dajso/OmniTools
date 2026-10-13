import { Metadata } from 'next';
import { TavernGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vertshusgenerator – gratis kalkulator på nett',
  description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning. Gratis og uten registrering.',
  keywords: ['vertshus', 'taverna', 'NPC', 'fantasy', 'rollespill'],
  alternates: { canonical: '/calculators/rpg/tavern-generator' },
  openGraph: {
    title: 'Vertshusgenerator',
    description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning',
    url: '/calculators/rpg/tavern-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vertshusgenerator',
  description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg kvalitetsnivå', text: 'Fra elendig til aristokratisk, eller tilfeldig.' },
  { name: 'Trykk på lag vertshus', text: 'Du får navn, beskrivelse, ansatte og meny.' },
  { name: 'Les rykter', text: 'Ryktene kan brukes som oppdragskroker.' },
  { name: 'Lag flere', text: 'Tidligere vertshus ligger i historikken.' },
];

const faqs = [
  { question: 'Hva betyr prisene?', answer: 'De er oppgitt i D&D-myntene gp, sp og cp (gull, sølv og kobber).' },
  { question: 'Hva koster overnatting?', answer: 'Fra 1 sp per natt i et elendig vertshus til over 10 gp i et aristokratisk.' },
  { question: 'Kan jeg endre resultatet?', answer: 'Ja, bruk det som utgangspunkt og tilpass det til kampanjen din.' },
  { question: 'Er navnene fra en bestemt verden?', answer: 'Nei, de er laget av tilfeldige deler og passer til de fleste fantasiverdener.' },
];

const relatedTools = [
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasynavn-generator', description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl.' },
  { href: '/calculators/rpg/quest-idea-generator', title: 'Oppdragsideer', description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill' },
  { href: '/calculators/rpg/loot-generator', title: 'Skattegenerator', description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander' },
];

export default function TavernGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tavern-generator"
          title="Vertshusgenerator"
          description="Lag tilfeldige vertshus med navn, ansatte, meny, rykter og særtrekk til rollespillet ditt. Gratis og uten registrering."
        />

        <section aria-label="Vertshusgenerator">
          <TavernGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
