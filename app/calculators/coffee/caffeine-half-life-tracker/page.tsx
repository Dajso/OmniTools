import { Metadata } from 'next';
import { CaffeineHalfLifeTracker } from '@/components/calculators/coffee/caffeine-half-life-tracker';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Koffein og halveringstid – gratis kalkulator på nett',
  description: 'Følg koffeininntaket og se hvor mye som er igjen i kroppen. Gratis og uten registrering.',
  keywords: ['koffein', 'halveringstid', 'søvn', 'kaffe', 'koffeinnivå'],
  alternates: { canonical: '/calculators/coffee/caffeine-half-life-tracker' },
  openGraph: {
    title: 'Koffein og halveringstid',
    description: 'Følg koffeininntaket og se hvor mye som er igjen i kroppen',
    url: '/calculators/coffee/caffeine-half-life-tracker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Koffein og halveringstid',
  description: 'Følg koffeininntaket og se hvor mye som er igjen i kroppen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg til inntak', text: 'Velg en vanlig kilde eller skriv inn mengde i mg og klokkeslett.' },
  { name: 'Se koffeinnivået', text: 'Grafen viser nivået de neste 12 timene.' },
  { name: 'Finn leggetid', text: 'Se når nivået er lavt nok for god søvn.' },
];

const faqs = [
  { question: 'Hva er halveringstid for koffein?', answer: 'Tiden det tar før halvparten er brutt ned. Hos de fleste voksne er den omtrent 5 timer, men den varierer mye fra person til person.' },
  { question: 'Hvor mye koffein er trygt?', answer: 'Den europeiske mattrygghetsmyndigheten (EFSA) regner 400 mg per dag som trygt for friske voksne. Gravide bør ikke ha mer enn 200 mg per dag.' },
  { question: 'Hvor mye koffein er i en kopp kaffe?', answer: 'Omtrent 80–100 mg i en kopp traktekaffe (240 ml) og omtrent 60–80 mg i en enkel espresso. Det varierer.' },
  { question: 'Påvirker koffein søvnen selv om jeg sovner lett?', answer: 'Det kan det. Koffein kan redusere dyp søvn selv om du ikke merker det.' },
  { question: 'Er tallene eksakte?', answer: 'Nei, de er veiledende. Hvor fort koffein brytes ned, påvirkes av blant annet alder, medisiner og graviditet.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
];

export default function CaffeineHalfLifeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="caffeine-half-life-tracker"
          title="Koffein og halveringstid"
          description="Logg koffeininntaket og se hvor mye koffein som er igjen i kroppen i løpet av dagen, og når nivået er lavt nok til å sove. Gratis og uten registrering."
        />

        <section aria-label="Koffein og halveringstid">
          <CaffeineHalfLifeTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
