import { Metadata } from 'next';
import { PourOverTimer } from '@/components/calculators/coffee/pour-over-timer';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pour over-timer – gratis kalkulator på nett',
  description: 'Flertrinns timer med 4:6-metoden og egne helleplaner. Gratis og uten registrering.',
  keywords: ['pour over', 'timer', '4:6', 'V60', 'Chemex', 'kaffe'],
  alternates: { canonical: '/calculators/coffee/pour-over-timer' },
  openGraph: {
    title: 'Pour over-timer',
    description: 'Flertrinns timer med 4:6-metoden og egne helleplaner',
    url: '/calculators/coffee/pour-over-timer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pour over-timer',
  description: 'Flertrinns timer med 4:6-metoden og egne helleplaner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg metode', text: 'Velg 4:6-metoden eller egne helleomganger.' },
  { name: 'Oppgi vannmengden', text: 'Hvor mye vann du skal bruke totalt, i gram.' },
  { name: 'Start timeren', text: 'Hell vann etter helleplanen.' },
  { name: 'La kaffen renne gjennom', text: 'Vent til vannet har rent helt gjennom før du serverer.' },
];

const faqs = [
  { question: 'Hva er 4:6-metoden?', answer: 'En metode utviklet av Tetsu Kasuya, som deler vannet i fem omganger. De to første (40 %) styrer søthet og syre, de tre siste (60 %) styrer styrken.' },
  { question: 'Hvor mye vann bør jeg bruke?', answer: 'En vanlig start er 15–17 gram vann per gram kaffe. For 20 g kaffe er det 300–340 g vann.' },
  { question: 'Hvor lang tid bør en pour over ta?', answer: 'Omtrent 2,5 til 4 minutter, avhengig av mengde og kvernstørrelse.' },
  { question: 'Hva gjør jeg hvis kaffen renner for fort?', answer: 'Kvern finere. Renner den for sakte, kvern grovere.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
  { href: '/calculators/coffee/grind-size-converter', title: 'Kvernstørrelse', description: 'Regn om kverninnstillinger mellom ulike kaffekverner' },
];

export default function PourOverTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pour-over-timer"
          title="Pour over-timer"
          description="Timer for pour over med 4:6-metoden eller egne helleomganger, med helleplan og vannmengde for hver omgang. Gratis og uten registrering."
        />

        <section aria-label="Pour over-timer">
          <PourOverTimer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
