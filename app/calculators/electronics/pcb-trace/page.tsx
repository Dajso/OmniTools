import { Metadata } from 'next';
import { PCBTraceCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sporbredde på kretskort – gratis kalkulator på nett',
  description: 'Regn ut minste sporbredde for en gitt strøm etter IPC-2221. Gratis og uten registrering.',
  keywords: ['kretskort', 'sporbredde', 'PCB', 'IPC-2221', 'kobber'],
  alternates: { canonical: '/calculators/electronics/pcb-trace' },
  openGraph: {
    title: 'Sporbredde på kretskort',
    description: 'Regn ut minste sporbredde for en gitt strøm etter IPC-2221',
    url: '/calculators/electronics/pcb-trace',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sporbredde på kretskort',
  description: 'Regn ut minste sporbredde for en gitt strøm etter IPC-2221',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn strømmen', text: 'Strømmen i ampere som sporet skal føre.' },
  { name: 'Velg kobbertykkelse', text: '35 µm (1 oz/ft²) er vanligst.' },
  { name: 'Velg temperaturøkning og lagtype', text: 'Tillatt oppvarming i °C og om sporet ligger ytterst eller innerst.' },
  { name: 'Les av sporbredden', text: 'Se bredde i mm, motstand, spenningsfall og effekttap.' },
];

const faqs = [
  { question: 'Hva er IPC-2221?', answer: 'En bransjestandard for utforming av kretskort. Den gir formler for hvor mye strøm et spor tåler.' },
  { question: 'Hvorfor trenger ytre og indre lag ulik bredde?', answer: 'Ytre lag avgir varme lettere til luften, så de tåler mer strøm enn indre lag.' },
  { question: 'Hva betyr oz/ft²?', answer: 'Kobbertykkelsen oppgis i unser per kvadratfot. 1 oz/ft² tilsvarer 35 µm.' },
  { question: 'Kan jeg stole på resultatet?', answer: 'Det er et utgangspunkt. Legg inn sikkerhetsmargin, spesielt for høy strøm, og sjekk kravene hos kretskortprodusenten.' },
];

const relatedTools = [
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/awg-converter', title: 'AWG til mm²', description: 'Regn om fra AWG til millimeter og mm² med motstand per lengde' },
  { href: '/calculators/electronics/heat-sink', title: 'Kjøleribbe', description: 'Regn ut nødvendig termisk motstand for kjøleribbe' },
];

export default function PCBTracePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pcb-trace"
          title="Sporbredde på kretskort"
          description="Regn ut minste sporbredde på kretskort for en gitt strøm etter IPC-2221, med motstand, spenningsfall og effekttap. Mål i mm. Gratis og uten registrering."
        />

        <section aria-label="Sporbredde på kretskort">
          <PCBTraceCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
