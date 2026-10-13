import { Metadata } from 'next';
import { TimezonePlanner } from '@/components/calculators/travel/timezone-planner';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Møteplanlegger på tvers av tidssoner – gratis kalkulator på nett',
  description: 'Planlegg møter på tvers av tidssoner, med sommertid, og finn tidspunkt som passer for alle. Gratis og uten registrering.',
  keywords: ['tidssone', 'møteplanlegger', 'verdensklokke', 'fjernarbeid', 'internasjonalt møte'],
  alternates: { canonical: '/calculators/travel/timezone-planner' },
  openGraph: {
    title: 'Møteplanlegger på tvers av tidssoner',
    description: 'Planlegg møter på tvers av tidssoner, med sommertid, og finn tidspunkt som passer for alle',
    url: '/calculators/travel/timezone-planner',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Møteplanlegger på tvers av tidssoner',
  description: 'Planlegg møter på tvers av tidssoner, med sommertid, og finn tidspunkt som passer for alle',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg din tidssone', text: 'Start med stedet du selv er på. Oslo er valgt som standard.' },
  { name: 'Velg dato og klokkeslett', text: 'Sommertid og vintertid regnes ut for den datoen du velger. Dra i glidebryteren for å sette klokkeslettet hos deg.' },
  { name: 'Legg til deltakere', text: 'Legg til byene deltakerne er i. Du ser lokal tid for hver av dem.' },
  { name: 'Se hva som passer', text: 'Grønt betyr arbeidstid (08–16), gult utenfor arbeidstid og rødt natt. Under ser du tidsrommet der alle har arbeidstid.' },
];

const faqs = [
  { question: 'Hvorfor endrer tidsforskjellen seg gjennom året?', answer: 'Norge, resten av Europa og USA skifter til sommertid på ulike datoer. I noen uker i mars og oktober er forskjellen til USA en time kortere eller lengre enn ellers. Velg derfor datoen møtet skal holdes.' },
  { question: 'Hva regnes som arbeidstid?', answer: 'Kalkulatoren bruker 08:00–16:00 lokal tid, slik det er vanlig i Norge. Mange internasjonale kontorer har 09:00–17:00, så sjekk med motparten.' },
  { question: 'Hva betyr natt?', answer: 'Klokkeslett mellom 22:00 og 06:00 lokal tid.' },
  { question: 'Hvilken tid vises for Oslo?', answer: 'Norsk tid, altså CET om vinteren (UTC+1) og CEST om sommeren (UTC+2).' },
];

const relatedTools = [
  { href: '/calculators/travel/flight-duration', title: 'Flytid', description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser' },
];

export default function TimezonePlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timezone-planner"
          title="Møteplanlegger på tvers av tidssoner"
          description="Finn et møtetidspunkt som passer for deltakere i flere tidssoner, med riktig sommertid for datoen du velger. Gratis og uten registrering."
        />

        <section aria-label="Møteplanlegger på tvers av tidssoner">
          <TimezonePlanner />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
