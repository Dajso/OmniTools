import { Metadata } from 'next';
import { GradientGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'CSS-gradientgenerator – gratis kalkulator på nett',
  description: 'Lag lineære og radiale CSS-gradienter med forhåndsvisning. Gratis og uten registrering.',
  keywords: ['gradient', 'CSS-gradient', 'lineær gradient', 'radial gradient'],
  alternates: { canonical: '/calculators/productivity/gradient-generator' },
  openGraph: {
    title: 'CSS-gradientgenerator',
    description: 'Lag lineære og radiale CSS-gradienter med forhåndsvisning',
    url: '/calculators/productivity/gradient-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSS-gradientgenerator',
  description: 'Lag lineære og radiale CSS-gradienter med forhåndsvisning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg type', text: 'Lineær eller radiell.' },
  { name: 'Velg farger', text: 'Legg til fargestopp og juster posisjon.' },
  { name: 'Juster vinkel eller posisjon', text: 'Dra i glidebryteren for å endre retningen.' },
  { name: 'Kopier koden', text: 'Kopier CSS-koden og lim den inn i stilarket.' },
];

const faqs = [
  { question: 'Hva er forskjellen på lineær og radiell?', answer: 'Lineære går i en rett linje, radielle går ut fra et punkt.' },
  { question: 'Hvor mange farger kan jeg bruke?', answer: 'Så mange du vil, men to eller tre gir som regel best resultat.' },
  { question: 'Fungerer gradienter i alle nettlesere?', answer: 'Ja, i alle moderne nettlesere.' },
  { question: 'Hvordan unngår jeg «bånd» i gradienten?', answer: 'Bruk farger som ligger nær hverandre, og vurder litt støy eller et mønster oppå.' },
];

const relatedTools = [
  { href: '/calculators/productivity/hex-to-rgb', title: 'HEX til RGB', description: 'Gjør om HEX-fargekoder til RGB-verdier' },
  { href: '/calculators/productivity/contrast-checker', title: 'Kontrastsjekker (WCAG)', description: 'Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming' },
];

export default function GradientGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gradient-generator"
          title="CSS-gradientgenerator"
          description="Lag lineære og radiale CSS-gradienter med flere fargestopp, forhåndsvisning og ferdig kode. Gratis og uten registrering."
        />

        <section aria-label="CSS-gradientgenerator">
          <GradientGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
