import { Metadata } from 'next';
import { CronGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Cron-generator – gratis kalkulator på nett',
  description: 'Bygg cron-uttrykk visuelt, med beskrivelse på vanlig språk. Gratis og uten registrering.',
  keywords: ['cron', 'cron-uttrykk', 'crontab', 'planlegger', 'cron-syntaks'],
  alternates: { canonical: '/calculators/productivity/cron-generator' },
  openGraph: {
    title: 'Cron-generator',
    description: 'Bygg cron-uttrykk visuelt, med beskrivelse på vanlig språk',
    url: '/calculators/productivity/cron-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cron-generator',
  description: 'Bygg cron-uttrykk visuelt, med beskrivelse på vanlig språk',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg et forhåndsvalg', text: 'Start med et ferdig forslag, for eksempel «Hver time».' },
  { name: 'Fyll inn feltene', text: 'Minutt, time, dag i måneden, måned og ukedag.' },
  { name: 'Les beskrivelsen', text: 'Uttrykket forklares på vanlig norsk.' },
  { name: 'Se neste kjøringer', text: 'De neste fem tidspunktene vises i din lokale tid.' },
];

const faqs = [
  { question: 'Hva er cron?', answer: 'Et verktøy i Linux og Unix som kjører oppgaver etter en tidsplan.' },
  { question: 'Hva betyr * og */5?', answer: '* betyr alle verdier, og */5 betyr hver femte, for eksempel hvert femte minutt.' },
  { question: 'Hvilken tidssone brukes?', answer: 'Serverens tidssone, ikke nødvendigvis norsk tid. Sjekk innstillingene på serveren.' },
  { question: 'Hvilken ukedag er 0?', answer: 'Søndag. Mandag er 1, og lørdag er 6. Mange systemer godtar også 7 for søndag.' },
];

const relatedTools = [
  { href: '/calculators/productivity/timestamp-converter', title: 'Tidsstempel-omregner', description: 'Gjør om Unix-tidsstempler til lesbare datoer' },
  { href: '/calculators/productivity/timezone-converter', title: 'Tidssoneomregner', description: 'Regn om klokkeslett mellom tidssoner' },
];

export default function CronGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cron-generator"
          title="Cron-generator"
          description="Bygg cron-uttrykk visuelt, få beskrivelse på norsk og se de neste kjøretidspunktene. Gratis og uten registrering."
        />

        <section aria-label="Cron-generator">
          <CronGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
