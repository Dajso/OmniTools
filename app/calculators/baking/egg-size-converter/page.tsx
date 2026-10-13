import { Metadata } from 'next';
import { EggSizeConverterCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Eggstørrelse – gratis kalkulator på nett',
  description: 'Regn om mellom eggstørrelser (S, M, L, XL) i oppskrifter. Gratis og uten registrering.',
  keywords: ['eggstørrelse', 'egg', 'eggvekt', 'erstatte egg'],
  alternates: { canonical: '/calculators/baking/egg-size-converter' },
  openGraph: {
    title: 'Eggstørrelse',
    description: 'Regn om mellom eggstørrelser (S, M, L, XL) i oppskrifter',
    url: '/calculators/baking/egg-size-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Eggstørrelse',
  description: 'Regn om mellom eggstørrelser (S, M, L, XL) i oppskrifter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg størrelsen oppskriften bruker', text: 'Norske egg selges som S, M, L og XL.' },
  { name: 'Oppgi antall egg', text: 'Skriv inn hvor mange egg oppskriften krever.' },
  { name: 'Velg størrelsen du har', text: 'Se hvor mange egg du trenger av den størrelsen.' },
];

const faqs = [
  { question: 'Hva veier et egg?', answer: 'Størrelse M veier 53–63 g, L veier 63–73 g og XL er over 73 g. S er under 53 g. Kalkulatoren bruker typisk vekt på innholdet uten skall.' },
  { question: 'Hvilken størrelse bruker de fleste oppskrifter?', answer: 'Vanligvis M eller L.' },
  { question: 'Hva gjør jeg med halve egg?', answer: 'Pisk egget og vei opp mengden i gram.' },
];

const relatedTools = [
  { href: '/calculators/baking/cake-pan-converter', title: 'Kakeform: omregner', description: 'Regn om oppskrifter mellom ulike former og størrelser, for eksempel springform i cm' },
  { href: '/calculators/baking/bakers-percentage-calculator', title: 'Bakerprosent', description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde' },
];

export default function EggSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="egg-size-converter"
          title="Eggstørrelse"
          description="Regn om mellom eggstørrelser (S, M, L og XL) i oppskrifter. Gratis og uten registrering."
        />

        <section aria-label="Eggstørrelse">
          <EggSizeConverterCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
