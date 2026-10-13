import { Metadata } from 'next';
import { SaltMixCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Saltblanding – gratis kalkulator på nett',
  description: 'Regn ut saltmengde for å nå ønsket saltholdighet i saltvannsakvarium. Gratis og uten registrering.',
  keywords: ['saltvann', 'saltblanding', 'revakvarium', 'saltholdighet', 'egenvekt'],
  alternates: { canonical: '/calculators/aquarium/salt-mix-calculator' },
  openGraph: {
    title: 'Saltblanding',
    description: 'Regn ut saltmengde for å nå ønsket saltholdighet i saltvannsakvarium',
    url: '/calculators/aquarium/salt-mix-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Saltblanding',
  description: 'Regn ut saltmengde for å nå ønsket saltholdighet i saltvannsakvarium',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi vannvolum', text: 'Hvor mange liter du skal blande.' },
  { name: 'Velg salttype', text: 'Velg merke, eller legg inn egen mengde gram per liter.' },
  { name: 'Velg ønsket egenvekt', text: 'Typisk 1,024–1,026 for revakvarium.' },
  { name: 'Les av saltmengden', text: 'Se hvor mange gram eller kilo salt du trenger.' },
];

const faqs = [
  { question: 'Hvilken egenvekt bør revakvariet ha?', answer: 'De fleste rev ligger på 1,024–1,026 ved 25 °C, som tilsvarer ca. 35 ‰ saltholdighet.' },
  { question: 'Hvor mye salt trenger jeg per liter?', answer: 'Det varierer med merke, men vanligvis 30–37 gram per liter for å nå full saltholdighet.' },
  { question: 'Bør jeg måle egenvekten etter blanding?', answer: 'Ja. Bruk refraktometer og la saltet løse seg opp i minst en time (gjerne over natten) før du måler.' },
  { question: 'Kan jeg bruke vanlig bordsalt?', answer: 'Nei. Bruk ferdig blandet marint salt, som inneholder alle sporstoffene dyrene trenger.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/water-change-calculator', title: 'Vannskifte', description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier' },
];

export default function SaltMixCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="salt-mix-calculator"
          title="Saltblanding"
          description="Regn ut hvor mye salt du må blande i vannet for å nå ønsket saltholdighet i saltvannsakvariet. Gratis og uten registrering."
        />

        <section aria-label="Saltblanding">
          <SaltMixCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
