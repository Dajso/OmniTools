import { Metadata } from 'next';
import { CostPerCupCalculator } from '@/components/calculators/coffee/cost-per-cup-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kostnad per kopp kaffe – gratis kalkulator på nett',
  description: 'Regn ut hva hver kopp koster ut fra prisen på kaffeposen. Gratis og uten registrering.',
  keywords: ['kostnad per kopp', 'kaffepris', 'kaffebudsjett', 'hjemmebrygg'],
  alternates: { canonical: '/calculators/coffee/cost-per-cup-calculator' },
  openGraph: {
    title: 'Kostnad per kopp kaffe',
    description: 'Regn ut hva hver kopp koster ut fra prisen på kaffeposen',
    url: '/calculators/coffee/cost-per-cup-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kostnad per kopp kaffe',
  description: 'Regn ut hva hver kopp koster ut fra prisen på kaffeposen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi prisen på posen', text: 'Skriv inn prisen i kroner.' },
  { name: 'Oppgi vekten og mengden per kopp', text: 'For eksempel 250 g pose og 18–20 g per kopp.' },
  { name: 'Legg inn kopper per dag', text: 'Valgfritt, for å se månedlig og årlig kostnad.' },
  { name: 'Les resultatet', text: 'Se kostnad per kopp, per måned og per år.' },
];

const faqs = [
  { question: 'Hvor mye koster en kopp kaffe hjemme?', answer: 'Med en pose på 250 g til 129 kr og 20 g per kopp blir det omtrent 10 kr per kopp.' },
  { question: 'Hvor mye kaffe bruker jeg per kopp?', answer: 'Mange bruker 15–20 g til en kopp på 250–300 ml, avhengig av bryggeforholdet.' },
  { question: 'Hvor mye sparer jeg på å brygge hjemme?', answer: 'En kopp på kafé koster ofte 40–60 kr, så forskjellen blir fort flere tusen kroner i året.' },
  { question: 'Er kostnaden for utstyr med?', answer: 'Nei, bare kaffen. Filter, strøm og maskin kommer i tillegg.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
];

export default function CostPerCupCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cost-per-cup-calculator"
          title="Kostnad per kopp kaffe"
          description="Regn ut hva en kopp kaffe koster hjemme ut fra prisen og vekten på posen, og hva kaffevanen koster i måneden og året. Gratis og uten registrering."
        />

        <section aria-label="Kostnad per kopp kaffe">
          <CostPerCupCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
