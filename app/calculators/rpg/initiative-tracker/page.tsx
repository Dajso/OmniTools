import { Metadata } from 'next';
import { InitiativeTracker } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Initiativrekkefølge – gratis kalkulator på nett',
  description: 'Hold orden på initiativ og tur-rekkefølge i kamper. Gratis og uten registrering.',
  keywords: ['initiativ', 'kampsporing', 'turrekkefølge', 'rollespill'],
  alternates: { canonical: '/calculators/rpg/initiative-tracker' },
  openGraph: {
    title: 'Initiativrekkefølge',
    description: 'Hold orden på initiativ og tur-rekkefølge i kamper',
    url: '/calculators/rpg/initiative-tracker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Initiativrekkefølge',
  description: 'Hold orden på initiativ og tur-rekkefølge i kamper',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg til deltakere', text: 'Skriv navn og eventuelt initiativ, HP og AC.' },
  { name: 'Start kampen', text: 'Rekkefølgen sorteres etter initiativ.' },
  { name: 'Gå gjennom rundene', text: 'Trykk på «Neste tur» for å flytte videre.' },
  { name: 'Marker tilstander', text: 'Legg til tilstander som lammet eller forgiftet og fjern dem ved å klikke.' },
];

const faqs = [
  { question: 'Hva om jeg ikke fyller ut initiativ?', answer: 'Da kaster kalkulatoren 1d20 automatisk.' },
  { question: 'Hvordan skiller jeg spillere og fiender?', answer: 'Spillerkarakterer vises i blått og fiender i rødt.' },
  { question: 'Lagres kampen?', answer: 'Nei, den ligger bare i nettleseren mens siden er åpen.' },
  { question: 'Hvordan markerer jeg en beseiret deltaker?', answer: 'Trykk på hodeskallen ved navnet.' },
];

const relatedTools = [
  { href: '/calculators/rpg/dice-roller', title: 'Terningkast', description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Møtevanskelighet (D&D 5e)', description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse' },
  { href: '/calculators/rpg/character-sheet-helper', title: 'Karakterark-hjelper', description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende' },
];

export default function InitiativeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="initiative-tracker"
          title="Initiativrekkefølge"
          description="Hold styr på kamprekkefølge, HP, AC og tilstander i D&D-møter. Kast initiativ automatisk. Gratis og uten registrering."
        />

        <section aria-label="Initiativrekkefølge">
          <InitiativeTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
