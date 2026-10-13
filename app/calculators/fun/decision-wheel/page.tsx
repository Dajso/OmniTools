import { Metadata } from 'next';
import { DecisionWheel } from '@/components/calculators/fun/decision-wheel';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Avgjørelseshjul – gratis kalkulator på nett',
  description: 'Spinn hjulet og la tilfeldighetene bestemme. Gratis og uten registrering.',
  keywords: ['avgjørelseshjul', 'lykkehjul', 'tilfeldig valg', 'trekning'],
  alternates: { canonical: '/calculators/fun/decision-wheel' },
  openGraph: {
    title: 'Avgjørelseshjul',
    description: 'Spinn hjulet og la tilfeldighetene bestemme',
    url: '/calculators/fun/decision-wheel',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Avgjørelseshjul',
  description: 'Spinn hjulet og la tilfeldighetene bestemme',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn alternativer', text: 'Skriv inn valgene dine, eller velg en ferdig liste.' },
  { name: 'Snurr hjulet', text: 'Trykk på knappen og vent til hjulet stopper.' },
  { name: 'Se valget', text: 'Resultatet vises under hjulet.' },
];

const faqs = [
  { question: 'Er valget tilfeldig?', answer: 'Ja, hvert alternativ har samme sjanse hver gang.' },
  { question: 'Hvor mange alternativer bør jeg ha?', answer: 'Hjulet er mest lesbart med under 12 alternativer.' },
  { question: 'Kan jeg bruke egne lister?', answer: 'Ja, skriv inn dine egne alternativer eller bruk en av de ferdige listene.' },
  { question: 'Lagres listene mine?', answer: 'Nei, alt skjer i nettleseren din.' },
];

const relatedTools = [
  { href: '/calculators/productivity/random-number-generator', title: 'Tilfeldig tallgenerator', description: 'Trekk tilfeldige tall innenfor et intervall' },
  { href: '/calculators/fun/love-compatibility', title: 'Kjærlighetstest', description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi' },
];

export default function DecisionWheelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="decision-wheel"
          title="Avgjørelseshjul"
          description="La et lykkehjul velge for deg. Legg inn alternativene dine, snurr hjulet og få et tilfeldig valg. Gratis og uten registrering."
          colorClass="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600"
        />

        <section aria-label="Avgjørelseshjul" className="bg-card rounded-lg border p-6">
          <DecisionWheel />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Når passer et lykkehjul?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🍕</span> Hva skal vi spise?
              </h3>
              <p className="text-sm text-muted-foreground">
                Klarer dere ikke å bestemme hva dere skal spise? Legg inn favorittrestaurantene eller yndlingsrettene, og la hjulet velge middag.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🎮</span> Spillkveld
              </h3>
              <p className="text-sm text-muted-foreground">
                Velg hvilket spill dere skal spille, hvem som begynner, eller avgjør uenigheter med et rettferdig spinn.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🎁</span> Konkurranser og trekninger
              </h3>
              <p className="text-sm text-muted-foreground">
                Passer til tilfeldige uttrekk i konkurranser og lotterier, og til å velge vinnere på en rettferdig måte.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🤔</span> Når du står fast
              </h3>
              <p className="text-sm text-muted-foreground">
                Når du står mellom flere alternativer og ikke klarer å velge, kan tilfeldighetene avgjøre.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Hvis du ikke blir fornøyd med resultatet, sier det noe om hva du egentlig ønsker.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Bruk «best av tre» ved viktige valg hvis du vil føle deg tryggere.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Legg inn et «wildcard»-alternativ for spontane overraskelser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Hjulet fungerer fint i klasserommet og til teambygging.</span>
              </li>
            </ul>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
