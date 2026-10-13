import { Metadata } from 'next';
import { LuggageSizeChecker } from '@/components/calculators/travel/luggage-size-checker';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bagasjemål – gratis kalkulator på nett',
  description: 'Sjekk om bagasjen oppfyller mål- og vektgrensene hos SAS, Norwegian, Widerøe og andre flyselskaper. Gratis og uten registrering.',
  keywords: ['bagasje', 'håndbagasje', 'bagasjegrenser', 'flyselskap', 'kabinbagasje'],
  alternates: { canonical: '/calculators/travel/luggage-size' },
  openGraph: {
    title: 'Bagasjemål',
    description: 'Sjekk om bagasjen oppfyller mål- og vektgrensene hos SAS, Norwegian, Widerøe og andre flyselskaper',
    url: '/calculators/travel/luggage-size',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bagasjemål',
  description: 'Sjekk om bagasjen oppfyller mål- og vektgrensene hos SAS, Norwegian, Widerøe og andre flyselskaper',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg type bagasje', text: 'Velg håndbagasje, innsjekket bagasje eller liten veske/sekk.' },
  { name: 'Mål bagasjen', text: 'Oppgi lengde, bredde og høyde i centimeter, og vekten i kilo.' },
  { name: 'Velg flyselskap', text: 'Se alle flyselskapene samtidig, eller velg ett.' },
  { name: 'Les resultatet', text: 'Se hvilke flyselskaper bagasjen passer hos, og hva som eventuelt er over grensen.' },
];

const faqs = [
  { question: 'Er grensene alltid riktige?', answer: 'De er veiledende og kan endres. Grensene varierer også med billettype og rute, så kontroller alltid hos flyselskapet før du reiser.' },
  { question: 'Må jeg måle med hjul og håndtak?', answer: 'Ja. Mål ytterst, inkludert hjul, håndtak og utvendige lommer, slik flyselskapene gjør.' },
  { question: 'Hva er forskjellen på håndbagasje og liten veske?', answer: 'Håndbagasje er en koffert eller bag som går i hyllen over setene. Liten veske eller sekk skal ligge under setet foran deg, og er ofte det eneste som er inkludert på de billigste billettene.' },
  { question: 'Hva skjer hvis bagasjen er for stor eller for tung?', answer: 'Du må ofte betale et tillegg ved gate eller innsjekking, og det er vanligvis dyrere enn å bestille riktig bagasje på forhånd.' },
];

const relatedTools = [
  { href: '/calculators/travel/packing-list', title: 'Pakkeliste', description: 'Lag en tilpasset pakkeliste ut fra reisemål, vær og varighet' },
  { href: '/calculators/travel/flight-duration', title: 'Flytid', description: 'Anslå flytid og avstand mellom norske og store internasjonale flyplasser' },
];

export default function LuggageSizePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="luggage-size"
          title="Bagasjemål"
          description="Sjekk om bagasjen oppfyller mål- og vektgrensene hos SAS, Norwegian, Widerøe og andre flyselskaper. Gratis og uten registrering."
        />

        <section aria-label="Bagasjemål">
          <LuggageSizeChecker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
