import { Metadata } from 'next';
import { PackingListGenerator } from '@/components/calculators/travel/packing-list-generator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pakkeliste – gratis kalkulator på nett',
  description: 'Lag en tilpasset pakkeliste ut fra reisemål, vær og varighet. Gratis og uten registrering.',
  keywords: ['pakkeliste', 'reisesjekkliste', 'pakking', 'ferie'],
  alternates: { canonical: '/calculators/travel/packing-list' },
  openGraph: {
    title: 'Pakkeliste',
    description: 'Lag en tilpasset pakkeliste ut fra reisemål, vær og varighet',
    url: '/calculators/travel/packing-list',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pakkeliste',
  description: 'Lag en tilpasset pakkeliste ut fra reisemål, vær og varighet',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg lengde og type reise', text: 'Fortell hvor lenge du skal være borte og hva slags reise det er.' },
  { name: 'Velg vær og aktiviteter', text: 'Velg forventet vær og kryss av for aktivitetene du skal gjøre.' },
  { name: 'Velg hva som skal være med', text: 'Du kan ta med toalettsaker, elektronikk og medisin eller la det ligge.' },
  { name: 'Pakk og kryss av', text: 'Kryss av underveis, kopier listen eller last den ned som tekstfil.' },
];

const faqs = [
  { question: 'Hvor mange klesplagg bør jeg ta med?', answer: 'Listen regner med antall dager for undertøy, sokker og overdeler, men maks en ukes forbruk. For lengre reiser kan du vaske underveis.' },
  { question: 'Hva er «bare det viktigste»?', answer: 'Et filter som bare viser tingene som er merket som viktige, praktisk når du bare har håndbagasje.' },
  { question: 'Husker jeg alt med denne listen?', answer: 'Den er et godt utgangspunkt. Legg til det du trenger personlig, som fast medisin og barnas ting, og sjekk reglene for væsker og batterier hos flyselskapet.' },
  { question: 'Hva med EHIC-kort og reiseforsikring?', answer: 'Husk helsekort for EØS (EHIC), reiseforsikring og pass eller nasjonalt ID-kort. Sjekk hva som kreves for landet du reiser til.' },
];

const relatedTools = [
  { href: '/calculators/travel/luggage-size', title: 'Bagasjemål', description: 'Sjekk om bagasjen oppfyller mål- og vektgrensene hos SAS, Norwegian, Widerøe og andre flyselskaper' },
  { href: '/calculators/travel/flight-duration', title: 'Flytid', description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser' },
];

export default function PackingListPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="packing-list"
          title="Pakkeliste"
          description="Lag en pakkeliste som passer reisen, ut fra varighet, type reise, vær og aktiviteter. Kan kopieres eller lastes ned. Gratis og uten registrering."
        />

        <section aria-label="Pakkeliste">
          <PackingListGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
