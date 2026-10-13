import { Metadata } from 'next';
import { StockingCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fiskebesetning – gratis kalkulator på nett',
  description: 'Regn ut hvor mange fisk akvariet tåler (cm fisk per liter). Gratis og uten registrering.',
  keywords: ['fiskebesetning', 'antall fisk', 'akvarium', 'overbesetning'],
  alternates: { canonical: '/calculators/aquarium/stocking-calculator' },
  openGraph: {
    title: 'Fiskebesetning',
    description: 'Regn ut hvor mange fisk akvariet tåler (cm fisk per liter)',
    url: '/calculators/aquarium/stocking-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fiskebesetning',
  description: 'Regn ut hvor mange fisk akvariet tåler (cm fisk per liter)',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi akvariumvolum', text: 'Volum i liter.' },
  { name: 'Legg til fiskene', text: 'Skriv inn navn, lengde i cm og antall.' },
  { name: 'Se besetningsgraden', text: 'Se samlet fiskelengde og hvor stor del av kapasiteten som er brukt.' },
  { name: 'Les anbefalingen', text: 'Få en vurdering og tips for å holde vannkvaliteten god.' },
];

const faqs = [
  { question: 'Hvor mange fisk kan jeg ha i akvariet?', answer: 'Som veiledende tommelfingerregel omtrent 0,67 cm fisk per liter vann. Et kar på 100 liter rommer da ca. 67 cm fisk totalt.' },
  { question: 'Er regelen alltid riktig?', answer: 'Nei. Store, aktive eller skitne fisk trenger mer plass, og god filtrering kan gi litt rom. Bruk den som veiledning, ikke fasit.' },
  { question: 'Hva skjer hvis jeg har for mange fisk?', answer: 'Vannkvaliteten forverres, fisken blir stresset og sykdom er vanlig. Ammoniakk og nitritt stiger raskere.' },
  { question: 'Påvirker filteret hvor mange fisk jeg kan ha?', answer: 'Ja, litt. Men akvariets volum er fortsatt den viktigste begrensningen.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/heater-wattage-calculator', title: 'Varmeelement til akvarium', description: 'Regn ut nødvendig effekt (watt) ut fra volum, romtemperatur og ønsket vanntemperatur' },
  { href: '/calculators/aquarium/water-change-calculator', title: 'Vannskifte', description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier' },
];

export default function StockingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="stocking-calculator"
          title="Fiskebesetning"
          description="Sjekk om det er plass til fiskene i akvariet, ut fra volum og lengden på fiskene. Gratis og uten registrering."
        />

        <section aria-label="Fiskebesetning">
          <StockingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
