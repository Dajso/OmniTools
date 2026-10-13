import { Metadata } from 'next';
import { UnitCostPerServingCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kostnad per porsjon – gratis kalkulator på nett',
  description: 'Regn ut hva en porsjon koster ut fra råvarepriser og antall porsjoner. Gratis og uten registrering.',
  keywords: ['kostnad per porsjon', 'matkostnad', 'oppskrift', 'råvarepris', 'måltid'],
  alternates: { canonical: '/calculators/baking/unit-cost-per-serving' },
  openGraph: {
    title: 'Kostnad per porsjon',
    description: 'Regn ut hva en porsjon koster ut fra råvarepriser og antall porsjoner',
    url: '/calculators/baking/unit-cost-per-serving',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kostnad per porsjon',
  description: 'Regn ut hva en porsjon koster ut fra råvarepriser og antall porsjoner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn ingrediensene', text: 'Skriv inn navn og pris i kroner for mengden du bruker.' },
  { name: 'Oppgi antall porsjoner', text: 'Hvor mange porsjoner oppskriften gir.' },
  { name: 'Sett margin', text: 'Oppgi ønsket påslag hvis du skal selge. Husk at MVA kommer på toppen.' },
];

const faqs = [
  { question: 'Hvordan regnes kostnaden ut?', answer: 'Alle ingrediensprisene summeres og deles på antall porsjoner.' },
  { question: 'Er MVA med?', answer: 'Nei. Mat som selges i Norge har normalt 15 % MVA, mens servering har 25 %. Legg til dette etter at du har satt prisen.' },
  { question: 'Hva bør jeg ta med i regnestykket?', answer: 'Ta med emballasje, strøm og din egen tid hvis du skal selge produktet.' },
];

const relatedTools = [
  { href: '/calculators/baking/bakers-percentage-calculator', title: 'Bakerprosent', description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde' },
];

export default function UnitCostPerServingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="unit-cost-per-serving"
          title="Kostnad per porsjon"
          description="Regn ut hva en porsjon koster ut fra råvarepriser, og sett en salgspris med ønsket margin. Gratis og uten registrering."
        />

        <section aria-label="Kostnad per porsjon">
          <UnitCostPerServingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
