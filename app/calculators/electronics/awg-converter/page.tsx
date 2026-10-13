import { Metadata } from 'next';
import { AWGConverter } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'AWG til mm² – gratis kalkulator på nett',
  description: 'Regn om fra AWG til millimeter og mm² med motstand per lengde. Gratis og uten registrering.',
  keywords: ['AWG', 'ledningstverrsnitt', 'mm2', 'kobbertråd', 'kabeltverrsnitt'],
  alternates: { canonical: '/calculators/electronics/awg-converter' },
  openGraph: {
    title: 'AWG til mm²',
    description: 'Regn om fra AWG til millimeter og mm² med motstand per lengde',
    url: '/calculators/electronics/awg-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AWG til mm²',
  description: 'Regn om fra AWG til millimeter og mm² med motstand per lengde',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg AWG-tall', text: 'Tallet står ofte på kabler fra utlandet.' },
  { name: 'Les av tverrsnittet', text: 'Se tverrsnitt i mm² og diameter i mm.' },
  { name: 'Sjekk strømmen', text: 'Se anslått maksimal strøm for apparatledning og kraftoverføring.' },
];

const faqs = [
  { question: 'Hva er AWG?', answer: 'American Wire Gauge, et amerikansk system for trådtykkelse. Høyere tall betyr tynnere tråd.' },
  { question: 'Hva tilsvarer 1,5 mm² og 2,5 mm²?', answer: '1,5 mm² er omtrent AWG 15–16, og 2,5 mm² er omtrent AWG 13. Norske elektriske installasjoner dimensjoneres i mm² etter forskriftene.' },
  { question: 'Kan jeg bruke tabellen til elektriske installasjoner?', answer: 'Nei. Bruk de norske forskriftene og få en registrert elektriker til å utføre arbeid i fast installasjon. Tabellen er for elektronikk og hobby.' },
];

const relatedTools = [
  { href: '/calculators/electronics/pcb-trace', title: 'Sporbredde på kretskort', description: 'Regn ut minste sporbredde for en gitt strøm etter IPC-2221' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
];

export default function AWGConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="awg-converter"
          title="AWG til mm²"
          description="Regn om trådtykkelse i AWG til mm², diameter i mm og motstand i Ω/km. Gratis og uten registrering."
        />

        <section aria-label="AWG til mm²">
          <AWGConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
