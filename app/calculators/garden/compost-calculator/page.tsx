import { Metadata } from 'next';
import { CompostCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kompost (C:N-forhold) – gratis kalkulator på nett',
  description: 'Regn ut karbon–nitrogen-forholdet i komposten. Gratis og uten registrering.',
  keywords: ['kompost', 'C:N', 'karbon nitrogen', 'kompostering', 'hagekompost'],
  alternates: { canonical: '/calculators/garden/compost-calculator' },
  openGraph: {
    title: 'Kompost (C:N-forhold)',
    description: 'Regn ut karbon–nitrogen-forholdet i komposten',
    url: '/calculators/garden/compost-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kompost (C:N-forhold)',
  description: 'Regn ut karbon–nitrogen-forholdet i komposten',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg til materialer', text: 'Velg gressklipp, løv, matavfall, flis osv.' },
  { name: 'Oppgi mengdene', text: 'Bruk deler, bøtter eller trillebårlass – forholdet er det som teller.' },
  { name: 'Se C:N-forholdet', text: 'Kalkulatoren viser forholdet og om det ligger i det ideelle området.' },
  { name: 'Juster blandingen', text: 'Følg forslaget om å tilsette mer grønt eller brunt materiale.' },
];

const faqs = [
  { question: 'Hva er det ideelle C:N-forholdet?', answer: 'Mellom 25:1 og 30:1. Lavere gir lukt og tap av nitrogen, høyere gjør at nedbrytingen går tregt.' },
  { question: 'Hva er grønt og brunt materiale?', answer: 'Grønt er nitrogenrikt og fuktig, som gressklipp og matavfall. Brunt er karbonrikt og tørt, som løv, halm, papp og flis.' },
  { question: 'Hvorfor lukter komposten?', answer: 'Som oftest for mye grønt og for lite luft. Bland inn tørt, brunt materiale og vend komposten.' },
  { question: 'Er tallene eksakte?', answer: 'Nei. C:N-forholdet for hvert materiale varierer, og verdiene i kalkulatoren er typiske gjennomsnitt.' },
];

const relatedTools = [
  { href: '/calculators/garden/fertilizer-calculator', title: 'Gjødsel (N-P-K)', description: 'Regn ut gjødselmengde ut fra N-P-K-forhold til plen eller hage' },
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Jord og barkflis', description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Grønnsakavling', description: 'Anslå avling av grønnsaker ut fra antall planter og sort' },
];

export default function CompostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="compost-calculator"
          title="Kompost (C:N-forhold)"
          description="Regn ut karbon–nitrogen-forholdet (C:N) i komposten og få råd om hva du bør tilsette. Gratis og uten registrering."
        />

        <section aria-label="Kompost (C:N-forhold)">
          <CompostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
