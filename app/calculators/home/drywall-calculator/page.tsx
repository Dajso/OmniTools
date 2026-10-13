import { Metadata } from 'next';
import { DrywallCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gipskalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mange gipsplater du trenger. Gratis og uten registrering.',
  keywords: ['gips', 'gipsplater', 'vegg', 'platekledning', 'platebehov'],
  alternates: { canonical: '/calculators/home/drywall-calculator' },
  openGraph: {
    title: 'Gipskalkulator',
    description: 'Beregn hvor mange gipsplater du trenger',
    url: '/calculators/home/drywall-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gipskalkulator',
  description: 'Beregn hvor mange gipsplater du trenger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Lengde, bredde og takhøyde i meter.' },
  { name: 'Legg inn dører og vinduer', text: 'De trekkes fra veggflaten.' },
  { name: 'Velg platestørrelse', text: 'Vanlige plater er 900 eller 1 200 mm brede og 2 400 eller 2 700 mm lange.' },
  { name: 'Les resultatet', text: 'Se antall plater og anslått mengde tilbehør.' },
];

const faqs = [
  { question: 'Hvor mye svinn bør jeg regne med?', answer: 'Kalkulatoren legger på 10 % for kapp og feil.' },
  { question: 'Hvor tykke er vanlige gipsplater?', answer: 'Normalt 13 mm til vegger og tak. Brannplater og våtromsplater finnes i andre tykkelser.' },
  { question: 'Trenger jeg spesialplater på bad?', answer: 'Ja, bruk fuktbestandige plater (ofte kalt våtromsgips) på bad og vaskerom, og tett riktig.' },
  { question: 'Hvor mye sparkel går det til?', answer: 'Omtrent 0,5 kg per m² for fuging og sparkling. Det varierer med sparkeltype.' },
];

const relatedTools = [
  { href: '/calculators/home/paint-calculator', title: 'Malingskalkulator', description: 'Beregn hvor mye maling du trenger til vegger og tak i liter' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function DrywallCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="drywall-calculator"
          title="Gipskalkulator"
          description="Regn ut hvor mange gipsplater og hvor mye sparkel, fugeremse og skruer du trenger. Gratis og uten registrering."
        />

        <section aria-label="Gipskalkulator">
          <DrywallCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
