import { Metadata } from 'next';
import { MonitorHzTester } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Skjermfrekvens-test – gratis kalkulator på nett',
  description: 'Test og kontroller oppdateringsfrekvensen på skjermen. Gratis og uten registrering.',
  keywords: ['skjerm hz', 'oppdateringsfrekvens', 'hz-test', 'bildefrekvens', '144hz'],
  alternates: { canonical: '/calculators/gaming/monitor-hz-tester' },
  openGraph: {
    title: 'Skjermfrekvens-test',
    description: 'Test og kontroller oppdateringsfrekvensen på skjermen',
    url: '/calculators/gaming/monitor-hz-tester',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Skjermfrekvens-test',
  description: 'Test og kontroller oppdateringsfrekvensen på skjermen',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Trykk på Start', text: 'Følg boksen som beveger seg over skjermen.' },
  { name: 'Vent noen sekunder', text: 'Testen måler antall bilder per sekund.' },
  { name: 'Les av resultatet', text: 'Se beregnet oppdateringsfrekvens og hvor jevne bildene er.' },
  { name: 'Test flere ganger', text: 'Gjenta for sikrere resultat.' },
];

const faqs = [
  { question: 'Hva er oppdateringsfrekvens?', answer: 'Hvor mange ganger per sekund skjermen tegner bildet på nytt, målt i Hz. 60 Hz er vanlig, mens gamingskjermer har 144 Hz eller mer.' },
  { question: 'Hvorfor viser testen lavere tall enn skjermen min?', answer: 'Nettleseren, bakgrunnsprosesser og strømsparing kan holde FPS nede. Sjekk også at skjermen faktisk er stilt til høyeste frekvens i systeminnstillingene.' },
  { question: 'Hva er jevnhet i bildene?', answer: 'Hvor jevnt bildene kommer. Lav jevnhet kan gi hakking selv om gjennomsnittet er høyt.' },
  { question: 'Er testen nøyaktig?', answer: 'Den gir et godt anslag, men er ikke en fullverdig måling. Lukk andre faner og kjør den flere ganger.' },
];

const relatedTools = [
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaksjonstidstest', description: 'Mål reaksjonstiden din med visuelt signal og følg gjennomsnittet over flere forsøk' },
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Musfølsomhet-omregner', description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite' },
];

export default function MonitorHzTesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="monitor-hz-tester"
          title="Skjermfrekvens-test"
          description="Test hvor mange bilder per sekund (Hz) skjermen din faktisk viser i nettleseren. Gratis og uten registrering."
        />

        <section aria-label="Skjermfrekvens-test">
          <MonitorHzTester />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
