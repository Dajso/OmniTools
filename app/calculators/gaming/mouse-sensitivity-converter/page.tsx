import { Metadata } from 'next';
import { MouseSensitivityConverter } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Musfølsomhet-omregner – gratis kalkulator på nett',
  description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite. Gratis og uten registrering.',
  keywords: ['musfølsomhet', 'sensitivitet', 'cm/360', 'valorant', 'cs2', 'apex', 'gaming'],
  alternates: { canonical: '/calculators/gaming/mouse-sensitivity-converter' },
  openGraph: {
    title: 'Musfølsomhet-omregner',
    description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite',
    url: '/calculators/gaming/mouse-sensitivity-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Musfølsomhet-omregner',
  description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg spillet du kommer fra', text: 'Velg spillet og skriv inn følsomheten din.' },
  { name: 'Oppgi mus-DPI', text: 'Bruk DPI-en som er stilt inn på musa.' },
  { name: 'Velg spillet du går til', text: 'Velg målspillet.' },
  { name: 'Les av ny følsomhet', text: 'Bruk verdien i spillet, og sjekk cm/360.' },
];

const faqs = [
  { question: 'Hva er cm/360?', answer: 'Hvor mange centimeter du må flytte musa for å snu 360° i spillet. Det er den mest rettferdige måten å sammenligne følsomhet på.' },
  { question: 'Hvorfor har spill ulik følsomhet?', answer: 'Hvert spill bruker sin egen multiplikator for hvor mye en musebevegelse snur kameraet. Kalkulatoren tar hensyn til det.' },
  { question: 'Hva er en god cm/360?', answer: 'Det er personlig. Mange spillere i taktiske skytespill ligger mellom 25 og 60 cm/360. Prøv deg frem.' },
  { question: 'Må jeg endre DPI?', answer: 'Nei. Du kan beholde DPI og endre bare følsomheten i spillet.' },
];

const relatedTools = [
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI-kalkulator', description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaksjonstidstest', description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk' },
];

export default function MouseSensitivityConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mouse-sensitivity-converter"
          title="Musfølsomhet-omregner"
          description="Regn om musefølsomheten mellom Valorant, CS2, Apex, Fortnite og andre spill, og behold samme cm/360. Gratis og uten registrering."
        />

        <section aria-label="Musfølsomhet-omregner">
          <MouseSensitivityConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
