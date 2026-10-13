import { Metadata } from 'next';
import { CharacterSheetHelper } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Karakterark-hjelper – gratis kalkulator på nett',
  description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende. Gratis og uten registrering.',
  keywords: ['karakterark', 'modifikator', 'ferdighetsbonus', 'DnD'],
  alternates: { canonical: '/calculators/rpg/character-sheet-helper' },
  openGraph: {
    title: 'Karakterark-hjelper',
    description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende',
    url: '/calculators/rpg/character-sheet-helper',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Karakterark-hjelper',
  description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg nivå og klasse', text: 'Ferdighetsbonus og treffterning følger nivået.' },
  { name: 'Skriv inn egenskapsverdier', text: 'Eller bruk standardrekken.' },
  { name: 'Marker ferdigheter', text: 'Klikk for å bytte mellom ingen, dyktig og ekspert.' },
  { name: 'Les av verdiene', text: 'Se AC, initiativ, HP og passive ferdigheter.' },
];

const faqs = [
  { question: 'Hvordan regnes modifikatoren ut?', answer: '(verdi − 10) ÷ 2, rundet ned.' },
  { question: 'Hva er ferdighetsbonus?', answer: '+2 på nivå 1, og den øker med 1 hvert fjerde nivå.' },
  { question: 'Hva er ekspertise?', answer: 'Den dobler ferdighetsbonusen for en ferdighet.' },
  { question: 'Hva er passiv oppmerksomhet?', answer: '10 + modifikator for oppmerksomhet, brukt når karakteren ikke kaster aktivt.' },
];

const relatedTools = [
  { href: '/calculators/rpg/stat-roller', title: 'Egenskaper (4d6)', description: 'Trekk karakteregenskaper med 4d6, dropp laveste' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasynavn-generator', description: 'Lag fantasynavn til rollespillfigurer: alv, dverg, menneske, ork m.fl.' },
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiativrekkefølge', description: 'Hold orden på initiativ og tur-rekkefølge i kamper' },
];

export default function CharacterSheetHelperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="character-sheet-helper"
          title="Karakterark-hjelper"
          description="Regn ut egenskapsmodifikatorer, ferdighetsbonus, redningskast og passive ferdigheter for D&D 5e-karakterer. Gratis og uten registrering."
        />

        <section aria-label="Karakterark-hjelper">
          <CharacterSheetHelper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
