import { Metadata } from 'next';
import { BusinessDaysCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { getNorwegianHolidays } from '@/lib/calculations/time/norwegian-holidays';

const YEAR_A = 2026;
const YEAR_B = 2027;
const holidaysA = getNorwegianHolidays(YEAR_A);
const holidaysB = getNorwegianHolidays(YEAR_B);
const fmt = (d: Date) => d.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'long' });

export const metadata: Metadata = {
  title: 'Virkedager – gratis kalkulator på nett',
  description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager. Gratis og uten registrering.',
  keywords: ['virkedager', 'arbeidsdager', 'helligdager', 'helg', 'fristberegning'],
  alternates: { canonical: '/calculators/time/business-days-calculator' },
  openGraph: {
    title: 'Virkedager',
    description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager',
    url: '/calculators/time/business-days-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Virkedager',
  description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg beregning', text: 'Finn antall virkedager mellom to datoer, eller legg et antall virkedager til en dato.' },
  { name: 'Fyll inn datoene', text: 'Skriv inn start- og sluttdato, eller startdato og antall virkedager.' },
  { name: 'Trekk fra helligdager', text: 'Kryss av for å trekke fra norske helligdager, som påske, 1. mai, 17. mai, pinse og jul.' },
  { name: 'Les resultatet', text: 'Se antall virkedager, helgedager og helligdager i perioden.' },
];

const faqs = [
  { question: 'Hvilke dager regnes som virkedager?', answer: 'Mandag til fredag, unntatt helligdager. Lørdag og søndag regnes ikke som virkedager i denne kalkulatoren.' },
  { question: 'Hvilke norske helligdager er med?', answer: 'Nyttårsdag, skjærtorsdag, langfredag, første og andre påskedag, 1. mai, 17. mai, Kristi himmelfartsdag, første og andre pinsedag, første og andre juledag.' },
  { question: 'Er julaften og nyttårsaften med?', answer: 'Nei, de er ikke offisielle fridager, men mange har fri. Beregn selv om du vil regne dem med.' },
  { question: 'Regnes lørdag som virkedag i fristberegning?', answer: 'Ofte ikke, men det avhenger av avtalen eller loven. Ved lovfastsatte frister gjelder egne regler, så sjekk kilden.' },
];

const relatedTools = [
  { href: '/calculators/time/week-number-calculator', title: 'Ukenummer', description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer' },
  { href: '/calculators/time/precise-age-calculator', title: 'Nøyaktig alder', description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag' },
  { href: '/calculators/time/time-duration-calculator', title: 'Tidsregning', description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett' },
];

export default function BusinessDaysCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="business-days-calculator"
          title="Virkedager"
          description="Regn ut antall virkedager mellom to datoer, eller legg virkedager til en dato. Tar hensyn til norske helligdager. Gratis og uten registrering."
          colorClass="bg-blue-100 text-blue-600"
        />

        <section aria-label="Virkedager">
          <BusinessDaysCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Norske helligdager</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Helligdag</th>
                  <th className="text-left py-2 px-3">{YEAR_A}</th>
                  <th className="text-left py-2 px-3">{YEAR_B}</th>
                </tr>
              </thead>
              <tbody>
                {holidaysA.map((h, i) => (
                  <tr key={h.name} className={i < holidaysA.length - 1 ? 'border-b' : ''}>
                    <td className="py-2 px-3">{h.name}</td>
                    <td className="py-2 px-3">{fmt(h.date)}</td>
                    <td className="py-2 px-3">{fmt(holidaysB[i].date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              Helligdager som faller på en lørdag eller søndag, flyttes ikke til en virkedag i Norge.
            </p>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
