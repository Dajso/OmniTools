import { Metadata } from 'next';
import { SolarPanelTiltCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Solcellevinkel – gratis kalkulator på nett',
  description: 'Regn ut optimal helningsvinkel for solcellepaneler i Norge. Gratis og uten registrering.',
  keywords: ['solcellevinkel', 'panelvinkel', 'helning', 'breddegrad', 'optimalisering'],
  alternates: { canonical: '/calculators/solar/solar-panel-tilt-calculator' },
  openGraph: {
    title: 'Solcellevinkel',
    description: 'Regn ut optimal helningsvinkel for solcellepaneler i Norge',
    url: '/calculators/solar/solar-panel-tilt-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solcellevinkel',
  description: 'Regn ut optimal helningsvinkel for solcellepaneler i Norge',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn breddegrad', text: 'Oslo ligger på ca. 59,9° N, Bergen på 60,4°, Trondheim på 63,4° og Tromsø på 69,6°.' },
  { name: 'Velg hva du optimaliserer for', text: 'Velg hele året, sommer, vinter eller vår og høst.' },
  { name: 'Les av vinkelen', text: 'Du får anbefalt helning fra vannrett og hvilken retning panelene bør vende.' },
  { name: 'Tilpass til taket', text: 'Ofte styrer takvinkelen valget. Avvik på 10–15° gir bare et lite tap over året.' },
];

const faqs = [
  { question: 'Hvilken vinkel er best i Norge?', answer: 'Over hele året ligger den beste vinkelen som regel mellom 40° og 50° for Sør-Norge. En litt brattere vinkel gir mer om vinteren og lar snøen gli lettere av.' },
  { question: 'Må panelene vende rett mot sør?', answer: 'Rett sør gir mest, men sørøst og sørvest taper bare noen få prosent. Øst–vest-løsninger gir jevnere produksjon gjennom dagen og er vanlig på flate tak.' },
  { question: 'Hvorfor bør panelene stå brattere om vinteren?', answer: 'Sola står lavt, så brattere paneler møter strålene mer direkte. Snø glir også lettere av.' },
  { question: 'Lønner det seg å justere vinkelen gjennom året?', answer: 'Sjelden. Gevinsten er liten sammenlignet med bryderiet, så de fleste fester panelene i én fast vinkel.' },
];

const relatedTools = [
  { href: '/calculators/solar/sun-peak-hours-calculator', title: 'Fullasttimer for sol', description: 'Slå opp solinnstråling og effektive soltimer for stedet ditt' },
  { href: '/calculators/solar/solar-roi-calculator', title: 'Lønnsomhet for solceller', description: 'Regn ut tilbakebetalingstid og avkastning for et solcelleanlegg i kroner' },
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
];

export default function SolarPanelTiltCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="solar-panel-tilt-calculator"
          title="Solcellevinkel"
          description="Finn beste helningsvinkel for solcellepaneler ut fra breddegrad og årstid. Tall for Oslo, Bergen, Trondheim og Tromsø. Gratis og uten registrering."
        />

        <section aria-label="Solcellevinkel">
          <SolarPanelTiltCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
