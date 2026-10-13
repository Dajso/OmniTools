import { Metadata } from 'next';
import { KineticEnergyCalculator } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bevegelsesenergi – gratis kalkulator på nett',
  description: 'Regn ut bevegelsesenergi med E = ½mv². Gratis og uten registrering.',
  keywords: ['bevegelsesenergi', 'kinetisk energi', 'fysikk', 'fart og masse'],
  alternates: { canonical: '/calculators/physics/kinetic-energy-calculator' },
  openGraph: {
    title: 'Bevegelsesenergi',
    description: 'Regn ut bevegelsesenergi med E = ½mv²',
    url: '/calculators/physics/kinetic-energy-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bevegelsesenergi',
  description: 'Regn ut bevegelsesenergi med E = ½mv²',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn to verdier', text: 'Oppgi to av energi (J), masse (kg) og hastighet (m/s).' },
  { name: 'Les den tredje verdien', text: 'Den utregnede verdien utheves.' },
  { name: 'Se andre enheter', text: 'Energien vises også i kWh, kalorier og BTU.' },
];

const faqs = [
  { question: 'Hva er formelen for kinetisk energi?', answer: 'KE = ½mv², altså halve massen ganger hastigheten i andre.' },
  { question: 'Hvorfor betyr hastigheten så mye?', answer: 'Hastigheten inngår i andre potens. Dobler du hastigheten, firedobles bevegelsesenergien.' },
  { question: 'Hvordan regner jeg om km/t til m/s?', answer: 'Del på 3,6. 90 km/t er 25 m/s.' },
  { question: 'Hvor mye energi er en joule?', answer: 'Omtrent det som skal til for å løfte en liten sjokolade (100 g) én meter.' },
];

const relatedTools = [
  { href: '/calculators/physics/projectile-motion-calculator', title: 'Skrått kast', description: 'Regn ut bane, maksimal høyde, rekkevidde og flytid for et skrått kast' },
  { href: '/calculators/physics/density-calculator', title: 'Tetthet', description: 'Regn ut tetthet med formelen ρ = m/V' },
];

export default function KineticEnergyCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="kinetic-energy-calculator"
          title="Bevegelsesenergi"
          description="Regn ut bevegelsesenergi, masse eller hastighet fra to kjente verdier, og se energien i joule, kWh og kalorier. Gratis og uten registrering."
        />

        <section aria-label="Bevegelsesenergi">
          <KineticEnergyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
