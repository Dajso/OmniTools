import { Metadata } from 'next';
import { DiceRoller } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Terningkast – gratis kalkulator på nett',
  description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3. Gratis og uten registrering.',
  keywords: ['terning', 'd20', 'rollespill', 'terningkast', 'DnD'],
  alternates: { canonical: '/calculators/rpg/dice-roller' },
  openGraph: {
    title: 'Terningkast',
    description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3',
    url: '/calculators/rpg/dice-roller',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Terningkast',
  description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn notasjon', text: 'For eksempel 2d6+3 for to sekssidede terninger pluss 3.' },
  { name: 'Trykk på kast', text: 'Resultatet og de enkelte terningene vises.' },
  { name: 'Bruk hurtigkast', text: 'Velg en vanlig terning som d20 eller d6.' },
  { name: 'Se historikken', text: 'Tidligere kast ligger under resultatet.' },
];

const faqs = [
  { question: 'Hva betyr 2d6+3?', answer: 'Kast to sekssidede terninger, legg øynene sammen og legg til 3.' },
  { question: 'Er kastene tilfeldige?', answer: 'Ja, nettleseren trekker tilfeldige tall for hver terning.' },
  { question: 'Hvor mange terninger kan jeg kaste?', answer: 'Opptil 100 terninger med opptil 1 000 sider per kast.' },
  { question: 'Hva er gjennomsnittet?', answer: 'Forventet sum over mange kast, regnet ut fra notasjonen.' },
];

const relatedTools = [
  { href: '/calculators/rpg/stat-roller', title: 'Egenskaper (4d6)', description: 'Trekk karakteregenskaper med 4d6, dropp laveste' },
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiativrekkefølge', description: 'Hold orden på initiativ og tur-rekkefølge i kamper' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Møtevanskelighet (D&D 5e)', description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse' },
];

export default function DiceRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dice-roller"
          title="Terningkast"
          description="Kast terninger med vanlig notasjon som 2d6+3, 1d20 eller 4d6-2. Se minimum, gjennomsnitt, maksimum og kasthistorikk. Gratis og uten registrering."
        />

        <section aria-label="Terningkast">
          <DiceRoller />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
