import { Metadata } from 'next';
import { PlantSpacingCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Plantavstand – gratis kalkulator på nett',
  description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet. Gratis og uten registrering.',
  keywords: ['plantavstand', 'hageplanlegging', 'radavstand', 'grønnsaker'],
  alternates: { canonical: '/calculators/garden/plant-spacing-calculator' },
  openGraph: {
    title: 'Plantavstand',
    description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet',
    url: '/calculators/garden/plant-spacing-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Plantavstand',
  description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi størrelsen på bedet', text: 'Lengde og bredde i meter.' },
  { name: 'Velg plantene', text: 'Velg en grønnsak eller blomst, eller oppgi egen avstand.' },
  { name: 'Velg mønster', text: 'Rader eller forskjøvet mønster som gir flere planter på samme flate.' },
  { name: 'Les av resultatet', text: 'Se antall planter og antall rader.' },
];

const faqs = [
  { question: 'Hvorfor er plantavstand viktig?', answer: 'Planter som står for tett konkurrerer om lys, vann og næring og blir lettere syke. For stor avstand gir mer ugress og dårlig utnyttelse av plassen.' },
  { question: 'Hva er forskjellen på rad og forskjøvet mønster?', answer: 'Rader er enklest å stelle og høste. Forskjøvet mønster (trekantmønster) gir ca. 15 % flere planter på samme areal.' },
  { question: 'Hva er avstand til kant?', answer: 'Plassen du lar stå fri langs bedets kant, så plantene får vokse uten å komme i konflikt med gress, stein eller vegger.' },
  { question: 'Er avstandene faste regler?', answer: 'Nei, de er veiledende. Følg frøpakken eller plantelappen for din sort.' },
];

const relatedTools = [
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Grønnsakavling', description: 'Anslå avling av grønnsaker ut fra antall planter og sort' },
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Jord og barkflis', description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Vanningsplan', description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong' },
];

export default function PlantSpacingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="plant-spacing-calculator"
          title="Plantavstand"
          description="Regn ut plantavstand og hvor mange planter som får plass i bedet, i cm og meter. Gratis og uten registrering."
        />

        <section aria-label="Plantavstand">
          <PlantSpacingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
