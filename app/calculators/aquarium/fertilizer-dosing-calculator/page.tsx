import { Metadata } from 'next';
import { FertilizerDosingCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gjødseldosering (EI) – gratis kalkulator på nett',
  description: 'Regn ut EI-dosering av gjødsel til plantet akvarium. Gratis og uten registrering.',
  keywords: ['EI-metoden', 'gjødsel', 'plantet akvarium', 'makro', 'mikro'],
  alternates: { canonical: '/calculators/aquarium/fertilizer-dosing-calculator' },
  openGraph: {
    title: 'Gjødseldosering (EI)',
    description: 'Regn ut EI-dosering av gjødsel til plantet akvarium',
    url: '/calculators/aquarium/fertilizer-dosing-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gjødseldosering (EI)',
  description: 'Regn ut EI-dosering av gjødsel til plantet akvarium',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi volumet', text: 'Akvariumvolum i liter.' },
  { name: 'Les av doser', text: 'Se gram per dose for makro- og mikronæringsstoffer.' },
  { name: 'Følg planen', text: 'Doser tre ganger i uka for hver gruppe og skift 50 % vann på dag 7.' },
  { name: 'Juster ved behov', text: 'Reduser hvis du får alger, øk hvis plantene viser mangel.' },
];

const faqs = [
  { question: 'Hva er EI-metoden?', answer: 'Estimative Index: du gir plantene rikelig med næring jevnlig og nullstiller med et stort ukentlig vannskifte.' },
  { question: 'Hvilken størrelse er doseringen basert på?', answer: 'Doseringen er skalert fra en referanse på 150 liter, så du får riktig mengde for ditt kar.' },
  { question: 'Er alle gjødselsalter nødvendige?', answer: 'Vanligvis brukes kaliumnitrat, monokaliumfosfat, kaliumsulfat og en sporstoffblanding.' },
  { question: 'Hva om jeg får alger?', answer: 'Sjekk lys og CO₂ først, og reduser så dosene litt. Ubalanse mellom lys, CO₂ og næring gir som regel alger.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/co2-bubble-calculator', title: 'CO₂-bobler', description: 'Regn ut CO₂-konsentrasjon fra KH og pH, og anbefalt boblefrekvens' },
  { href: '/calculators/aquarium/par-estimator', title: 'Lysstyrke (PAR) i akvarium', description: 'Anslå hvordan vanndybde svekker lyset (PAR) i plantet akvarium' },
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
];

export default function FertilizerDosingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fertilizer-dosing-calculator"
          title="Gjødseldosering (EI)"
          description="Regn ut dosering av gjødsel etter EI-metoden for plantekar, skalert etter akvariets volum. Gratis og uten registrering."
        />

        <section aria-label="Gjødseldosering (EI)">
          <FertilizerDosingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
