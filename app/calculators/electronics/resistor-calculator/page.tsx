import { Metadata } from 'next';
import { ResistorCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Motstand: fargekode – gratis kalkulator på nett',
  description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd). Gratis og uten registrering.',
  keywords: ['motstand', 'fargekode', 'ohm', 'elektronikk', 'fargebånd'],
  alternates: { canonical: '/calculators/electronics/resistor-calculator' },
  openGraph: {
    title: 'Motstand: fargekode',
    description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)',
    url: '/calculators/electronics/resistor-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Motstand: fargekode',
  description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg antall bånd', text: '4 bånd er vanligst, 5 bånd brukes for presisjonsmotstander.' },
  { name: 'Velg fargene', text: 'Velg fargen på hvert bånd, fra venstre mot høyre.' },
  { name: 'Les av verdien', text: 'Se motstanden i ohm, toleransen og minste og største verdi.' },
];

const faqs = [
  { question: 'Hvilket bånd er det første?', answer: 'Det første båndet er det som ligger nærmest enden av motstanden. Tolerans- og multiplikatorbåndet ligger gjerne litt unna de andre.' },
  { question: 'Hva betyr gull og sølv?', answer: 'Som toleranse betyr gull ±5 % og sølv ±10 %. Som multiplikator betyr de ×0,1 og ×0,01.' },
  { question: 'Hva er forskjellen på 4 og 5 bånd?', answer: '4 bånd har to gjeldende siffer, multiplikator og toleranse. 5 bånd har tre siffer, og gir derfor mer presise verdier.' },
  { question: 'Hvordan kan jeg kontrollere verdien?', answer: 'Mål motstanden med et multimeter, uten at den sitter i en krets.' },
];

const relatedTools = [
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/voltage-divider', title: 'Spenningsdeler', description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier' },
  { href: '/calculators/electronics/led-resistor', title: 'LED-motstand', description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger' },
];

export default function ResistorCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="resistor-calculator"
          title="Motstand: fargekode"
          description="Regn ut motstandsverdi og toleranse fra fargebåndene på motstander med 4 eller 5 bånd. Gratis og uten registrering."
        />

        <section aria-label="Motstand: fargekode">
          <ResistorCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
