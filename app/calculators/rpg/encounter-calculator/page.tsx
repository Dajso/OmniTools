import { Metadata } from 'next';
import { EncounterDifficultyCalculator } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Møtevanskelighet (D&D 5e) – gratis kalkulator på nett',
  description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse. Gratis og uten registrering.',
  keywords: ['møtevanskelighet', 'encounter', 'CR', 'DnD', 'gruppenivå'],
  alternates: { canonical: '/calculators/rpg/encounter-calculator' },
  openGraph: {
    title: 'Møtevanskelighet (D&D 5e)',
    description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse',
    url: '/calculators/rpg/encounter-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Møtevanskelighet (D&D 5e)',
  description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn gruppen', text: 'Antall spillere og nivå.' },
  { name: 'Legg inn monstre', text: 'Velg CR og antall.' },
  { name: 'Se vanskelighetsgraden', text: 'Lett, middels, vanskelig eller dødelig.' },
  { name: 'Sjekk XP-grensene', text: 'Se hvor mye XP som skal til for hvert nivå.' },
];

const faqs = [
  { question: 'Hva er CR?', answer: 'Challenge Rating, utfordringsgrad. Den viser omtrent hvor sterkt et monster er.' },
  { question: 'Hvorfor øker multiplikatoren med antall monstre?', answer: 'Flere monstre gjør møtet farligere enn summen av XP skulle tilsi.' },
  { question: 'Er resultatet nøyaktig?', answer: 'Det er en veiledning. Terreng, taktikk og gruppens utstyr kan gjøre møtet lettere eller vanskeligere.' },
  { question: 'Hvilke regler brukes?', answer: 'Utregningen følger veiledningen for møter i D&D 5e (2014).' },
];

const relatedTools = [
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiativrekkefølge', description: 'Hold orden på initiativ og tur-rekkefølge i kamper' },
  { href: '/calculators/rpg/loot-generator', title: 'Skattegenerator', description: 'Lag tilfeldig skatt og bytte til rollespill: gull, edelstener og gjenstander' },
  { href: '/calculators/rpg/dice-roller', title: 'Terningkast', description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3' },
];

export default function EncounterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="encounter-calculator"
          title="Møtevanskelighet (D&D 5e)"
          description="Regn ut hvor vanskelig et møte er i D&D 5e ut fra gruppens nivå og monstrenes CR. Gratis og uten registrering."
        />

        <section aria-label="Møtevanskelighet (D&D 5e)">
          <EncounterDifficultyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
