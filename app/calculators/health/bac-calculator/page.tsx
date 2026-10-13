import { Metadata } from 'next';
import { BACCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Promillekalkulator – gratis kalkulator på nett',
  description: 'Beregn omtrentlig promille ut fra alkoholinntak, vekt og tid. Gratis og uten registrering.',
  keywords: ['promille', 'alkohol', 'promillekalkulator', 'alkoholkonsentrasjon'],
  alternates: { canonical: '/calculators/health/bac-calculator' },
  openGraph: {
    title: 'Promillekalkulator',
    description: 'Beregn omtrentlig promille ut fra alkoholinntak, vekt og tid',
    url: '/calculators/health/bac-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Promillekalkulator',
  description: 'Beregn omtrentlig promille ut fra alkoholinntak, vekt og tid',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn vekt og kjønn', text: 'Brukes i Widmarks formel.' },
  { name: 'Oppgi hva du har drukket', text: 'Velg type drikke og antall.' },
  { name: 'Oppgi tid', text: 'Antall timer siden første drink.' },
  { name: 'Les resultatet', text: 'Se anslått promille og når du er under 0,2.' },
];

const faqs = [
  { question: 'Hva er promillegrensen i Norge?', answer: '0,2 promille for kjøretøy etter vegtrafikkloven. Fra 0,5 og 1,2 promille øker straffene.' },
  { question: 'Hvor nøyaktig er kalkulatoren?', answer: 'Den gir et anslag. Mat, alkoholstyrke, medisiner og forbrenning gir store individuelle forskjeller.' },
  { question: 'Hvor fort forbrenner kroppen alkohol?', answer: 'Omtrent 0,10–0,15 promille per time. Kalkulatoren bruker 0,10.' },
  { question: 'Hva er en alkoholenhet?', answer: 'I Norge regnes en enhet som 12 gram ren alkohol, omtrent en 0,33-liters flaske øl, et glass vin på 12 cl eller 4 cl sprit.' },
  { question: 'Kan jeg kjøre dagen derpå?', answer: 'Ikke nødvendigvis. Du kan fortsatt ha promille neste morgen. Vent til du er trygg, og bruk gjerne alkometer.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
];

export default function BACCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bac-calculator"
          title="Promillekalkulator"
          description="Anslå promillen din ut fra hva du har drukket, vekt, kjønn og tid. Norsk promillegrense er 0,2. Gratis og uten registrering."
        />

        <section aria-label="Promillekalkulator">
          <BACCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
