import { Metadata } from 'next';
import { WaterChangeCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vannskifte – gratis kalkulator på nett',
  description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier. Gratis og uten registrering.',
  keywords: ['vannskifte', 'nitrat', 'delvis vannskifte', 'vannkvalitet'],
  alternates: { canonical: '/calculators/aquarium/water-change-calculator' },
  openGraph: {
    title: 'Vannskifte',
    description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier',
    url: '/calculators/aquarium/water-change-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vannskifte',
  description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi nåværende konsentrasjon', text: 'For eksempel nitrat i ppm.' },
  { name: 'Velg vannskifte', text: 'Andel av vannet du skifter hver gang, i prosent.' },
  { name: 'Velg antall vannskifter', text: 'Hvor mange vannskifter du tenker å gjøre.' },
  { name: 'Les av resultatet', text: 'Se sluttkonsentrasjonen og hvor mange skifter som trengs for å nå målet.' },
];

const faqs = [
  { question: 'Hvordan fungerer et vannskifte?', answer: 'Hvert skifte erstatter en andel av vannet, og konsentrasjonen faller til (1 − andel) av forrige verdi.' },
  { question: 'Hvor mye vann bør jeg skifte?', answer: '20–30 % i uka er vanlig for de fleste kar. Plantekar med EI-metoden skifter ofte 50 %.' },
  { question: 'Hvorfor fjernes ikke alt med ett vannskifte?', answer: 'Fordi nytt vann blandes med det gamle. To skifter på 50 % gir 25 % igjen av det opprinnelige.' },
  { question: 'Kan jeg skifte for mye vann på en gang?', answer: 'Store skifter kan sjokkere fisk hvis temperatur og vannverdier er ulike. Temperer nytt vann først.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/medicine-dosage-calculator', title: 'Medisindosering i akvarium', description: 'Regn ut riktig dose akvariemedisin ut fra volum' },
  { href: '/calculators/aquarium/salt-mix-calculator', title: 'Saltblanding', description: 'Regn ut saltmengde for å nå ønsket saltholdighet i saltvannsakvarium' },
];

export default function WaterChangeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="water-change-calculator"
          title="Vannskifte"
          description="Regn ut hvordan vannskifter reduserer konsentrasjonen av nitrat, fosfat eller andre stoffer i akvariet. Gratis og uten registrering."
        />

        <section aria-label="Vannskifte">
          <WaterChangeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
