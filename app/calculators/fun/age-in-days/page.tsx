import { Metadata } from 'next';
import { AgeInDaysCalculator } from '@/components/calculators/fun/age-in-days-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Alder i dager – gratis kalkulator på nett',
  description: 'Regn ut din eksakte alder i dager, timer, minutter og sekunder. Gratis og uten registrering.',
  keywords: ['alder i dager', 'dager gammel', 'sekunder gammel', 'bursdag'],
  alternates: { canonical: '/calculators/fun/age-in-days' },
  openGraph: {
    title: 'Alder i dager',
    description: 'Regn ut din eksakte alder i dager, timer, minutter og sekunder',
    url: '/calculators/fun/age-in-days',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Alder i dager',
  description: 'Regn ut din eksakte alder i dager, timer, minutter og sekunder',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg fødselsdato', text: 'Du kan også oppgi klokkeslett for et mer nøyaktig svar.' },
  { name: 'Trykk på regn ut', text: 'Du får alderen i flere enheter.' },
  { name: 'Se neste bursdag', text: 'Antall dager til og ukedagen vises.' },
];

const faqs = [
  { question: 'Tar kalkulatoren hensyn til skuddår?', answer: 'Ja. Dagene telles på kalenderen, så skuddager er med.' },
  { question: 'Hvorfor gir klokkeslett et mer nøyaktig svar?', answer: 'Timer, minutter og sekunder avhenger av når på dagen du ble født.' },
  { question: 'Hvilken tidssone brukes?', answer: 'Nettleserens lokale tid, vanligvis norsk tid.' },
];

const relatedTools = [
  { href: '/calculators/fun/day-of-week', title: 'Ukedag for en dato', description: 'Finn ut hvilken ukedag en dato faller på' },
  { href: '/calculators/fun/biorhythm', title: 'Biorytme', description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato' },
  { href: '/calculators/productivity/age-calculator', title: 'Alderskalkulator', description: 'Regn ut nøyaktig alder ut fra fødselsdato' },
];

export default function AgeInDaysPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="age-in-days"
          title="Alder i dager"
          description="Regn ut hvor gammel du er i år, måneder, dager, timer, minutter og sekunder, og se hvor lenge det er til neste bursdag. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Alder i dager">
          <AgeInDaysCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Morsomme milepæler</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { days: '1 000', age: 'ca. 2,7 år' },
                { days: '5 000', age: 'ca. 13,7 år' },
                { days: '10 000', age: 'ca. 27,4 år' },
                { days: '15 000', age: 'ca. 41,1 år' },
                { days: '20 000', age: 'ca. 54,8 år' },
                { days: '25 000', age: 'ca. 68,5 år' },
              ].map(({ days, age }) => (
                <div key={days} className="text-center p-3 bg-background rounded-lg">
                  <span className="text-xl font-bold block">{days}</span>
                  <span className="text-sm text-muted-foreground">dager = {age}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              🎉 Feir dagsmilepælene dine! De er minst like spesielle som bursdager.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Visste du at …</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">💓 Hjertet ditt</h3>
              <p className="text-sm text-blue-600">
                Hjertet slår omtrent 100 000 ganger i døgnet, altså rundt 35 millioner ganger i året.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">🌬️ Pusten din</h3>
              <p className="text-sm text-green-600">
                Du puster rundt 20 000 ganger i døgnet og flytter titusenvis av liter luft.
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
