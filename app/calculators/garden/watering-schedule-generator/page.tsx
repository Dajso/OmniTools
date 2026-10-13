import { Metadata } from 'next';
import { WateringScheduleGenerator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vanningsplan – gratis kalkulator på nett',
  description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong. Gratis og uten registrering.',
  keywords: ['vanningsplan', 'vanning', 'plantestell', 'vanningshyppighet'],
  alternates: { canonical: '/calculators/garden/watering-schedule-generator' },
  openGraph: {
    title: 'Vanningsplan',
    description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong',
    url: '/calculators/garden/watering-schedule-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vanningsplan',
  description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg plantetype', text: 'Grønnsaker, blomster, stauder, urter, plen, trær eller stueplanter.' },
  { name: 'Velg dyrkingssted', text: 'Åpent bed, høybed, potte eller hengende potte.' },
  { name: 'Velg jord og sol', text: 'Sandjord tørker raskere ut enn leire, og full sol gir mer fordamping.' },
  { name: 'Les av planen', text: 'Se hvor ofte du bør vanne, hvor mye og hvilke dager.' },
];

const faqs = [
  { question: 'Hvor mye vann trenger hagen?', answer: 'Som en tommelfinger-regel 10–20 mm i uka, tilsvarende 10–20 liter per m², medregnet regn. Potter vannes til vannet renner ut i bunnen.' },
  { question: 'Når på dagen bør jeg vanne?', answer: 'Tidlig om morgenen er best. Da har plantene vann gjennom den varmeste delen av dagen, og mindre vann fordamper.' },
  { question: 'Hvordan vet jeg om det er tørt nok?', answer: 'Stikk en finger 3–5 cm ned i jorda. Er den tørr, er det tid for å vanne.' },
  { question: 'Er planen nøyaktig?', answer: 'Nei, den er veiledende. Regn, vind og temperatur endrer behovet. Ta hensyn til været og kjenn alltid etter i jorda.' },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Grønnsakavling', description: 'Anslå avling av grønnsaker ut fra antall planter og sort' },
  { href: '/calculators/garden/sun-shade-mapper', title: 'Sol og skygge i hagen', description: 'Kartlegg sol og skygge i hagen gjennom dagen' },
];

export default function WateringScheduleGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="watering-schedule-generator"
          title="Vanningsplan"
          description="Lag en vanningsplan tilpasset plantene, jorda, solforholdene og årstiden. Gratis og uten registrering."
        />

        <section aria-label="Vanningsplan">
          <WateringScheduleGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
