import { Metadata } from 'next';
import { FantasyNameGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fantasynavn-generator – gratis kalkulator på nett',
  description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl. Gratis og uten registrering.',
  keywords: ['fantasynavn', 'navnegenerator', 'alv', 'dverg', 'rollespill'],
  alternates: { canonical: '/calculators/rpg/fantasy-name-generator' },
  openGraph: {
    title: 'Fantasynavn-generator',
    description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl.',
    url: '/calculators/rpg/fantasy-name-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fantasynavn-generator',
  description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl.',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg rase', text: 'Hver rase har sin egen navnestil.' },
  { name: 'Velg kjønn og antall', text: 'Du kan lage opptil 20 navn om gangen.' },
  { name: 'Trykk på lag navn', text: 'Navnene settes sammen av forstavelser og endelser.' },
  { name: 'Kopier navnet', text: 'Klikk på et navn eller bruk «Kopier alle».' },
];

const faqs = [
  { question: 'Er navnene ekte?', answer: 'Nei, de er fantasinavn laget av tilfeldige deler. Noen kan ligne på kjente navn av en tilfeldighet.' },
  { question: 'Kan jeg bruke navnene i min egen kampanje?', answer: 'Ja, fritt, både i hjemmespill og i skrevne historier.' },
  { question: 'Hva betyr nøytral?', answer: 'Navn som ikke er knyttet til kjønn, for eksempel til androgyne karakterer.' },
  { question: 'Hvordan lages navnene?', answer: 'Ved å kombinere en forstavelse og en endelse som passer til rasen.' },
];

const relatedTools = [
  { href: '/calculators/rpg/character-sheet-helper', title: 'Karakterark-hjelper', description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende' },
  { href: '/calculators/rpg/tavern-generator', title: 'Vertshusgenerator', description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning' },
  { href: '/calculators/rpg/quest-idea-generator', title: 'Oppdragsideer', description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill' },
];

export default function FantasyNameGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fantasy-name-generator"
          title="Fantasynavn-generator"
          description="Lag navn til alver, dverger, mennesker, orker, halvlinger og drakeætlinger. Velg kjønn og antall, og kopier med ett klikk. Gratis og uten registrering."
        />

        <section aria-label="Fantasynavn-generator">
          <FantasyNameGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
