import { Metadata } from 'next';
import { TimeDurationCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidsregning – gratis kalkulator på nett',
  description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett. Gratis og uten registrering.',
  keywords: ['tidsregning', 'legg til tid', 'trekk fra tid', 'varighet', 'timer og minutter'],
  alternates: { canonical: '/calculators/time/time-duration-calculator' },
  openGraph: {
    title: 'Tidsregning',
    description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett',
    url: '/calculators/time/time-duration-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidsregning',
  description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg beregning', text: 'Legg sammen, trekk fra eller finn tiden mellom to klokkeslett.' },
  { name: 'Fyll inn tidsrommene', text: 'Oppgi dager, timer, minutter og sekunder.' },
  { name: 'Les resultatet', text: 'Se summen fordelt på dager, timer, minutter og sekunder, og som totaler.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut arbeidstimer?', answer: 'Velg tid mellom to klokkeslett, oppgi start og slutt, og trekk fra pausen ved å legge til et tidsrom.' },
  { question: 'Går klokkeslettene over midnatt?', answer: 'Ja, hvis sluttidspunktet er før starttidspunktet regnes det som dagen etter.' },
  { question: 'Kan jeg få svaret i desimaler?', answer: 'Resultatet vises også som totalt antall timer, som du kan bruke direkte i timelister.' },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Virkedager', description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager' },
  { href: '/calculators/time/precise-age-calculator', title: 'Nøyaktig alder', description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag' },
];

export default function TimeDurationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="time-duration-calculator"
          title="Tidsregning"
          description="Legg sammen eller trekk fra tidsrom, eller regn ut tiden mellom to klokkeslett. Gratis og uten registrering."
          colorClass="bg-blue-100 text-blue-600"
        />

        <section aria-label="Tidsregning">
          <TimeDurationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Omregning mellom tidsenheter</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Enhet</th>
                  <th className="text-right py-2 px-3">Sekunder</th>
                  <th className="text-right py-2 px-3">Minutter</th>
                  <th className="text-right py-2 px-3">Timer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">1 minutt</td><td className="text-right py-2 px-3">60</td><td className="text-right py-2 px-3">1</td><td className="text-right py-2 px-3">0,0167</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 time</td><td className="text-right py-2 px-3">3 600</td><td className="text-right py-2 px-3">60</td><td className="text-right py-2 px-3">1</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 døgn</td><td className="text-right py-2 px-3">86 400</td><td className="text-right py-2 px-3">1 440</td><td className="text-right py-2 px-3">24</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 uke</td><td className="text-right py-2 px-3">604 800</td><td className="text-right py-2 px-3">10 080</td><td className="text-right py-2 px-3">168</td></tr>
                <tr><td className="text-left py-2 px-3">1 år (365 dager)</td><td className="text-right py-2 px-3">31 536 000</td><td className="text-right py-2 px-3">525 600</td><td className="text-right py-2 px-3">8 760</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
