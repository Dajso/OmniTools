import { Metadata } from 'next';
import { SunPeakHoursCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fullasttimer for sol – gratis kalkulator på nett',
  description: 'Slå opp solinnstråling og effektive soltimer for stedet ditt. Gratis og uten registrering.',
  keywords: ['soltimer', 'solinnstråling', 'fullasttimer', 'solenergi', 'produksjon'],
  alternates: { canonical: '/calculators/solar/sun-peak-hours-calculator' },
  openGraph: {
    title: 'Fullasttimer for sol',
    description: 'Slå opp solinnstråling og effektive soltimer for stedet ditt',
    url: '/calculators/solar/sun-peak-hours-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fullasttimer for sol',
  description: 'Slå opp solinnstråling og effektive soltimer for stedet ditt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn breddegrad', text: 'Oslo ligger på ca. 59,9° N, Bergen 60,4°, Trondheim 63,4° og Tromsø 69,6°.' },
  { name: 'Skriv inn panelenes effekt', text: 'Oppgi samlet effekt i watt for å få et anslag på energi (valgfritt).' },
  { name: 'Les av fullasttimer', text: 'Du får årsgjennomsnitt, sommer og vinter per dag.' },
  { name: 'Se energianslaget', text: 'Anslaget tar høyde for 20 % systemtap og vises per dag, måned og år.' },
];

const faqs = [
  { question: 'Hva er en fullasttime?', answer: 'En time med full solinnstråling (1 kW per m²). Fire fullasttimer betyr like mye energi som fire timer sol på sitt sterkeste.' },
  { question: 'Hvor mye gir solceller i Norge?', answer: 'I Sør-Norge ligger årsproduksjonen ofte rundt 800–1000 kWh per kWp. Det aller meste kommer fra april til september.' },
  { question: 'Hvorfor er vinteren så svak?', answer: 'Sola står lavt og dagene er korte. I mørketida nord for polarsirkelen er produksjonen nær null.' },
  { question: 'Hva er systemtap?', answer: 'Tap i kabler, vekselretter, varme og skitt på panelene. Kalkulatoren bruker 20 %.' },
];

const relatedTools = [
  { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Solcellevinkel', description: 'Regn ut optimal helningsvinkel for solcellepaneler i Norge' },
  { href: '/calculators/solar/solar-roi-calculator', title: 'Lønnsomhet for solceller', description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner' },
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
];

export default function SunPeakHoursCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sun-peak-hours-calculator"
          title="Fullasttimer for sol"
          description="Slå opp hvor mange effektive soltimer (fullasttimer) du kan regne med i Norge og hvor mye energi solcellepaneler gir. Gratis og uten registrering."
        />

        <section aria-label="Fullasttimer for sol">
          <SunPeakHoursCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
