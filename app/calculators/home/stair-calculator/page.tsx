import { Metadata } from 'next';
import { StairCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Trappekalkulator – gratis kalkulator på nett',
  description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn. Gratis og uten registrering.',
  keywords: ['trapp', 'opptrinn', 'inntrinn', 'trappemål', 'trinnhøyde'],
  alternates: { canonical: '/calculators/home/stair-calculator' },
  openGraph: {
    title: 'Trappekalkulator',
    description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn',
    url: '/calculators/home/stair-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Trappekalkulator',
  description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål høydeforskjellen', text: 'Oppgi total høyde fra gulv til gulv i centimeter.' },
  { name: 'Oppgi tilgjengelig lengde', text: 'Skriv inn hvor lang plass trappen har, i centimeter.' },
  { name: 'Skriv inn trappebredde', text: 'Bredden på trappeløpet i centimeter.' },
  { name: 'Les resultatet', text: 'Se opptrinn, inntrinn, antall trinn og merknader om krav.' },
];

const faqs = [
  { question: 'Hva er opptrinn og inntrinn?', answer: 'Opptrinn er høyden på hvert trinn. Inntrinn er dybden du setter foten på.' },
  { question: 'Hva er trappeformelen?', answer: '2 × opptrinn + inntrinn bør bli omtrent 60–64 cm for at trappen skal føles behagelig.' },
  { question: 'Hva krever TEK17?', answer: 'Blant annet inntrinn på minst 25 cm, og at rekkverk settes opp der fallhøyden er over 0,5 m. Kontroller alltid gjeldende forskrift hos DiBK.' },
  { question: 'Hvor bratt kan en trapp være?', answer: 'Opptrinn over 20 cm er bratt og frarådes for fast trapp i bolig.' },
];

const relatedTools = [
  { href: '/calculators/home/roof-pitch-calculator', title: 'Takvinkelkalkulator', description: 'Beregn takvinkel i grader og prosent' },
  { href: '/calculators/home/lumber-calculator', title: 'Trelastkalkulator', description: 'Beregn mengde trelast i løpemeter og m³' },
];

export default function StairCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="stair-calculator"
          title="Trappekalkulator"
          description="Regn ut opptrinn, inntrinn og antall trinn i en trapp, og sjekk mot kravene i byggteknisk forskrift. Gratis og uten registrering."
        />

        <section aria-label="Trappekalkulator">
          <StairCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
