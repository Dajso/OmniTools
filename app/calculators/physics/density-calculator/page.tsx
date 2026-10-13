import { Metadata } from 'next';
import { DensityCalculator } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tetthet – gratis kalkulator på nett',
  description: 'Regn ut tetthet med formelen ρ = m/V. Gratis og uten registrering.',
  keywords: ['tetthet', 'densitet', 'masse og volum', 'rho'],
  alternates: { canonical: '/calculators/physics/density-calculator' },
  openGraph: {
    title: 'Tetthet',
    description: 'Regn ut tetthet med formelen ρ = m/V',
    url: '/calculators/physics/density-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tetthet',
  description: 'Regn ut tetthet med formelen ρ = m/V',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg et materiale', text: 'Velg et materiale for å fylle inn tettheten, eller skriv inn egne verdier.' },
  { name: 'Fyll inn to verdier', text: 'Oppgi to av tetthet, masse og volum.' },
  { name: 'Les den tredje verdien', text: 'Den utregnede verdien utheves, og du ser om gjenstanden flyter.' },
];

const faqs = [
  { question: 'Hva er formelen for tetthet?', answer: 'ρ = m / V, altså masse delt på volum. Tettheten oppgis i kg/m³.' },
  { question: 'Hva er tettheten til vann?', answer: 'Omtrent 1000 kg/m³, altså 1 kg per liter. Gjenstander med lavere tetthet flyter.' },
  { question: 'Hvordan regner jeg om kg/m³ til g/cm³?', answer: 'Del på 1000. 7850 kg/m³ for stål er 7,85 g/cm³.' },
  { question: 'Hvorfor flyter store skip av stål?', answer: 'Fordi skroget er hult. Skipet som helhet har lavere gjennomsnittlig tetthet enn vann.' },
];

const relatedTools = [
  { href: '/calculators/physics/kinetic-energy-calculator', title: 'Bevegelsesenergi', description: 'Regn ut bevegelsesenergi med E = ½mv²' },
  { href: '/calculators/physics/pressure-converter', title: 'Trykkomregner (fysikk)', description: 'Regn om mellom pascal, bar, PSI, atm og mer' },
];

export default function DensityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="density-calculator"
          title="Tetthet"
          description="Regn ut tetthet, masse eller volum fra to kjente verdier, og se om gjenstanden flyter i vann. Gratis og uten registrering."
        />

        <section aria-label="Tetthet">
          <DensityCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
