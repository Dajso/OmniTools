import { Metadata } from 'next';
import { BreathingBubble } from '@/components/calculators/fun/breathing-bubble';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pustebobler – gratis kalkulator på nett',
  description: 'Rolig ned med guidede pusteøvelser, blant annet 4-7-8 og boksåndedrett. Gratis og uten registrering.',
  keywords: ['pusteøvelse', 'stressmestring', 'angst', '4-7-8', 'boksåndedrett', 'avspenning'],
  alternates: { canonical: '/calculators/fun/breathing-bubble' },
  openGraph: {
    title: 'Pustebobler',
    description: 'Rolig ned med guidede pusteøvelser, blant annet 4-7-8 og boksåndedrett',
    url: '/calculators/fun/breathing-bubble',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pustebobler',
  description: 'Rolig ned med guidede pusteøvelser, blant annet 4-7-8 og boksåndedrett',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg pusteøvelse', text: 'Hver øvelse har egne tider for inn- og utpust.' },
  { name: 'Trykk start', text: 'Følg boblen: pust inn når den vokser og ut når den krymper.' },
  { name: 'Fortsett så lenge du vil', text: 'Noen minutter kan være nok for å merke ro.' },
];

const faqs = [
  { question: 'Hva er boksepust?', answer: 'Fire like deler: inn, hold, ut, hold, her 4 sekunder hver.' },
  { question: 'Hva er 4-7-8?', answer: 'Pust inn i 4 sekunder, hold i 7 og pust ut i 8. Mange bruker det for å roe ned før søvn.' },
  { question: 'Er dette medisinsk behandling?', answer: 'Nei. Det er en enkel avspenningsøvelse. Har du helseplager, snakk med fastlegen din.' },
  { question: 'Hvilken pusteøvelse bør jeg velge?', answer: 'Prøv 4-7-8 for å roe ned, boksepust for fokus og den korte 4-4-øvelsen når du trenger energi. Gjør det du er komfortabel med.' },
];

const relatedTools = [
  { href: '/calculators/fun/biorhythm', title: 'Biorytme', description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato' },
  { href: '/calculators/health/sleep-cycle-calculator', title: 'Søvnsyklus-kalkulator', description: 'Finn de beste tidspunktene for leggetid og oppvåkning ut fra søvnsykluser' },
  { href: '/calculators/academic/pomodoro-timer', title: 'Pomodoro-timer', description: 'Studietimer med tilpassbare arbeids- og pauseintervaller' },
];

export default function BreathingBubblePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="breathing-bubble"
          title="Pustebobler"
          description="Pust sammen med en animert boble. Velg mellom 4-7-8, boksepust og flere andre øvelser for å senke skuldrene. Gratis og uten registrering."
          colorClass="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-600"
        />

        <section aria-label="Pustebobler" className="bg-card rounded-lg border p-6">
          <BreathingBubble />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hva skjer når du puster rolig?</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Rolige pusteøvelser aktiverer det parasympatiske nervesystemet, som er kroppens «hvile og fordøye»-modus og motvirker stress. Dette kan skje i kroppen:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>❤️</span> Puls
                </h3>
                <p className="text-sm text-muted-foreground">
                  Langsomme, dype pust kan senke pulsen og blodtrykket.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>🧠</span> Hjerneaktivitet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fokusert pust er knyttet til alfabølger i hjernen, som hører sammen med rolig våkenhet.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>💪</span> Muskelspenning
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dype utpust kan hjelpe kroppen å slippe spenninger.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Når kan du bruke pusteøvelser?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">🌅 Morgenrutine</h3>
              <p className="text-sm text-blue-600">
                Start dagen med energigivende pust for å vekke kropp og hode.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700 mb-2">😰 Stressende øyeblikk</h3>
              <p className="text-sm text-purple-600">
                Bruk rolige pust før presentasjoner, intervjuer eller vanskelige samtaler.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">🌙 Før leggetid</h3>
              <p className="text-sm text-green-600">
                Mange bruker 4-7-8-teknikken for å roe ned før søvn.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h3 className="font-medium text-orange-700 mb-2">💼 Pauser på jobben</h3>
              <p className="text-sm text-orange-600">
                Ta pustepauser for å nullstille fokuset i løpet av arbeidsdagen.
              </p>
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
