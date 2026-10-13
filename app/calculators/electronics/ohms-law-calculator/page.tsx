import { Metadata } from 'next';
import { OhmsLawCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ohms lov – gratis kalkulator på nett',
  description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov. Gratis og uten registrering.',
  keywords: ['ohms lov', 'spenning', 'strøm', 'motstand', 'effekt', 'V=IR'],
  alternates: { canonical: '/calculators/electronics/ohms-law-calculator' },
  openGraph: {
    title: 'Ohms lov',
    description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov',
    url: '/calculators/electronics/ohms-law-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ohms lov',
  description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn to verdier', text: 'For eksempel spenning og motstand.' },
  { name: 'Les av resultatet', text: 'De andre verdiene regnes ut automatisk.' },
  { name: 'Sjekk formlene', text: 'Formlene vises under kalkulatoren.' },
];

const faqs = [
  { question: 'Hva er Ohms lov?', answer: 'Sammenhengen mellom spenning, strøm og motstand: U = R × I. Effekten er P = U × I.' },
  { question: 'Hvilke enheter brukes?', answer: 'Volt (V) for spenning, ampere (A) for strøm, ohm (Ω) for motstand og watt (W) for effekt.' },
  { question: 'Hvorfor står det V i stedet for U?', answer: 'I Norge brukes ofte U for spenning i formler, men symbolet på enheten er alltid V. Kalkulatoren bruker V i feltene.' },
  { question: 'Gjelder Ohms lov for alle komponenter?', answer: 'Nei, bare for ohmske komponenter som motstander. Dioder og LED-er har ikke et fast forhold mellom spenning og strøm.' },
];

const relatedTools = [
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
  { href: '/calculators/electronics/voltage-divider', title: 'Spenningsdeler', description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier' },
  { href: '/calculators/electronics/led-resistor', title: 'LED-motstand', description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger' },
];

export default function OhmsLawCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ohms-law-calculator"
          title="Ohms lov"
          description="Regn ut spenning, strøm, motstand og effekt med Ohms lov. Fyll inn to verdier og få de andre. Gratis og uten registrering."
        />

        <section aria-label="Ohms lov">
          <OhmsLawCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
