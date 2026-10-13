import { Metadata } from 'next';
import { LootGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Skattegenerator – gratis kalkulator på nett',
  description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander. Gratis og uten registrering.',
  keywords: ['skatt', 'bytte', 'loot', 'magiske gjenstander', 'rollespill'],
  alternates: { canonical: '/calculators/rpg/loot-generator' },
  openGraph: {
    title: 'Skattegenerator',
    description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander',
    url: '/calculators/rpg/loot-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Skattegenerator',
  description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg skattenivå', text: 'Velg nivå etter CR på monstrene gruppen har beseiret.' },
  { name: 'Trykk på lag skatt', text: 'Du får mynter, steiner og gjenstander.' },
  { name: 'Se total verdi', text: 'Verdien oppgis i gullstykker (gp).' },
  { name: 'Kopier skatten', text: 'Bruk «Kopier skatten» for å lime den inn i notatene dine.' },
];

const faqs = [
  { question: 'Hva er gp?', answer: 'Gullstykker, standardmynten i D&D. 1 gp er verdt 10 sp og 100 cp.' },
  { question: 'Hvilket nivå bør jeg velge?', answer: 'Det som passer CR-en til monstrene: liten for CR 0–4, middels for 5–10, stor for 11–16 og legendarisk fra 17.' },
  { question: 'Er gjenstandene fra de offisielle reglene?', answer: 'Mange er inspirert av D&D 5e, men du må selv avgjøre hva som passer i din kampanje.' },
  { question: 'Lagres historikken?', answer: 'Nei, den ligger bare i nettleseren mens siden er åpen.' },
];

const relatedTools = [
  { href: '/calculators/rpg/encounter-calculator', title: 'Møtevanskelighet (D&D 5e)', description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse' },
  { href: '/calculators/rpg/quest-idea-generator', title: 'Oppdragsideer', description: 'Lag tilfeldige oppdrag og eventyrideer til rollespill' },
  { href: '/calculators/rpg/tavern-generator', title: 'Vertshusgenerator', description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning' },
];

export default function LootGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="loot-generator"
          title="Skattegenerator"
          description="Lag tilfeldig skatt til rollespillmøter: mynter, edelstener, kunstgjenstander og magiske gjenstander. Gratis og uten registrering."
        />

        <section aria-label="Skattegenerator">
          <LootGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
