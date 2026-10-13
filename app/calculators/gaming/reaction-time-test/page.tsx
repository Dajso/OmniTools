import { Metadata } from 'next';
import { ReactionTimeTest } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Reaksjonstidstest – gratis kalkulator på nett',
  description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk. Gratis og uten registrering.',
  keywords: ['reaksjonstid', 'reaksjonstest', 'refleks', 'gaming', 'responstid'],
  alternates: { canonical: '/calculators/gaming/reaction-time-test' },
  openGraph: {
    title: 'Reaksjonstidstest',
    description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk',
    url: '/calculators/gaming/reaction-time-test',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Reaksjonstidstest',
  description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Start testen', text: 'Klikk på boksen for å begynne.' },
  { name: 'Vent på grønt', text: 'Ikke klikk før boksen blir grønn.' },
  { name: 'Klikk så fort du kan', text: 'Reaksjonstiden vises i millisekunder.' },
  { name: 'Prøv flere ganger', text: 'Gjennomsnitt og beste tid vises etter flere forsøk.' },
];

const faqs = [
  { question: 'Hva er en god reaksjonstid?', answer: 'Rundt 200–250 ms er vanlig. Under 200 ms er raskt, og under 150 ms er svært raskt.' },
  { question: 'Hva påvirker reaksjonstiden?', answer: 'Søvn, tretthet, alder, skjerm og mus, og hvor fokusert du er.' },
  { question: 'Hvorfor teller ikke et for tidlig klikk?', answer: 'Fordi du da gjetter i stedet for å reagere. Vent til boksen blir grønn.' },
  { question: 'Kan jeg trene opp reaksjonstiden?', answer: 'Litt. Trening gir bedre fokus og jevnere tider, men det er en grense for hvor fort nervesystemet kan reagere.' },
];

const relatedTools = [
  { href: '/calculators/gaming/aim-trainer', title: 'Siktetrener', description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet' },
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Musfølsomhet-omregner', description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite' },
];

export default function ReactionTimeTestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="reaction-time-test"
          title="Reaksjonstidstest"
          description="Test reaksjonstiden din i millisekunder og se hvordan du ligger an mot andre. Gratis og uten registrering."
        />

        <section aria-label="Reaksjonstidstest">
          <ReactionTimeTest />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
