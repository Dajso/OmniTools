import { Metadata } from 'next';
import { MapGridGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Rutenett til kart – gratis kalkulator på nett',
  description: 'Lag utskriftsklare heksagon- og rutenett til rollespillkart. Gratis og uten registrering.',
  keywords: ['rutenett', 'hexgrid', 'kampkart', 'rollespillkart'],
  alternates: { canonical: '/calculators/rpg/map-grid-generator' },
  openGraph: {
    title: 'Rutenett til kart',
    description: 'Lag utskriftsklare heksagon- og rutenett til rollespillkart',
    url: '/calculators/rpg/map-grid-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rutenett til kart',
  description: 'Lag utskriftsklare heksagon- og rutenett til rollespillkart',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg rutenett', text: 'Kvadrat eller heks (flat eller spiss topp).' },
  { name: 'Velg størrelse', text: 'Antall rader, kolonner og rutestørrelse.' },
  { name: 'Mal terreng', text: 'Velg terreng og klikk eller dra på rutenettet.' },
  { name: 'Last ned', text: 'Lagre kartet som SVG til utskrift eller virtuelt bord.' },
];

const faqs = [
  { question: 'Hvor stor er en rute?', answer: 'I D&D er en rute 5 fot, omtrent 1,5 meter.' },
  { question: 'Hva er forskjellen på heks og kvadrat?', answer: 'Heksruter gir jevnere avstand i alle retninger, mens kvadratruter er enklere å tegne og bruke.' },
  { question: 'Kan jeg bruke kartet i et virtuelt bord?', answer: 'Ja, SVG fungerer i de fleste verktøy, men noen krever PNG.' },
  { question: 'Hvordan visker jeg ut?', answer: 'Velg terrengtypen «Tom» og mal over.' },
];

const relatedTools = [
  { href: '/calculators/rpg/encounter-calculator', title: 'Møtevanskelighet (D&D 5e)', description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse' },
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiativrekkefølge', description: 'Hold orden på initiativ og tur-rekkefølge i kamper' },
  { href: '/calculators/rpg/tavern-generator', title: 'Vertshusgenerator', description: 'Lag tilfeldige vertshus med navn, meny, personer og stemning' },
];

export default function MapGridGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="map-grid-generator"
          title="Rutenett til kart"
          description="Lag heks- eller kvadratrutenett til kampkart i bordrollespill, mal terreng og last ned som SVG. Gratis og uten registrering."
        />

        <section aria-label="Rutenett til kart">
          <MapGridGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
