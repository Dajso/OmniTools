import { Metadata } from 'next';
import { VoltageDividerCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Spenningsdeler – gratis kalkulator på nett',
  description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier. Gratis og uten registrering.',
  keywords: ['spenningsdeler', 'motstandsnett', 'elektronikk', 'spenningsfall'],
  alternates: { canonical: '/calculators/electronics/voltage-divider' },
  openGraph: {
    title: 'Spenningsdeler',
    description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier',
    url: '/calculators/electronics/voltage-divider',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Spenningsdeler',
  description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn inngangsspenningen', text: 'Spenningen over hele spenningsdeleren, i volt.' },
  { name: 'Legg inn R1 og R2', text: 'Motstandene i ohm, med R1 mot pluss og R2 mot jord.' },
  { name: 'Les av resultatet', text: 'Se utgangsspenning, delingsforhold, strøm og effekt.' },
];

const faqs = [
  { question: 'Hvordan fungerer en spenningsdeler?', answer: 'To motstander i serie fordeler spenningen. Utgangsspenningen tas mellom dem og er Vut = Vinn × R2 ÷ (R1 + R2).' },
  { question: 'Kan jeg bruke en spenningsdeler som strømforsyning?', answer: 'Nei, den tåler bare svært liten belastning. Belastningen er parallell med R2 og endrer spenningen. Bruk en spenningsregulator til å forsyne kretser.' },
  { question: 'Hvilke motstandsverdier bør jeg velge?', answer: 'Velg verdier som gir lav nok strøm, men som likevel er mye mindre enn motstanden til det du kobler til. 10 kΩ er vanlig.' },
];

const relatedTools = [
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/led-resistor', title: 'LED-motstand', description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger' },
];

export default function VoltageDividerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="voltage-divider"
          title="Spenningsdeler"
          description="Regn ut utgangsspenningen til en spenningsdeler med to motstander, og se strøm og effekt i hver motstand. Gratis og uten registrering."
        />

        <section aria-label="Spenningsdeler">
          <VoltageDividerCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
