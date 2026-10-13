import { Metadata } from 'next';
import { TileCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Flisekalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mange fliser du trenger til gulv eller vegg. Gratis og uten registrering.',
  keywords: ['fliser', 'gulvfliser', 'flislegging', 'flisforbruk', 'svinn'],
  alternates: { canonical: '/calculators/home/tile-calculator' },
  openGraph: {
    title: 'Flisekalkulator',
    description: 'Beregn hvor mange fliser du trenger til gulv eller vegg',
    url: '/calculators/home/tile-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flisekalkulator',
  description: 'Beregn hvor mange fliser du trenger til gulv eller vegg',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Oppgi lengde og bredde på flaten du skal flislegge, i meter.' },
  { name: 'Velg flisstørrelse', text: 'Skriv inn flisens mål i centimeter, eller trykk på en vanlig størrelse.' },
  { name: 'Sett svinn', text: '10 % er vanlig. Ved diagonallegging eller mange kapp bør du velge 15 % eller mer.' },
  { name: 'Les resultatet', text: 'Se hvor mange fliser, kvadratmeter og esker du bør kjøpe.' },
];

const faqs = [
  { question: 'Hvor mye svinn bør jeg regne med på fliser?', answer: '10 % ved rett legging og 15 % ved diagonal legging, fiskebein eller store fliser i et rom med mange hjørner og rør.' },
  { question: 'Hvorfor bør jeg kjøpe litt ekstra?', answer: 'Fliser fra ulike produksjonsserier kan ha små fargeforskjeller. Det er også greit å ha noen til overs hvis en flis må byttes senere.' },
  { question: 'Hva er areal per eske?', answer: 'Det står på esken, ofte 1–2 m². Skriv inn hvor mange fliser det er i en eske, så regner kalkulatoren ut antall esker.' },
  { question: 'Tar kalkulatoren hensyn til fugebredden?', answer: 'Nei. Fugene er så smale at de har liten betydning for antallet, men du bør legge på litt mer ved bred fuge.' },
];

const relatedTools = [
  { href: '/calculators/home/carpet-calculator', title: 'Teppekalkulator', description: 'Beregn hvor mye teppe eller gulvbelegg du trenger til et rom' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function TileCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tile-calculator"
          title="Flisekalkulator"
          description="Regn ut hvor mange fliser du trenger til gulv eller vegg, inkludert svinn og antall esker. Gratis og uten registrering."
        />

        <section aria-label="Flisekalkulator">
          <TileCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
