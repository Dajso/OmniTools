import { Metadata } from 'next';
import { WaterRecipeCalculator } from '@/components/calculators/coffee/water-recipe-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vannoppskrift for kaffe – gratis kalkulator på nett',
  description: 'Regn ut mineraltilsetning for å lage bryggevann etter SCA-standard. Gratis og uten registrering.',
  keywords: ['vann', 'kaffevann', 'vannkjemi', 'SCA', 'hardhet', 'alkalinitet'],
  alternates: { canonical: '/calculators/coffee/water-recipe-calculator' },
  openGraph: {
    title: 'Vannoppskrift for kaffe',
    description: 'Regn ut mineraltilsetning for å lage bryggevann etter SCA-standard',
    url: '/calculators/coffee/water-recipe-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vannoppskrift for kaffe',
  description: 'Regn ut mineraltilsetning for å lage bryggevann etter SCA-standard',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi vannmengden', text: 'Hvor mange liter bryggevann du vil lage.' },
  { name: 'Velg hardhet og alkalinitet', text: 'Standardverdiene følger SCA-anbefalingen.' },
  { name: 'Les av mengdene', text: 'Se hvor mange gram epsomsalt og natron du trenger.' },
  { name: 'Bland og la hvile', text: 'Rør godt og la vannet stå i 10–15 minutter.' },
];

const faqs = [
  { question: 'Hvorfor er vannet viktig for kaffe?', answer: 'Kaffe er over 98 % vann. Mineralene påvirker hvor mye smak som trekkes ut, og hvor sur eller flat kaffen smaker.' },
  { question: 'Hva anbefaler SCA?', answer: 'Hardhet på 50–175 ppm og alkalinitet på 40–70 ppm.' },
  { question: 'Må jeg bruke destillert vann?', answer: 'Ja, som utgangspunkt. Destillert eller omvendt osmose-vann har nesten ingen mineraler, så du styrer innholdet selv.' },
  { question: 'Hvor lenge holder vannet?', answer: 'Oppbevar det i en ren, lukket beholder og bruk det innen en uke.' },
];

const relatedTools = [
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
];

export default function WaterRecipeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="water-recipe-calculator"
          title="Vannoppskrift for kaffe"
          description="Regn ut hvor mye epsomsalt og natron du må tilsette destillert vann for å få bryggevann etter SCA-standarden. Gratis og uten registrering."
        />

        <section aria-label="Vannoppskrift for kaffe">
          <WaterRecipeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
