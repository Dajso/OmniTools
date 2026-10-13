import { Metadata } from 'next';
import { SleepCycleCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Søvnsyklus-kalkulator – gratis kalkulator på nett',
  description: 'Finn de beste tidspunktene for leggetid og oppvåkning ut fra søvnsykluser. Gratis og uten registrering.',
  keywords: ['søvn', 'søvnsyklus', 'leggetid', 'våkne', 'søvnkalkulator'],
  alternates: { canonical: '/calculators/health/sleep-cycle-calculator' },
  openGraph: {
    title: 'Søvnsyklus-kalkulator',
    description: 'Finn de beste tidspunktene for leggetid og oppvåkning ut fra søvnsykluser',
    url: '/calculators/health/sleep-cycle-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Søvnsyklus-kalkulator',
  description: 'Finn de beste tidspunktene for leggetid og oppvåkning ut fra søvnsykluser',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil regne ut', text: 'Når du må våkne, eller når du legger deg.' },
  { name: 'Sett klokkeslett', text: 'Oppgi tidspunktet.' },
  { name: 'Les forslagene', text: 'Se tidspunkter som gir hele søvnsykluser.' },
];

const faqs = [
  { question: 'Hva er en søvnsyklus?', answer: 'Et mønster av lett søvn, dyp søvn og drømmesøvn som varer ca. 90 minutter.' },
  { question: 'Hvor mye søvn trenger jeg?', answer: 'De fleste voksne trenger 7–9 timer.' },
  { question: 'Hvorfor våkne mellom sykluser?', answer: 'Man våkner ofte lettere og kjenner seg mer uthvilt.' },
  { question: 'Er dette en eksakt vitenskap?', answer: 'Nei. Syklusene varierer fra 70 til 120 minutter. Resultatene er veiledende.' },
];

const relatedTools = [
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

export default function SleepCycleCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sleep-cycle-calculator"
          title="Søvnsyklus-kalkulator"
          description="Finn de beste tidspunktene å legge seg eller våkne ut fra søvnsykluser på 90 minutter. Gratis og uten registrering."
        />

        <section aria-label="Søvnsyklus-kalkulator">
          <SleepCycleCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
