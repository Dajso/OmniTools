import { Metadata } from 'next';
import { BTUCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Varmepumpekalkulator – gratis kalkulator på nett',
  description: 'Anslå hvor stor varmepumpe (kW) rommet trenger til oppvarming og kjøling. Gratis og uten registrering.',
  keywords: ['varmepumpe', 'effektbehov', 'kW', 'kjøling', 'oppvarming', 'klimaanlegg'],
  alternates: { canonical: '/calculators/home/btu-calculator' },
  openGraph: {
    title: 'Varmepumpekalkulator',
    description: 'Anslå hvor stor varmepumpe (kW) rommet trenger til oppvarming og kjøling',
    url: '/calculators/home/btu-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Varmepumpekalkulator',
  description: 'Anslå hvor stor varmepumpe (kW) rommet trenger til oppvarming og kjøling',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Oppgi lengde, bredde og takhøyde i meter.' },
  { name: 'Velg isolasjon og klima', text: 'Isolasjonsstandarden og hvor kaldt det er der du bor avgjør effektbehovet.' },
  { name: 'Legg inn forhold som påvirker kjøling', text: 'Antall personer, mye sol og om rommet er et kjøkken gir høyere kjølebehov.' },
  { name: 'Les anbefalingen', text: 'Se behov for oppvarming og kjøling, og anbefalt størrelse på varmepumpen.' },
];

const faqs = [
  { question: 'Hvor stor varmepumpe trenger jeg?', answer: 'Det avhenger av areal, isolasjon og klima. En middels bolig trenger ofte 3,5–7 kW varmeeffekt for et åpent oppholdsrom. Kalkulatoren gir et grovt anslag. En installatør kan dimensjonere nøyaktig.' },
  { question: 'Er det bedre med for stor eller for liten varmepumpe?', answer: 'En svært overdimensjonert pumpe starter og stopper ofte og gir dårligere komfort. En for liten pumpe får ikke opp temperaturen i kulden. Velg størrelse nær anslaget.' },
  { question: 'Hva betyr kW på varmepumper?', answer: 'Det er effekten pumpen kan levere. Luft-til-luft-pumper oppgir ofte nominell effekt ved 7 °C ute. Ved minusgrader faller effekten.' },
  { question: 'Er dette det samme som BTU?', answer: 'BTU er en amerikansk enhet. 1 kW er cirka 3 412 BTU per time. I Norge oppgis varmepumper vanligvis i kW.' },
];

const relatedTools = [
  { href: '/calculators/home/electricity-cost-calculator', title: 'Strømkostnad', description: 'Regn ut hva det koster å bruke elektriske apparater, med strømpris i øre per kWh' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function BTUCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="btu-calculator"
          title="Varmepumpekalkulator"
          description="Anslå hvor stor varmepumpe i kW du trenger til et rom, for både oppvarming og kjøling. Gratis og uten registrering."
        />

        <section aria-label="Varmepumpekalkulator">
          <BTUCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
