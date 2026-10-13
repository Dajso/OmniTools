import { Metadata } from 'next';
import { AimTrainer } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Siktetrener – gratis kalkulator på nett',
  description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet. Gratis og uten registrering.',
  keywords: ['siktetrener', 'aim', 'klikktrening', 'fps', 'skytetrening'],
  alternates: { canonical: '/calculators/gaming/aim-trainer' },
  openGraph: {
    title: 'Siktetrener',
    description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet',
    url: '/calculators/gaming/aim-trainer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Siktetrener',
  description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg vanskelighetsgrad', text: 'Fra lett til ekstremt.' },
  { name: 'Start spillet', text: 'Trykk på «Start spillet».' },
  { name: 'Klikk på målene', text: 'Treff så mange mål du kan.' },
  { name: 'Se resultatet', text: 'Treffsikkerhet og gjennomsnittlig reaksjonstid vises til slutt.' },
];

const faqs = [
  { question: 'Hvordan fungerer siktetreneren?', answer: 'Røde mål dukker opp, og du klikker på dem så raskt og presist du kan.' },
  { question: 'Teller bom?', answer: 'Ja. Å klikke utenfor målet teller som bom og påvirker treffsikkerheten.' },
  { question: 'Hjelper det å trene?', answer: 'Ja, litt aiming hver dag kan gi bedre musekontroll, men også trening i selve spillet er viktig.' },
  { question: 'Hvilken vanskelighetsgrad bør jeg velge?', answer: 'Start med middels, og gå opp når du treffer over 80 %.' },
];

const relatedTools = [
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaksjonstidstest', description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk' },
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI-kalkulator', description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet' },
];

export default function AimTrainerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="aim-trainer"
          title="Siktetrener"
          description="Tren på å sikte med musa ved å klikke mål så fort du kan, med flere vanskelighetsgrader. Gratis og uten registrering."
        />

        <section aria-label="Siktetrener">
          <AimTrainer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
