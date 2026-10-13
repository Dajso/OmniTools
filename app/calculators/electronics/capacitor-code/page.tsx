import { Metadata } from 'next';
import { CapacitorCodeConverter } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kondensatorkode – gratis kalkulator på nett',
  description: 'Gjør om kondensatorkoder (som 104) til pF, nF og µF. Gratis og uten registrering.',
  keywords: ['kondensator', 'kondensatorkode', '104', 'pF nF uF'],
  alternates: { canonical: '/calculators/electronics/capacitor-code' },
  openGraph: {
    title: 'Kondensatorkode',
    description: 'Gjør om kondensatorkoder (som 104) til pF, nF og µF',
    url: '/calculators/electronics/capacitor-code',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kondensatorkode',
  description: 'Gjør om kondensatorkoder (som 104) til pF, nF og µF',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Les koden', text: 'Finn tre sifre på kondensatoren, for eksempel 104.' },
  { name: 'Skriv den inn', text: 'Legg inn koden, og eventuelt bokstaven for toleranse.' },
  { name: 'Les av verdien', text: 'Se kapasitansen i pF, nF og µF.' },
];

const faqs = [
  { question: 'Hvordan leser jeg koden?', answer: 'De to første sifrene er verdien, og det tredje er antall nuller. 104 betyr 10 etterfulgt av 4 nuller = 100 000 pF = 100 nF.' },
  { question: 'Hva betyr bokstaven etter tallet?', answer: 'Den viser toleransen: J er ±5 %, K er ±10 % og M er ±20 %.' },
  { question: 'Hva er forskjellen på pF, nF og µF?', answer: '1000 pF = 1 nF og 1000 nF = 1 µF.' },
];

const relatedTools = [
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
  { href: '/calculators/electronics/555-timer', title: '555-timer', description: 'Regn ut frekvens og tider for 555-kretser, astabil og monostabil' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
];

export default function CapacitorCodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="capacitor-code"
          title="Kondensatorkode"
          description="Regn om tresifrede kondensatorkoder som 104 til pF, nF og µF. Gratis og uten registrering."
        />

        <section aria-label="Kondensatorkode">
          <CapacitorCodeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
