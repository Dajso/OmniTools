import { Metadata } from 'next';
import { WeekNumberCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ukenummer – gratis kalkulator på nett',
  description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer. Gratis og uten registrering.',
  keywords: ['ukenummer', 'uke', 'ISO-uke', 'kalenderuke', 'dag i året'],
  alternates: { canonical: '/calculators/time/week-number-calculator' },
  openGraph: {
    title: 'Ukenummer',
    description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer',
    url: '/calculators/time/week-number-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ukenummer',
  description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg beregning', text: 'Finn ukenummer for en dato, eller datoene for et ukenummer.' },
  { name: 'Velg dato eller uke', text: 'Skriv inn datoen, eller år og ukenummer.' },
  { name: 'Les resultatet', text: 'Se ukenummer, ukedag, kvartal og første og siste dag i uken.' },
];

const faqs = [
  { question: 'Hvordan telles uker i Norge?', answer: 'Norge bruker ISO 8601: uke 1 er uken som inneholder årets første torsdag, og uken starter på mandag.' },
  { question: 'Kan uke 53 forekomme?', answer: 'Ja, noen år har 53 uker. Da inneholder den siste uken fortsatt dager fra januar året etter, eller omvendt.' },
  { question: 'Hvorfor kan 1. januar være i uke 52 eller 53?', answer: 'Fordi uke 1 er den første uken med minst fire dager i det nye året.' },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Virkedager', description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager' },
  { href: '/calculators/time/calendar-generator', title: 'Kalender til utskrift', description: 'Lag månedskalendere og årskalendere med norske ukenummer og helligdager, som PDF' },
  { href: '/calculators/time/precise-age-calculator', title: 'Nøyaktig alder', description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag' },
];

export default function WeekNumberCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="week-number-calculator"
          title="Ukenummer"
          description="Finn ISO-ukenummer for en dato, eller finn datoene for et bestemt ukenummer. Gratis og uten registrering."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Ukenummer">
          <WeekNumberCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Ukenummer gjennom året</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Måned</th>
                  <th className="text-center py-2 px-3">Typiske uker</th>
                  <th className="text-center py-2 px-3">Kvartal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">Januar</td><td className="text-center py-2 px-3">1–5</td><td className="text-center py-2 px-3">K1</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Februar</td><td className="text-center py-2 px-3">5–9</td><td className="text-center py-2 px-3">K1</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Mars</td><td className="text-center py-2 px-3">9–13</td><td className="text-center py-2 px-3">K1</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">April</td><td className="text-center py-2 px-3">13–18</td><td className="text-center py-2 px-3">K2</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Mai</td><td className="text-center py-2 px-3">18–22</td><td className="text-center py-2 px-3">K2</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Juni</td><td className="text-center py-2 px-3">22–26</td><td className="text-center py-2 px-3">K2</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Juli</td><td className="text-center py-2 px-3">26–31</td><td className="text-center py-2 px-3">K3</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">August</td><td className="text-center py-2 px-3">31–35</td><td className="text-center py-2 px-3">K3</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">September</td><td className="text-center py-2 px-3">35–40</td><td className="text-center py-2 px-3">K3</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Oktober</td><td className="text-center py-2 px-3">40–44</td><td className="text-center py-2 px-3">K4</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">November</td><td className="text-center py-2 px-3">44–48</td><td className="text-center py-2 px-3">K4</td></tr>
                <tr><td className="text-left py-2 px-3">Desember</td><td className="text-center py-2 px-3">48–52/53</td><td className="text-center py-2 px-3">K4</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">* Ukenummer varierer litt fra år til år avhengig av hvordan dagene faller</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">År med 53 uker</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Disse årene har 53 ISO-uker i stedet for 52:
          </p>
          <div className="flex flex-wrap gap-2">
            {[2004, 2009, 2015, 2020, 2026, 2032, 2037, 2043, 2048].map((year) => (
              <span key={year} className="px-3 py-1 bg-muted rounded-full text-sm">
                {year}
              </span>
            ))}
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
