import { Metadata } from 'next';
import { HeatSinkCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kjøleribbe – gratis kalkulator på nett',
  description: 'Regn ut nødvendig termisk motstand for kjøleribbe. Gratis og uten registrering.',
  keywords: ['kjøleribbe', 'termisk motstand', 'kjøling', 'junction-temperatur'],
  alternates: { canonical: '/calculators/electronics/heat-sink' },
  openGraph: {
    title: 'Kjøleribbe',
    description: 'Regn ut nødvendig termisk motstand for kjøleribbe',
    url: '/calculators/electronics/heat-sink',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kjøleribbe',
  description: 'Regn ut nødvendig termisk motstand for kjøleribbe',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn effekten', text: 'Effekten komponenten avgir som varme, i watt.' },
  { name: 'Legg inn temperaturene', text: 'Maksimal temperatur i komponenten og omgivelsestemperatur.' },
  { name: 'Legg inn termiske motstander', text: 'Rjc fra databladet og Rcs for overgangen mot kjøleribben.' },
  { name: 'Les av resultatet', text: 'Se nødvendig termisk motstand og temperaturer.' },
];

const faqs = [
  { question: 'Hva er termisk motstand?', answer: 'Hvor mye temperaturen stiger per watt, oppgitt i °C/W. Lavere verdi betyr bedre kjøling.' },
  { question: 'Hvorfor trenger jeg varmepasta?', answer: 'Pasta fyller små luftlommer mellom komponent og kjøleribbe og senker overgangsmotstanden Rcs.' },
  { question: 'Hvor stor sikkerhetsmargin bør jeg ha?', answer: 'Vel 20–30 °C under maksimal temperatur er et godt utgangspunkt, og i varme omgivelser trenger du mer.' },
];

const relatedTools = [
  { href: '/calculators/electronics/battery-life', title: 'Batterilevetid', description: 'Regn ut hvor lenge et batteri varer ut fra kapasitet og strømforbruk' },
  { href: '/calculators/electronics/pcb-trace', title: 'Sporbredde på kretskort', description: 'Regn ut minste sporbredde for en gitt strøm etter IPC-2221' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
];

export default function HeatSinkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="heat-sink"
          title="Kjøleribbe"
          description="Regn ut hvor lav termisk motstand en kjøleribbe må ha for å holde en komponent kjølig nok. Gratis og uten registrering."
        />

        <section aria-label="Kjøleribbe">
          <HeatSinkCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
