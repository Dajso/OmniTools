import { Metadata } from 'next';
import { WaterIntakeCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vannbehov – gratis kalkulator på nett',
  description: 'Beregn hvor mye vann du bør drikke per dag ut fra kroppsvekt. Gratis og uten registrering.',
  keywords: ['vannbehov', 'væskebehov', 'drikke vann', 'hydrering'],
  alternates: { canonical: '/calculators/health/water-intake-calculator' },
  openGraph: {
    title: 'Vannbehov',
    description: 'Beregn hvor mye vann du bør drikke per dag ut fra kroppsvekt',
    url: '/calculators/health/water-intake-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vannbehov',
  description: 'Beregn hvor mye vann du bør drikke per dag ut fra kroppsvekt',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn vekten din', text: 'Bruk kilo.' },
  { name: 'Velg aktivitetsnivå', text: 'Mer trening gir høyere vannbehov.' },
  { name: 'Velg klima', text: 'Varmt vær øker behovet.' },
  { name: 'Les resultatet', text: 'Se anbefalt mengde i liter og antall glass.' },
];

const faqs = [
  { question: 'Hvor mye vann bør jeg drikke?', answer: 'Anslagsvis 30–35 ml per kilo kroppsvekt per dag, inkludert vann fra mat og andre drikker.' },
  { question: 'Teller kaffe og te med?', answer: 'Ja, alle drikker bidrar til væskeinntaket, men vann er det beste valget.' },
  { question: 'Hvordan vet jeg om jeg drikker nok?', answer: 'Lys gul urin er et godt tegn. Mørk urin og tørste kan tyde på at du trenger mer væske.' },
  { question: 'Kan jeg drikke for mye?', answer: 'Ja, svært store mengder på kort tid kan gi farlig lavt saltnivå. Drikk jevnt utover dagen.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

export default function WaterIntakeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="water-intake-calculator"
          title="Vannbehov"
          description="Anslå hvor mange liter vann du bør drikke per dag ut fra vekt, aktivitet og klima. Gratis og uten registrering."
        />

        <section aria-label="Vannbehov">
          <WaterIntakeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
