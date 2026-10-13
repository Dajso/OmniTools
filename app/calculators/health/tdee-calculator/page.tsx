import { Metadata } from 'next';
import { TDEECalculator } from '@/components/calculators/health';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Kalorikalkulator (TDEE) – gratis kalkulator på nett',
  description: 'Beregn hvor mange kalorier du forbruker per dag. Gratis og uten registrering.',
  keywords: ['TDEE', 'kalorikalkulator', 'energiforbruk', 'forbrenning', 'kaloribehov'],
  alternates: { canonical: '/calculators/health/tdee-calculator' },
  openGraph: {
    title: 'Kalorikalkulator (TDEE)',
    description: 'Beregn hvor mange kalorier du forbruker per dag',
    url: '/calculators/health/tdee-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kalorikalkulator (TDEE)',
  description: 'Beregn hvor mange kalorier du forbruker per dag',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi alder, kjønn, vekt og høyde', text: 'Bruk kilo og centimeter.' },
  { name: 'Velg aktivitetsnivå', text: 'Velg det som passer best for en vanlig uke.' },
  { name: 'Les resultatet', text: 'Se hvilepuls-forbrenning (BMR), totalt forbruk (TDEE) og kaloribehov etter mål.' },
];

const faqs = [
  { question: 'Hva er BMR og TDEE?', answer: 'BMR er kaloriene kroppen forbrenner i hvile. TDEE er totalt kaloriforbruk per dag, og regnes ut ved å gange BMR med en aktivitetsfaktor.' },
  { question: 'Hvilken formel brukes?', answer: 'Kalkulatoren bruker Mifflin-St Jeor-formelen, som regnes som en av de mest treffsikre for voksne.' },
  { question: 'Hvor mange kalorier trenger jeg for å gå ned i vekt?', answer: 'Et underskudd på ca. 500 kcal per dag gir omtrent 0,45 kg i uken. Gå ikke svært langt under BMR uten oppfølging fra helsepersonell.' },
  { question: 'Er kalorier det samme som kcal?', answer: 'Ja. På norske matvarer står energi oppgitt i kilokalorier (kcal) og kilojoule (kJ). 1 kcal er cirka 4,2 kJ.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
  { href: '/calculators/health/macro-calculator', title: 'Makrokalkulator', description: 'Beregn daglig behov for protein, karbohydrater og fett' },
];

const activityLevels = [
  { level: 'Stillesittende', description: 'Lite eller ingen trening, kontorjobb', multiplier: '1,2' },
  { level: 'Lett aktiv', description: 'Lett trening 1–3 dager i uken', multiplier: '1,375' },
  { level: 'Moderat aktiv', description: 'Trening 3–5 dager i uken', multiplier: '1,55' },
  { level: 'Svært aktiv', description: 'Hard trening 6–7 dager i uken', multiplier: '1,725' },
  { level: 'Ekstremt aktiv', description: 'Svært hard trening eller fysisk tungt arbeid', multiplier: '1,9' },
];

export default function TDEECalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tdee-calculator"
          title="Kalorikalkulator (TDEE)"
          description="Regn ut hvor mange kilokalorier du forbrenner per dag, og hvor mye du bør spise for å gå ned, holde eller øke vekten. Gratis og uten registrering."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="Kalorikalkulator (TDEE)">
          <TDEECalculator />
        </section>

        {/* Aktivitetsnivåer */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Aktivitetsnivåer</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Nivå</th>
                      <th className="text-left py-3 px-4 font-medium">Beskrivelse</th>
                      <th className="text-left py-3 px-4 font-medium">Faktor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLevels.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.level}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{item.description}</td>
                        <td className="py-3 px-4 font-mono text-sm">BMR × {item.multiplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
