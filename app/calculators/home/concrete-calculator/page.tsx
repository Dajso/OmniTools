import { Metadata } from 'next';
import { ConcreteCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Betongkalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye betong du trenger i m³ og antall sekker. Gratis og uten registrering.',
  keywords: ['betong', 'sement', 'betongsekker', 'støp', 'kubikkmeter'],
  alternates: { canonical: '/calculators/home/concrete-calculator' },
  openGraph: {
    title: 'Betongkalkulator',
    description: 'Beregn hvor mye betong du trenger i m³ og antall sekker',
    url: '/calculators/home/concrete-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Betongkalkulator',
  description: 'Beregn hvor mye betong du trenger i m³ og antall sekker',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål flaten', text: 'Oppgi lengde og bredde i meter.' },
  { name: 'Oppgi tykkelse', text: 'Skriv inn tykkelsen i centimeter. En vanlig terrasseplate er rundt 10 cm.' },
  { name: 'Legg til svinn', text: '5–10 % ekstra dekker ujevnheter i underlaget og søl.' },
  { name: 'Les resultatet', text: 'Se volum i m³, vekt og antall sekker ferdigblandet betong.' },
];

const faqs = [
  { question: 'Hvor mye betong trenger jeg til en plate?', answer: 'Volumet er lengde × bredde × tykkelse. En plate på 4 × 3 meter og 10 cm tykk blir 1,2 m³, pluss svinn.' },
  { question: 'Hvor mye veier betong?', answer: 'Herdet betong veier omtrent 2 300 kg per m³. Kalkulatoren bruker denne verdien når den regner ut vekt og antall sekker.' },
  { question: 'Skal jeg bestille ferdigbetong eller blande selv?', answer: 'For små jobber under cirka en halv kubikkmeter er sekker praktisk. Til større flater lønner det seg som regel å bestille levert ferdigbetong. Spør leverandøren om minstemengde.' },
  { question: 'Hvor stort svinn bør jeg regne med?', answer: 'Rundt 10 % er et trygt utgangspunkt. Ved ujevnt underlag eller stolpehull kan du trenge mer.' },
];

const relatedTools = [
  { href: '/calculators/home/gravel-calculator', title: 'Grus- og pukkalkulator', description: 'Beregn hvor mye grus eller pukk du trenger i m³ og tonn' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function ConcreteCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="concrete-calculator"
          title="Betongkalkulator"
          description="Regn ut hvor mange kubikkmeter betong og hvor mange sekker du trenger til plate, fundament eller gulv. Gratis og uten registrering."
        />

        <section aria-label="Betongkalkulator">
          <ConcreteCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
