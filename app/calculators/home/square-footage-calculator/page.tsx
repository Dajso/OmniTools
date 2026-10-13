import { Metadata } from 'next';
import { SquareFootageCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Arealkalkulator – gratis kalkulator på nett',
  description: 'Regn ut areal i kvadratmeter for rom og flater. Gratis og uten registrering.',
  keywords: ['areal', 'kvadratmeter', 'm2', 'romstørrelse', 'BRA'],
  alternates: { canonical: '/calculators/home/square-footage-calculator' },
  openGraph: {
    title: 'Arealkalkulator',
    description: 'Regn ut areal i kvadratmeter for rom og flater',
    url: '/calculators/home/square-footage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Arealkalkulator',
  description: 'Regn ut areal i kvadratmeter for rom og flater',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg figur', text: 'Rektangel, trekant, sirkel eller trapes.' },
  { name: 'Skriv inn målene', text: 'Oppgi lengder i meter.' },
  { name: 'Les resultatet', text: 'Se areal i m², dekar og hektar, og omkretsen.' },
];

const faqs = [
  { question: 'Hvor mange m² er et dekar?', answer: '1 dekar er 1 000 m². 1 hektar er 10 000 m² eller 10 dekar.' },
  { question: 'Hvordan regner jeg ut areal av en sirkel?', answer: 'Areal er π × radius². En sirkel med radius 3 m er cirka 28,3 m².' },
  { question: 'Hvordan regner jeg ut en uregelmessig flate?', answer: 'Del flaten i enkle figurer, regn ut arealet av hver, og legg sammen.' },
  { question: 'Hva er boligareal og bruksareal?', answer: 'BRA (bruksareal) og P-ROM er målt etter standarden NS 3940. Denne kalkulatoren regner geometrisk areal og tar ikke hensyn til målereglene.' },
];

const relatedTools = [
  { href: '/calculators/home/paint-calculator', title: 'Malingskalkulator', description: 'Beregn hvor mye maling du trenger til vegger og tak i liter' },
  { href: '/calculators/home/tile-calculator', title: 'Flisekalkulator', description: 'Beregn hvor mange fliser du trenger til gulv eller vegg' },
  { href: '/calculators/home/carpet-calculator', title: 'Teppekalkulator', description: 'Beregn hvor mye teppe eller gulvbelegg du trenger til et rom' },
];

export default function SquareFootageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="square-footage-calculator"
          title="Arealkalkulator"
          description="Regn ut areal og omkrets for rektangel, trekant, sirkel og trapes, i m², dekar og hektar. Gratis og uten registrering."
        />

        <section aria-label="Arealkalkulator">
          <SquareFootageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
