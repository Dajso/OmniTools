import { Metadata } from 'next';
import { MacroCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Makrokalkulator – gratis kalkulator på nett',
  description: 'Beregn daglig behov for protein, karbohydrater og fett. Gratis og uten registrering.',
  keywords: ['makro', 'protein', 'karbohydrater', 'fett', 'kostholdsplan'],
  alternates: { canonical: '/calculators/health/macro-calculator' },
  openGraph: {
    title: 'Makrokalkulator',
    description: 'Beregn daglig behov for protein, karbohydrater og fett',
    url: '/calculators/health/macro-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Makrokalkulator',
  description: 'Beregn daglig behov for protein, karbohydrater og fett',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn kalorier', text: 'Bruk kaloribehovet ditt per dag, for eksempel fra TDEE-kalkulatoren.' },
  { name: 'Velg mål', text: 'For eksempel vektnedgang, vedlikehold eller muskelvekst.' },
  { name: 'Les resultatet', text: 'Se gram protein, karbohydrater og fett, og anbefalt fiber.' },
];

const faqs = [
  { question: 'Hva er makronæringsstoffer?', answer: 'Protein, karbohydrater og fett. De gir energi: 4 kcal per gram protein og karbohydrater og 9 kcal per gram fett.' },
  { question: 'Hvor mye protein trenger jeg?', answer: 'De nordiske anbefalingene for voksne ligger på 10–20 % av energien. Aktive og de som vil bygge muskler kan ligge høyere.' },
  { question: 'Er keto og lavkarbo anbefalt?', answer: 'Slike dietter passer ikke for alle. Snakk med lege eller klinisk ernæringsfysiolog ved sykdom eller langvarig bruk.' },
  { question: 'Hva er anbefalt mengde fiber?', answer: 'Helsemyndighetene anbefaler minst 25–35 gram kostfiber per dag for voksne.' },
];

const relatedTools = [
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
];

export default function MacroCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="macro-calculator"
          title="Makrokalkulator"
          description="Regn ut hvor mye protein, karbohydrater og fett du bør spise per dag ut fra kaloribehov og mål. Gratis og uten registrering."
        />

        <section aria-label="Makrokalkulator">
          <MacroCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
