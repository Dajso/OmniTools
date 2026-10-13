import { Metadata } from 'next';
import { Timer555Calculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: '555-timer – gratis kalkulator på nett',
  description: 'Regn ut frekvens og tider for 555-kretser, astabil og monostabil. Gratis og uten registrering.',
  keywords: ['555', 'astabil', 'monostabil', 'oscillator', 'tidsforsinkelse'],
  alternates: { canonical: '/calculators/electronics/555-timer' },
  openGraph: {
    title: '555-timer',
    description: 'Regn ut frekvens og tider for 555-kretser, astabil og monostabil',
    url: '/calculators/electronics/555-timer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '555-timer',
  description: 'Regn ut frekvens og tider for 555-kretser, astabil og monostabil',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg modus', text: 'Astabil gir en kontinuerlig firkantpuls, monostabil gir en enkelt puls.' },
  { name: 'Legg inn motstander og kondensator', text: 'Verdiene i ohm og farad.' },
  { name: 'Les av resultatet', text: 'Se frekvens, periode, tider og driftsandel.' },
];

const faqs = [
  { question: 'Hva er en 555-timer?', answer: 'En kjent integrert krets som lager pulser og tidsforsinkelser, brukt i alt fra blinkende lys til enkle tidsbrytere.' },
  { question: 'Hva er forskjellen på astabil og monostabil?', answer: 'Astabil svinger hele tiden. Monostabil gir én puls av bestemt lengde hver gang den utløses.' },
  { question: 'Hvorfor kan driftsandelen ikke være under 50 %?', answer: 'I den vanlige astabile koblingen er tiden høy alltid lengre enn tiden lav. Det finnes triks med diode for å komme under.' },
];

const relatedTools = [
  { href: '/calculators/electronics/capacitor-code', title: 'Kondensatorkode', description: 'Gjør om kondensatorkoder (som 104) til pF, nF og µF' },
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
];

export default function Timer555Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="555-timer"
          title="555-timer"
          description="Regn ut frekvens, periode, driftsandel og pulslengde for 555-timer i astabil og monostabil modus. Gratis og uten registrering."
        />

        <section aria-label="555-timer">
          <Timer555Calculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
