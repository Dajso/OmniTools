import { Metadata } from 'next';
import { RPGStatRoller } from '@/components/calculators/rpg';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Egenskaper (4d6) – gratis kalkulator på nett',
  description: 'Trekk karakteregenskaper med 4d6, dropp laveste. Gratis og uten registrering.',
  keywords: ['karakteregenskaper', '4d6', 'rollespill', 'DnD', 'attributter'],
  alternates: { canonical: '/calculators/rpg/stat-roller' },
  openGraph: {
    title: 'Egenskaper (4d6)',
    description: 'Trekk karakteregenskaper med 4d6, dropp laveste',
    url: '/calculators/rpg/stat-roller',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Egenskaper (4d6)',
  description: 'Trekk karakteregenskaper med 4d6, dropp laveste',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg metode', text: '4d6, 3d6, standardrekke eller poengkjøp.' },
  { name: 'Kast egenskapene', text: 'Seks verdier lages for styrke, smidighet, utholdenhet, intelligens, visdom og sjarme.' },
  { name: 'Se modifikatorene', text: 'Hver verdi får sin modifikator.' },
  { name: 'Kopier resultatet', text: 'Bruk «Kopier» for å lime det inn på karakterarket.' },
];

const faqs = [
  { question: 'Hva er 4d6 dropp laveste?', answer: 'Du kaster fire sekssidede terninger og dropper den laveste. Den vanligste metoden i D&D 5e.' },
  { question: 'Hva er standardrekken?', answer: 'Verdiene 15, 14, 13, 12, 10 og 8, som du fordeler selv.' },
  { question: 'Hva er poengkjøp?', answer: 'Du har 27 poeng å bruke på verdier mellom 8 og 15. Høye verdier koster mer.' },
  { question: 'Hva er en modifikator?', answer: '(verdi − 10) ÷ 2, rundet ned. Den legges til terningkast for den egenskapen.' },
];

const relatedTools = [
  { href: '/calculators/rpg/dice-roller', title: 'Terningkast', description: 'Kast virtuelle terninger til rollespill: D4, D6, D8, D10, D12, D20 og notasjon som 2d6+3' },
  { href: '/calculators/rpg/character-sheet-helper', title: 'Karakterark-hjelper', description: 'Regn ut egenskapsmodifikatorer og ferdighetsbonus til D&D 5e og lignende' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Møtevanskelighet (D&D 5e)', description: 'Regn ut vanskelighetsgraden på et møte ut fra gruppens nivå og størrelse' },
];

export default function StatRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="stat-roller"
          title="Egenskaper (4d6)"
          description="Lag egenskapsverdier til D&D-karakteren din med 4d6 dropp laveste, 3d6, standardrekke eller poengkjøp. Gratis og uten registrering."
        />

        <section aria-label="Egenskaper (4d6)">
          <RPGStatRoller />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
