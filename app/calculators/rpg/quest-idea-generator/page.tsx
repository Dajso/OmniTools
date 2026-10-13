import { Metadata } from 'next';
import { QuestIdeaGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Oppdragsideer – gratis kalkulator på nett',
  description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill. Gratis og uten registrering.',
  keywords: ['oppdrag', 'eventyr', 'quest', 'plott', 'rollespill'],
  alternates: { canonical: '/calculators/rpg/quest-idea-generator' },
  openGraph: {
    title: 'Oppdragsideer',
    description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill',
    url: '/calculators/rpg/quest-idea-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Oppdragsideer',
  description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg oppdragstype', text: 'For eksempel redning, eskorte eller kupp.' },
  { name: 'Velg vanskelighetsgrad', text: 'Fra lett til dødelig.' },
  { name: 'Trykk på lag oppdrag', text: 'Du får mål, sted, oppdragsgiver og komplikasjoner.' },
  { name: 'Avslør den hemmelige vrien', text: 'Den er bare ment for spilleder.' },
];

const faqs = [
  { question: 'Må jeg bruke alt som genereres?', answer: 'Nei. Plukk det du liker og endre resten.' },
  { question: 'Hva er en hemmelig vri?', answer: 'Et overraskende element spilleder kan avsløre underveis.' },
  { question: 'Hva er en oppdragskrok?', answer: 'Det som får spillerne til å bli med på oppdraget.' },
  { question: 'Hva betyr vanskelighetsgraden?', answer: 'Den påvirker belønningen og hvor mange komplikasjoner oppdraget får.' },
];

const relatedTools = [
  { href: '/calculators/rpg/tavern-generator', title: 'Vertshusgenerator', description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasynavn-generator', description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl.' },
  { href: '/calculators/rpg/loot-generator', title: 'Skattegenerator', description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander' },
];

export default function QuestIdeaGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="quest-idea-generator"
          title="Oppdragsideer"
          description="Lag tilfeldige oppdrag og eventyrkroker til rollespillkampanjen din, med oppdragsgiver, komplikasjoner, belønning og hemmelig vri. Gratis og uten registrering."
        />

        <section aria-label="Oppdragsideer">
          <QuestIdeaGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
