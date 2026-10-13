import { Metadata } from 'next';
import { DueDateCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Termindato-kalkulator – gratis kalkulator på nett',
  description: 'Beregn termindato ut fra siste menstruasjon eller unnfangelse. Gratis og uten registrering.',
  keywords: ['termin', 'termindato', 'svangerskap', 'gravid', 'beregnet fødsel'],
  alternates: { canonical: '/calculators/health/due-date-calculator' },
  openGraph: {
    title: 'Termindato-kalkulator',
    description: 'Beregn termindato ut fra siste menstruasjon eller unnfangelse',
    url: '/calculators/health/due-date-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Termindato-kalkulator',
  description: 'Beregn termindato ut fra siste menstruasjon eller unnfangelse',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg beregningsmåte', text: 'Siste menstruasjon, unnfangelsesdato eller termin fra ultralyd.' },
  { name: 'Oppgi datoen', text: 'Skriv inn riktig dato.' },
  { name: 'Les resultatet', text: 'Se beregnet termin, uke nå og milepæler.' },
];

const faqs = [
  { question: 'Hvordan regnes termindatoen ut?', answer: 'Fra første dag i siste menstruasjon legges det til 280 dager (40 uker). Det er Naegeles regel, som brukes i svangerskapsomsorgen.' },
  { question: 'Er termindatoen sikker?', answer: 'Nei. Kun en liten andel føder på termin. De fleste føder mellom uke 37 og 42.' },
  { question: 'Hva er bestemmende for termin hos jordmor og lege?', answer: 'Rutineultralyd i uke 17–19 brukes som grunnlag. Jordmor eller lege fastsetter termin.' },
  { question: 'Kan jeg bruke kalkulatoren til svangerskapsomsorg?', answer: 'Nei. Bruk den som veiledning. Følg opp svangerskapet hos jordmor eller fastlege.' },
];

const relatedTools = [
  { href: '/calculators/health/ovulation-calculator', title: 'Eggløsningskalender', description: 'Beregn eggløsning og fruktbare dager' },
];

export default function DueDateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="due-date-calculator"
          title="Termindato-kalkulator"
          description="Regn ut termindato og viktige milepæler i svangerskapet ut fra siste menstruasjon, unnfangelse eller ultralyd. Gratis og uten registrering."
        />

        <section aria-label="Termindato-kalkulator">
          <DueDateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
