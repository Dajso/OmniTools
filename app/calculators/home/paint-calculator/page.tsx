import { Metadata } from 'next';
import { PaintCalculator } from '@/components/calculators/home/paint-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Malingskalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye maling du trenger til vegger og tak i liter. Gratis og uten registrering.',
  keywords: ['maling', 'veggmaling', 'liter maling', 'malingsforbruk', 'dekkevne'],
  alternates: { canonical: '/calculators/home/paint-calculator' },
  openGraph: {
    title: 'Malingskalkulator',
    description: 'Beregn hvor mye maling du trenger til vegger og tak i liter',
    url: '/calculators/home/paint-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Malingskalkulator',
  description: 'Beregn hvor mye maling du trenger til vegger og tak i liter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Skriv inn lengde, bredde og takhøyde i meter.' },
  { name: 'Legg inn dører og vinduer', text: 'Oppgi hvor mange det er. De trekkes fra veggflaten.' },
  { name: 'Velg strøk og dekkevne', text: 'To strøk er vanlig. Dekkevnen står på malingsspannet, ofte rundt 10 m² per liter.' },
  { name: 'Les resultatet', text: 'Se hvor mange liter du trenger, og hvor mange bokser à 2,7 eller 9 liter det blir.' },
];

const faqs = [
  { question: 'Hvor mye maling trenger jeg til et rom?', answer: 'Det avhenger av størrelsen. Et rom på 4 × 3,5 meter med 2,4 meter til taket og to strøk på veggene trenger ofte rundt 8–10 liter. Kalkulatoren regner det ut fra dine mål.' },
  { question: 'Hvor mange m² dekker en liter maling?', answer: 'De fleste innendørs veggmalinger dekker 8–12 m² per liter og strøk. Se produktbladet eller etiketten for nøyaktig dekkevne. Ru og porøse flater trekker mer maling.' },
  { question: 'Hvor mange strøk trenger jeg?', answer: 'Som regel to strøk. Går du fra mørk til lys farge, eller maler på ubehandlet flate, kan du trenge grunning eller et tredje strøk.' },
  { question: 'Må jeg regne med svinn?', answer: 'Kalkulatoren runder opp til nærmeste halve liter. Kjøp gjerne litt ekstra til flekkreparasjoner, og sørg for at du får maling fra samme batch hvis du kjøper flere bokser.' },
];

const relatedTools = [
  { href: '/calculators/home/wallpaper-calculator', title: 'Tapetkalkulator', description: 'Beregn hvor mange tapetruller du trenger' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function PaintCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="paint-calculator"
          title="Malingskalkulator"
          description="Regn ut hvor mange liter maling du trenger til vegger og tak, og hvor mange bokser du bør kjøpe. Gratis og uten registrering."
        />

        <section aria-label="Malingskalkulator">
          <PaintCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
