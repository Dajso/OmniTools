import { Metadata } from 'next';
import { DCWireGaugeCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kabeltverrsnitt (DC) – gratis kalkulator på nett',
  description: 'Regn ut riktig kabeltverrsnitt i mm² for likestrøm. Gratis og uten registrering.',
  keywords: ['kabeltverrsnitt', 'mm2', 'spenningsfall', 'solcelle', 'likestrøm', 'DC'],
  alternates: { canonical: '/calculators/solar/dc-wire-gauge-calculator' },
  openGraph: {
    title: 'Kabeltverrsnitt (DC)',
    description: 'Regn ut riktig kabeltverrsnitt i mm² for likestrøm',
    url: '/calculators/solar/dc-wire-gauge-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kabeltverrsnitt (DC)',
  description: 'Regn ut riktig kabeltverrsnitt i mm² for likestrøm',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn strømmen', text: 'Oppgi strømmen i ampere som kabelen skal bære.' },
  { name: 'Skriv inn lengden', text: 'Oppgi kabellengden én vei i meter. Kalkulatoren regner med både pluss og minus.' },
  { name: 'Velg spenning og tillatt spenningsfall', text: '12 V og 3 % er vanlig. Ved lav spenning blir spenningsfallet raskt stort.' },
  { name: 'Les av tverrsnittet', text: 'Du får anbefalt tverrsnitt, spenningsfall og effekttap.' },
];

const faqs = [
  { question: 'Hva er tillatt spenningsfall?', answer: 'For 12 V-anlegg er 3 % et vanlig mål, mens 5 % er det høyeste en bør akseptere. Mer spenningsfall betyr tap og svakere ytelse.' },
  { question: 'Hvorfor trenger 12 V tykkere kabel enn 230 V?', answer: 'For samme effekt går det mye høyere strøm ved lav spenning, og tap og spenningsfall vokser raskt.' },
  { question: 'Erstatter dette elektriker?', answer: 'Nei. Kalkulatoren gir et anslag. Faste installasjoner bør følge NEK 400 og kontrolleres av en elektriker. Husk riktig sikring.' },
  { question: 'Hvilke kabler bør jeg bruke?', answer: 'Bruk fleksibel kobberkabel som passer for formålet, for eksempel solcellekabel utendørs. Aluminium krever større tverrsnitt.' },
];

const relatedTools = [
  { href: '/calculators/solar/dc-power-calculator', title: 'Ampere og watt (DC)', description: 'Regn om mellom ampere, watt og volt for likestrøm' },
  { href: '/calculators/solar/inverter-size-calculator', title: 'Vekselretter', description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm' },
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
];

export default function DCWireGaugeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dc-wire-gauge-calculator"
          title="Kabeltverrsnitt (DC)"
          description="Finn riktig kabeltverrsnitt i mm² for likestrøm ut fra strøm, lengde og tillatt spenningsfall. Gratis og uten registrering."
        />

        <section aria-label="Kabeltverrsnitt (DC)">
          <DCWireGaugeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
