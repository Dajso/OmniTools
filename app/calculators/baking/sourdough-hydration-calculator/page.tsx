import { Metadata } from 'next';
import { SourdoughHydrationCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Surdeig: hydrering – gratis kalkulator på nett',
  description: 'Regn ut hydrering i surdeigsbrød, med surdeigsstarter, grovt mel og rug. Gratis og uten registrering.',
  keywords: ['surdeig', 'hydrering', 'mel og vann', 'surdeigsbrød', 'rug'],
  alternates: { canonical: '/calculators/baking/sourdough-hydration-calculator' },
  openGraph: {
    title: 'Surdeig: hydrering',
    description: 'Regn ut hydrering i surdeigsbrød, med surdeigsstarter, grovt mel og rug',
    url: '/calculators/baking/sourdough-hydration-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Surdeig: hydrering',
  description: 'Regn ut hydrering i surdeigsbrød, med surdeigsstarter, grovt mel og rug',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi mel og vann', text: 'Skriv inn gram mel og vann i selve deigen.' },
  { name: 'Legg til starteren', text: 'Oppgi hvor mye starter du bruker og hvor våt den er. En 100 % starter består av like deler mel og vann.' },
  { name: 'Les hydreringen', text: 'Kalkulatoren regner med mel og vann fra starteren også, slik at du får den reelle prosenten.' },
];

const faqs = [
  { question: 'Hva er hydrering?', answer: 'Det er mengden vann i forhold til mel, målt i prosent. 700 g vann til 1 000 g mel gir 70 % hydrering.' },
  { question: 'Hvilken hydrering passer for meg?', answer: '65–70 % er greit å jobbe med. 75–80 % gir åpnere krumme, men en klissete deig. Grovt mel og rug trekker mer vann.' },
  { question: 'Skal starteren regnes med?', answer: 'Ja. En starter med 100 % hydrering er halvt mel og halvt vann, og begge deler påvirker deigen.' },
];

const relatedTools = [
  { href: '/calculators/baking/bakers-percentage-calculator', title: 'Bakerprosent', description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde' },
  { href: '/calculators/baking/yeast-conversion-calculator', title: 'Gjær: omregner', description: 'Regn om mellom fersk gjær, tørrgjær og instant gjær' },
];

export default function SourdoughHydrationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sourdough-hydration-calculator"
          title="Surdeig: hydrering"
          description="Regn ut hydreringen i surdeigsbrødet ditt, med hensyn til vann og mel i starteren. Gratis og uten registrering."
        />

        <section aria-label="Surdeig: hydrering">
          <SourdoughHydrationCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
