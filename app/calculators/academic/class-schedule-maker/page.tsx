import { Metadata } from 'next';
import { ClassScheduleMaker } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Timeplan-lager – gratis kalkulator på nett',
  description: 'Lag timeplaner og eksporter dem som bilde eller PDF. Gratis og uten registrering.',
  keywords: ['timeplan', 'timeplanlegger', 'fag', 'skoleplan'],
  alternates: { canonical: '/calculators/academic/class-schedule-maker' },
  openGraph: {
    title: 'Timeplan-lager',
    description: 'Lag timeplaner og eksporter dem som bilde eller PDF',
    url: '/calculators/academic/class-schedule-maker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Timeplan-lager',
  description: 'Lag timeplaner og eksporter dem som bilde eller PDF',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Gi timeplanen en tittel', text: 'For eksempel Høst 2026.' },
  { name: 'Legg til timer', text: 'Fag, lærer, rom, ukedag og klokkeslett.' },
  { name: 'Velg farger', text: 'Gi hvert fag sin farge.' },
  { name: 'Last ned', text: 'Last ned som PDF eller bilde og skriv ut.' },
];

const faqs = [
  { question: 'Hvilke ukedager vises?', answer: 'Mandag til fredag vises i forhåndsvisningen og i nedlastingen.' },
  { question: 'Hvilket tidsrom dekkes?', answer: 'Fra klokka 07 til klokka 21.' },
  { question: 'Lagres timeplanen?', answer: 'Nei, den lagres ikke. Last den ned før du lukker siden.' },
];

const relatedTools = [
  { href: '/calculators/academic/pomodoro-timer', title: 'Pomodoro-timer', description: 'Studietimer med tilpassbare arbeids- og pauseintervaller' },
];

export default function ClassScheduleMakerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="class-schedule-maker"
          title="Timeplan-lager"
          description="Lag en timeplan med fag, rom og farger, og last den ned som PDF eller bilde. Gratis og uten registrering."
        />

        <section aria-label="Timeplan-lager">
          <ClassScheduleMaker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
