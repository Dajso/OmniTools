import { Metadata } from 'next';
import { PoolVolumeCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bassengvolum – gratis kalkulator på nett',
  description: 'Beregn vannvolumet i et basseng i m³ og liter. Gratis og uten registrering.',
  keywords: ['basseng', 'bassengvolum', 'vannmengde', 'kubikkmeter'],
  alternates: { canonical: '/calculators/home/pool-volume-calculator' },
  openGraph: {
    title: 'Bassengvolum',
    description: 'Beregn vannvolumet i et basseng i m³ og liter',
    url: '/calculators/home/pool-volume-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bassengvolum',
  description: 'Beregn vannvolumet i et basseng i m³ og liter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg form', text: 'Rektangulært, rundt, ovalt eller nyreformet.' },
  { name: 'Skriv inn målene', text: 'Lengde og bredde (eller diameter for rundt) i meter.' },
  { name: 'Oppgi dybde', text: 'Grunneste og dypeste dybde i meter.' },
  { name: 'Les resultatet', text: 'Se volum i liter og kubikkmeter.' },
];

const faqs = [
  { question: 'Hvor mange liter er en kubikkmeter?', answer: '1 m³ er 1 000 liter.' },
  { question: 'Hvorfor trenger jeg vannvolumet?', answer: 'For å dosere riktig mengde klor og kjemikalier, velge pumpe og varmeanlegg, og anslå fylletid.' },
  { question: 'Hvordan regnes nyreformet basseng?', answer: 'Overflatearealet anslås som 45 % av lengde × bredde. Resultatet er et anslag.' },
  { question: 'Hva er gjennomsnittsdybde?', answer: 'Snittet av grunneste og dypeste punkt, brukt for bassenger med jevnt skrånende bunn.' },
];

const relatedTools = [
  { href: '/calculators/home/concrete-calculator', title: 'Betongkalkulator', description: 'Beregn hvor mye betong du trenger i m³ og antall sekker' },
];

export default function PoolVolumeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pool-volume-calculator"
          title="Bassengvolum"
          description="Regn ut hvor mange liter vann det er i et basseng eller en badestamp, for rektangulære, runde, ovale og nyreformede former. Gratis og uten registrering."
        />

        <section aria-label="Bassengvolum">
          <PoolVolumeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
