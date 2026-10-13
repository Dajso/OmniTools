import { Metadata } from 'next';
import { SolarROICalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lønnsomhet for solceller – gratis kalkulator på nett',
  description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner. Gratis og uten registrering.',
  keywords: ['solceller', 'tilbakebetaling', 'lønnsomhet', 'strømpris', 'investering'],
  alternates: { canonical: '/calculators/solar/solar-roi-calculator' },
  openGraph: {
    title: 'Lønnsomhet for solceller',
    description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner',
    url: '/calculators/solar/solar-roi-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lønnsomhet for solceller',
  description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn kostnaden', text: 'Oppgi totalprisen for anlegget, inkludert montering og eventuell MVA.' },
  { name: 'Skriv inn produksjon og strømpris', text: 'Årsproduksjon i kWh og hva du betaler per kWh. Inkluder nettleie hvis den spares.' },
  { name: 'Fyll inn egenbruk og salgspris', text: 'Hvor mye av strømmen bruker du selv, og hva får du for overskuddet?' },
  { name: 'Legg inn støtte', text: 'Hvis du får støtte (for eksempel fra Enova), trekk den fra. Standard er 0 kr.' },
  { name: 'Les av resultatet', text: 'Du får tilbakebetalingstid, sparte kroner over levetiden og avkastning.' },
];

const faqs = [
  { question: 'Hvor lang er tilbakebetalingstiden for solceller?', answer: 'Det avhenger av pris, egenbruk og strømpris. Ofte rundt 10–20 år i Norge, noe som kan være lenger enn forventet.' },
  { question: 'Hva er egenbruk?', answer: 'Andelen av produksjonen du bruker selv. Egen strøm sparer hele strømprisen inkludert nettleie, mens overskudd selges til lavere pris.' },
  { question: 'Får jeg støtte?', answer: 'Støtteordninger endrer seg. Sjekk Enova og eventuelle kommunale ordninger før du bestemmer deg. Kalkulatoren antar ingen støtte.' },
  { question: 'Er tallene sikre?', answer: 'Nei. Strømpris, produksjon og nedbrytning varierer. Bruk resultatet som et grovt estimat og hent tilbud.' },
];

const relatedTools = [
  { href: '/calculators/solar/sun-peak-hours-calculator', title: 'Fullasttimer for sol', description: 'Slå opp solinnstråling og effektive soltimer for stedet ditt' },
  { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Solcellevinkel', description: 'Regn ut optimal helningsvinkel for solcellepaneler i Norge' },
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
];

export default function SolarROICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="solar-roi-calculator"
          title="Lønnsomhet for solceller"
          description="Regn ut tilbakebetalingstid og avkastning på solceller i kroner, med strømpris, egenbruk, salgspris og støtte. Gratis og uten registrering."
        />

        <section aria-label="Lønnsomhet for solceller">
          <SolarROICalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
