import { Metadata } from 'next';
import { WeddingCakeCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bryllupskake – gratis kalkulator på nett',
  description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester. Gratis og uten registrering.',
  keywords: ['bryllupskake', 'kakeporsjoner', 'etasjer', 'kakestørrelse'],
  alternates: { canonical: '/calculators/wedding/wedding-cake-calculator' },
  openGraph: {
    title: 'Bryllupskake',
    description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester',
    url: '/calculators/wedding/wedding-cake-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bryllupskake',
  description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall gjester', text: 'Hvor mange som skal ha kake.' },
  { name: 'Se anbefalt oppsett', text: 'Antall etasjer og diameter på hvert lag.' },
  { name: 'Sjekk porsjonene', text: 'Se hvor mange porsjoner hvert lag gir.' },
  { name: 'Snakk med konditoren', text: 'Avtal størrelse og smak, og husk at stykkene er små bryllupsstykker.' },
];

const faqs = [
  { question: 'Hvor mange porsjoner gir en bryllupskake?', answer: 'Det avhenger av størrelsen. Kalkulatoren viser porsjoner per lag, regnet som små bryllupsstykker.' },
  { question: 'Hva om kaken er hoveddessert?', answer: 'Da bør du regne med større stykker og velge en større kake eller et ekstra lag.' },
  { question: 'Kan jeg ha litt kake til overs?', answer: 'Ja, og det er lurt. Kaken kan fryses, eller gjestene kan ta med seg et stykke hjem.' },
  { question: 'Passer kalkulatoren til kransekake?', answer: 'Nei, den gjelder lagkake i flere etasjer. Spør bakeren hvor mange ringer du trenger til kransekake.' },
];

const relatedTools = [
  { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Drikke til bryllupet', description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten' },
  { href: '/calculators/wedding/catering-quantity-estimator', title: 'Matmengde til selskap', description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert' },
];

export default function WeddingCakeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wedding-cake-calculator"
          title="Bryllupskake"
          description="Finn ut hvor mange etasjer og porsjoner bryllupskaken bør ha ut fra antall gjester, med størrelse på hvert lag i cm. Gratis og uten registrering."
        />

        <section aria-label="Bryllupskake">
          <WeddingCakeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
