import { Metadata } from 'next';
import { WeddingAlcoholCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Drikke til bryllupet – gratis kalkulator på nett',
  description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten. Gratis og uten registrering.',
  keywords: ['bryllup', 'drikke', 'bryllupsdrikke', 'vin', 'fest'],
  alternates: { canonical: '/calculators/wedding/wedding-alcohol-calculator' },
  openGraph: {
    title: 'Drikke til bryllupet',
    description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten',
    url: '/calculators/wedding/wedding-alcohol-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Drikke til bryllupet',
  description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi gjester og varighet', text: 'Antall gjester og hvor mange timer selskapet varer.' },
  { name: 'Angi andel som drikker', text: 'Hvor mange prosent av gjestene som drikker alkohol.' },
  { name: 'Fordel på vin, øl og sterkt', text: 'Hvordan drikkene fordeler seg i prosent.' },
  { name: 'Les av innkjøpslisten', text: 'Se antall flasker og kasser, og legg gjerne på litt buffer.' },
];

const faqs = [
  { question: 'Hvor mye alkohol trenger jeg per gjest?', answer: 'Som tommelfingerregel regner man med omtrent én drikke per drikkende gjest per time. Til en fest på fem timer blir det altså rundt fem drikker hver.' },
  { question: 'Hvor mange glass er det i en vinflaske?', answer: 'Omtrent fem glass à 15 cl i en flaske på 0,75 liter.' },
  { question: 'Hvor mange drinker er det i en flaske sterkt?', answer: 'Rundt 17 drinker à 4 cl i en flaske på 0,7 liter.' },
  { question: 'Trenger jeg alkoholfrie alternativer?', answer: 'Ja. Ha alkoholfri musserende, øl og vann tilgjengelig for dem som ikke drikker, og for sjåfører og gravide.' },
  { question: 'Bør jeg kjøpe litt ekstra?', answer: 'Ja, 10 % ekstra gir en buffer. Husk at du kan levere tilbake uåpnede flasker hvis butikken tillater det, så avtal det på forhånd.' },
];

const relatedTools = [
  { href: '/calculators/wedding/catering-quantity-estimator', title: 'Matmengde til selskap', description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert' },
  { href: '/calculators/wedding/wedding-cake-calculator', title: 'Bryllupskake', description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester' },
];

export default function WeddingAlcoholCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wedding-alcohol-calculator"
          title="Drikke til bryllupet"
          description="Regn ut hvor mange flasker vin, kasser øl og flasker sterkt du bør kjøpe til bryllupsselskapet ut fra antall gjester og hvor lenge festen varer. Gratis og uten registrering."
        />

        <section aria-label="Drikke til bryllupet">
          <WeddingAlcoholCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
