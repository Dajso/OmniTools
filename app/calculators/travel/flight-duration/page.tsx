import { Metadata } from 'next';
import { FlightDurationCalculator } from '@/components/calculators/travel/flight-duration-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Flytid – gratis kalkulator på nett',
  description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser. Gratis og uten registrering.',
  keywords: ['flytid', 'flytur', 'reisetid', 'flyreise'],
  alternates: { canonical: '/calculators/travel/flight-duration' },
  openGraph: {
    title: 'Flytid',
    description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser',
    url: '/calculators/travel/flight-duration',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flytid',
  description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg avreiseflyplass', text: 'Søk etter by eller flyplasskode. Oslo er valgt som standard.' },
  { name: 'Velg ankomstflyplass', text: 'Søk etter flyplassen du skal til, eller bruk en av de vanlige rutene.' },
  { name: 'Les resultatet', text: 'Se anslått flytid og avstand i kilometer.' },
  { name: 'Bytt retning', text: 'Trykk på pilen for å snu ruten.' },
];

const faqs = [
  { question: 'Hvor nøyaktig er flytiden?', answer: 'Dette er et overslag basert på luftlinjen mellom flyplassene og vanlig marsjfart. Virkelig flytid varierer med vind, rute og flytype, ofte med 15–30 minutter.' },
  { question: 'Hva er inkludert i tiden?', answer: 'Anslaget inkluderer taksing, avgang og landing.' },
  { question: 'Tar den hensyn til tidssoner?', answer: 'Nei, tiden er selve flytiden. Bruk møteplanleggeren for å finne klokkeslett i ankomststedet.' },
  { question: 'Hvorfor flyr fly ikke rett linje?', answer: 'Ruter følger ofte store sirkler, men må ta hensyn til luftrom, vær og vind. Ved lange fly mot vest og øst kan flytiden være ulik i hver retning.' },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Møteplanlegger på tvers av tidssoner', description: 'Planlegg møter på tvers av tidssoner, med sommertid, og finn tidspunkt som passer for alle' },
];

export default function FlightDurationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="flight-duration"
          title="Flytid"
          description="Anslå flytid og avstand mellom norske og store internasjonale flyplasser. Gratis og uten registrering."
        />

        <section aria-label="Flytid">
          <FlightDurationCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
