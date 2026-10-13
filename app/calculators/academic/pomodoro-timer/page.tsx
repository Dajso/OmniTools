import { Metadata } from 'next';
import { PomodoroTimer } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pomodoro-timer – gratis kalkulator på nett',
  description: 'Studietimer med tilpassbare arbeids- og pauseintervaller. Gratis og uten registrering.',
  keywords: ['pomodoro', 'studietimer', 'fokus', 'arbeidsøkt'],
  alternates: { canonical: '/calculators/academic/pomodoro-timer' },
  openGraph: {
    title: 'Pomodoro-timer',
    description: 'Studietimer med tilpassbare arbeids- og pauseintervaller',
    url: '/calculators/academic/pomodoro-timer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pomodoro-timer',
  description: 'Studietimer med tilpassbare arbeids- og pauseintervaller',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg oppsett', text: 'Klassisk 25 minutter arbeid og 5 minutter pause, eller lag egne tider.' },
  { name: 'Start timeren', text: 'Jobb konsentrert til lyden varsler om pause.' },
  { name: 'Ta pause', text: 'Kort pause etter hver økt og lang pause etter flere økter.' },
  { name: 'Gjenta', text: 'Fortsett til oppgaven er ferdig.' },
];

const faqs = [
  { question: 'Hva er pomodoro-teknikken?', answer: 'Du arbeider konsentrert i faste økter, vanligvis 25 minutter, og tar korte pauser mellom. Etter fire økter tar du en lengre pause.' },
  { question: 'Hvorfor kalles det pomodoro?', answer: 'Pomodoro er italiensk for tomat. Teknikken er oppkalt etter kjøkkenuret i tomatform som oppfinneren brukte.' },
  { question: 'Bør jeg endre tidene?', answer: 'Ja, om 25 minutter ikke passer. Mange velger 50/10 til dypere arbeid.' },
];

export default function PomodoroTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pomodoro-timer"
          title="Pomodoro-timer"
          description="Pomodoro-timer med arbeidsøkter og pauser. Velg klassisk 25/5, kort, lang eller egne tider. Gratis og uten registrering."
        />

        <section aria-label="Pomodoro-timer">
          <PomodoroTimer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
      </main>
    </>
  );
}
