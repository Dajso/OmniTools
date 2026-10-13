import { Metadata } from 'next';
import { RainwaterCollectionCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Regnvann – gratis kalkulator på nett',
  description: 'Regn ut hvor mye regnvann du kan samle fra taket. Gratis og uten registrering.',
  keywords: ['regnvann', 'oppsamling', 'takflate', 'regntønne', 'nedbør'],
  alternates: { canonical: '/calculators/solar/rainwater-collection-calculator' },
  openGraph: {
    title: 'Regnvann',
    description: 'Regn ut hvor mye regnvann du kan samle fra taket',
    url: '/calculators/solar/rainwater-collection-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Regnvann',
  description: 'Regn ut hvor mye regnvann du kan samle fra taket',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn takflaten', text: 'Bruk grunnflaten under taket, ikke selve takflaten.' },
  { name: 'Skriv inn årsnedbør', text: 'Velg en by eller skriv inn egen verdi i mm.' },
  { name: 'Velg oppsamlingsgrad', text: '80 % er et vanlig anslag. Det tar høyde for tap i renner og overløp.' },
  { name: 'Les av resultatet', text: 'Du får mengde per år og måned, og hvor mange døgn det dekker for én person.' },
];

const faqs = [
  { question: 'Hvordan regnes regnvannet ut?', answer: 'Én millimeter nedbør på én kvadratmeter gir én liter. Ganget med takflate og oppsamlingsgrad.' },
  { question: 'Kan jeg drikke regnvannet?', answer: 'Ikke uten rensing. Regnvann egner seg til hagevanning, vask og hjelp til toalett.' },
  { question: 'Hvor mye regner det i Norge?', answer: 'Fra under 800 mm i Oslo til over 2000 mm i Bergen. Se forvalgene i kalkulatoren.' },
  { question: 'Trenger jeg tillatelse?', answer: 'Små tønner til hagen krever normalt ikke tillatelse. For større anlegg og tilkobling til husets vannsystem gjelder egne regler. Sjekk med kommunen.' },
];

const relatedTools = [
  { href: '/calculators/solar/solar-roi-calculator', title: 'Lønnsomhet for solceller', description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner' },
  { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Driftstid på batteri', description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd' },
];

export default function RainwaterCollectionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="rainwater-collection-calculator"
          title="Regnvann"
          description="Regn ut hvor mye regnvann du kan samle fra taket i liter og kubikkmeter, med nedbørstall for norske byer. Gratis og uten registrering."
        />

        <section aria-label="Regnvann">
          <RainwaterCollectionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
