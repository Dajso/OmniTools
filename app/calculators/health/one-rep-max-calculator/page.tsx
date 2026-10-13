import { Metadata } from 'next';
import { OneRepMaxCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Maks én repetisjon (1RM) – gratis kalkulator på nett',
  description: 'Beregn maksløftet ditt i styrketrening. Gratis og uten registrering.',
  keywords: ['1RM', 'maks løft', 'styrketrening', 'repetisjoner', 'benkpress'],
  alternates: { canonical: '/calculators/health/one-rep-max-calculator' },
  openGraph: {
    title: 'Maks én repetisjon (1RM)',
    description: 'Beregn maksløftet ditt i styrketrening',
    url: '/calculators/health/one-rep-max-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Maks én repetisjon (1RM)',
  description: 'Beregn maksløftet ditt i styrketrening',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn vekten', text: 'Hvor tung vekt du løftet, i kilo.' },
  { name: 'Skriv inn repetisjoner', text: 'Hvor mange repetisjoner du klarte.' },
  { name: 'Les resultatet', text: 'Se anslått 1RM med flere formler og treningsvekter i prosent.' },
];

const faqs = [
  { question: 'Hva er 1RM?', answer: 'Den tyngste vekten du klarer å løfte én gang med god teknikk.' },
  { question: 'Hvor nøyaktig er formlene?', answer: 'Beregningene er mest treffsikre med 2–10 repetisjoner. Over 10 repetisjoner blir anslaget mer usikkert.' },
  { question: 'Er det trygt å teste 1RM?', answer: 'Teste maks løft krever god oppvarming, god teknikk og gjerne en trygg spotter.' },
  { question: 'Hvilke formler brukes?', answer: 'Brzycki, Epley og Lander. Kalkulatoren viser snittet.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
];

export default function OneRepMaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="one-rep-max-calculator"
          title="Maks én repetisjon (1RM)"
          description="Anslå maksimal vekt du kan løfte én gang (1RM) ut fra et sett med flere repetisjoner. Gratis og uten registrering."
        />

        <section aria-label="Maks én repetisjon (1RM)">
          <OneRepMaxCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
