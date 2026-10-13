import { Metadata } from 'next';
import { EspressoDialInLog } from '@/components/calculators/coffee/espresso-dial-in-log';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Espresso: innstillingslogg – gratis kalkulator på nett',
  description: 'Logg dose, utbytte, tid og smak for å finne den beste espressoen. Gratis og uten registrering.',
  keywords: ['espresso', 'dial in', 'logg', 'ekstraksjonsforhold', 'oppskrift'],
  alternates: { canonical: '/calculators/coffee/espresso-dial-in-log' },
  openGraph: {
    title: 'Espresso: innstillingslogg',
    description: 'Logg dose, utbytte, tid og smak for å finne den beste espressoen',
    url: '/calculators/coffee/espresso-dial-in-log',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Espresso: innstillingslogg',
  description: 'Logg dose, utbytte, tid og smak for å finne den beste espressoen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn en espresso', text: 'Oppgi kaffemengde, utbytte, tid og kvernstilling.' },
  { name: 'Les vurderingen', text: 'Se ekstraksjonsforhold og gjennomstrømning, med anbefaling.' },
  { name: 'Juster og prøv igjen', text: 'Endre én ting av gangen og logg neste shot.' },
];

const faqs = [
  { question: 'Hva er et godt ekstraksjonsforhold?', answer: 'Mellom 1:1,5 og 1:2,5, ofte rundt 1:2. 18 g kaffe gir da omtrent 36 g espresso.' },
  { question: 'Hvor lang tid bør en espresso ta?', answer: 'Vanligvis 25–30 sekunder fra pumpen starter.' },
  { question: 'Hva gjør jeg hvis espressoen smaker sur?', answer: 'Den er trolig underekstrahert. Kverne finere eller øk utbyttet.' },
  { question: 'Hva gjør jeg hvis den smaker bitter?', answer: 'Den er trolig overekstrahert. Kvern grovere eller stopp shoten tidligere.' },
  { question: 'Lagres loggen?', answer: 'Ja, i nettleseren din på denne enheten. Den sendes ikke noe sted.' },
];

const relatedTools = [
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
];

export default function EspressoDialInLogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="espresso-dial-in-log"
          title="Espresso: innstillingslogg"
          description="Logg espressoshots med mengde, utbytte, tid og smak, og få anbefaling om hvordan du kommer nærmere perfekt oppskrift. Gratis og uten registrering."
        />

        <section aria-label="Espresso: innstillingslogg">
          <EspressoDialInLog />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
