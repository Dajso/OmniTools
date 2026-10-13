import { Metadata } from 'next';
import { InverterSizeCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vekselretter – gratis kalkulator på nett',
  description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm. Gratis og uten registrering.',
  keywords: ['inverter', 'vekselretter', 'effekt', 'watt', 'startstrøm'],
  alternates: { canonical: '/calculators/solar/inverter-size-calculator' },
  openGraph: {
    title: 'Vekselretter',
    description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm',
    url: '/calculators/solar/inverter-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vekselretter',
  description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn utstyr', text: 'Legg til hvert apparat med effekt i watt og antall.' },
  { name: 'Merk utstyr med startstrøm', text: 'Pumper, kjøleskap og verktøy trekker mye mer i et øyeblikk når de starter.' },
  { name: 'Velg margin', text: 'En margin på 25 % er et godt utgangspunkt.' },
  { name: 'Les av størrelsen', text: 'Du får anbefalt kontinuerlig effekt og toppeffekt.' },
];

const faqs = [
  { question: 'Hva er startstrøm?', answer: 'Motorer kan trekke 2–7 ganger merkeeffekten i et kort øyeblikk. Vekselretteren må tåle denne toppen.' },
  { question: 'Rent sinus eller modifisert sinus?', answer: 'Rent sinus passer for alt, og er nødvendig for mye elektronikk og motorer. Modifisert sinus er billigere, men kan gi støy og dårligere virkning.' },
  { question: 'Hvorfor margin?', answer: 'Vekselretteren bør ikke gå på maks hele tiden. Margin gir lengre levetid og tåler mer.' },
  { question: 'Hvor mye taper en vekselretter?', answer: 'Ofte 5–15 %, avhengig av belastning. Det tas med i batteriberegningen.' },
];

const relatedTools = [
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
  { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Driftstid på batteri', description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd' },
  { href: '/calculators/solar/dc-power-calculator', title: 'Ampere og watt (DC)', description: 'Regn om mellom ampere, watt og volt for likestrøm' },
];

export default function InverterSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="inverter-size-calculator"
          title="Vekselretter"
          description="Regn ut hvor stor vekselretter (inverter) du trenger, ut fra utstyret du skal drive og startstrøm. Gratis og uten registrering."
        />

        <section aria-label="Vekselretter">
          <InverterSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
