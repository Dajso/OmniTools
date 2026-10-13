import { Metadata } from 'next';
import { BakersPercentageCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bakerprosent – gratis kalkulator på nett',
  description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde. Gratis og uten registrering.',
  keywords: ['bakerprosent', 'mel', 'skalere oppskrift', 'brødformel'],
  alternates: { canonical: '/calculators/baking/bakers-percentage-calculator' },
  openGraph: {
    title: 'Bakerprosent',
    description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde',
    url: '/calculators/baking/bakers-percentage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bakerprosent',
  description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn ingrediensene', text: 'Skriv inn navn og vekt i gram for hver ingrediens.' },
  { name: 'Marker melet', text: 'Melet er alltid 100 %. Er det flere melsorter, utgjør de til sammen 100 %.' },
  { name: 'Skaler oppskriften', text: 'Oppgi ønsket mengde mel, så regnes alle de andre ingrediensene om.' },
];

const faqs = [
  { question: 'Hva er bakerprosent?', answer: 'Hver ingrediens oppgis i prosent av melvekten. Da er det enkelt å sammenligne og skalere oppskrifter.' },
  { question: 'Hvorfor er mel alltid 100 %?', answer: 'Mel er utgangspunktet. Vann, salt og gjær regnes i forhold til det, så 2 % salt betyr 20 g per kilo mel.' },
  { question: 'Hva er vanlig saltmengde?', answer: 'Vanligvis 1,8–2,2 % av melvekten.' },
];

const relatedTools = [
  { href: '/calculators/baking/sourdough-hydration-calculator', title: 'Surdeig: hydrering', description: 'Regn ut hydrering i surdeigsbrød, med surdeigsstarter, grovt mel og rug' },
  { href: '/calculators/baking/cake-pan-converter', title: 'Kakeform: omregner', description: 'Regn om oppskrifter mellom ulike former og størrelser, for eksempel springform i cm' },
];

export default function BakersPercentagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bakers-percentage-calculator"
          title="Bakerprosent"
          description="Gjør oppskriften om til bakerprosent og skaler den til ønsket mengde. Gratis og uten registrering."
        />

        <section aria-label="Bakerprosent">
          <BakersPercentageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
