import { Metadata } from 'next';
import { PaceCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tempokalkulator – gratis kalkulator på nett',
  description: 'Regn ut løpetempo i min/km og sluttid. Gratis og uten registrering.',
  keywords: ['tempo', 'løpetempo', 'min/km', 'maraton', 'sluttid'],
  alternates: { canonical: '/calculators/health/pace-calculator' },
  openGraph: {
    title: 'Tempokalkulator',
    description: 'Regn ut løpetempo i min/km og sluttid',
    url: '/calculators/health/pace-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tempokalkulator',
  description: 'Regn ut løpetempo i min/km og sluttid',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil regne ut', text: 'Tempo, tid eller distanse.' },
  { name: 'Fyll inn kjente verdier', text: 'For eksempel distanse og tid.' },
  { name: 'Les resultatet', text: 'Se tempo, fart i km/t og mellomtider.' },
];

const faqs = [
  { question: 'Hva er tempo?', answer: 'Hvor lang tid du bruker per kilometer, oppgitt i minutter og sekunder.' },
  { question: 'Hvordan regner jeg om tempo til km/t?', answer: '60 delt på minutter per kilometer. Tempo 5:00 per km er 12 km/t.' },
  { question: 'Hva er et normalt tempo?', answer: 'Nybegynnere løper ofte på 6–7 min/km. Mosjonister ligger gjerne på 4:30–5:30.' },
  { question: 'Kan jeg bruke kalkulatoren til gange?', answer: 'Ja, den fungerer for alt som har en jevn fart.' },
];

const relatedTools = [
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

export default function PaceCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pace-calculator"
          title="Tempokalkulator"
          description="Regn ut løpetempo i min/km, sluttid eller distanse, med mellomtider. Gratis og uten registrering."
        />

        <section aria-label="Tempokalkulator">
          <PaceCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
