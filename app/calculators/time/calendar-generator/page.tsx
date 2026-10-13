import { Metadata } from 'next';
import { CalendarGenerator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kalender til utskrift – gratis kalkulator på nett',
  description: 'Lag månedskalendere og årskalendere med norske ukenummer og helligdager, som PDF. Gratis og uten registrering.',
  keywords: ['kalender', 'utskriftskalender', 'PDF-kalender', 'årskalender', 'månedskalender'],
  alternates: { canonical: '/calculators/time/calendar-generator' },
  openGraph: {
    title: 'Kalender til utskrift',
    description: 'Lag månedskalendere og årskalendere med norske ukenummer og helligdager, som PDF',
    url: '/calculators/time/calendar-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kalender til utskrift',
  description: 'Lag månedskalendere og årskalendere med norske ukenummer og helligdager, som PDF',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg år og måned', text: 'Velg hele året eller en bestemt måned.' },
  { name: 'Velg innstillinger', text: 'La uken starte på mandag, og marker helligdager.' },
  { name: 'Last ned', text: 'Trykk «Last ned PDF» og skriv ut på A4 i liggende format.' },
];

const faqs = [
  { question: 'Hvilke helligdager er med?', answer: 'Alle offentlige norske helligdager, også de bevegelige rundt påske og pinse.' },
  { question: 'Kan jeg skrive ut hele året?', answer: 'Ja, PDF-en får én side per måned.' },
  { question: 'Er ukenummer med?', answer: 'Ikke i denne versjonen. Bruk ukenummer-kalkulatoren hvis du trenger å slå dem opp.' },
];

const relatedTools = [
  { href: '/calculators/time/week-number-calculator', title: 'Ukenummer', description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer' },
  { href: '/calculators/time/business-days-calculator', title: 'Virkedager', description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager' },
];

export default function CalendarGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="calendar-generator"
          title="Kalender til utskrift"
          description="Lag kalender til utskrift som PDF, for hele året eller en måned, med norske helligdager og uken fra mandag. Gratis og uten registrering."
          colorClass="bg-orange-100 text-orange-600"
        />

        <section aria-label="Kalender til utskrift">
          <CalendarGenerator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Funksjoner</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">📅 Månedsvisning</h3>
              <p className="text-sm text-muted-foreground">Hver måned vises med seks uker slik at alle dager er synlige, også når måneden går over flere uker.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🖨️ PDF klar til utskrift</h3>
              <p className="text-sm text-muted-foreground">PDF-en er laget for utskrift på A4 i liggende format, med ryddig oppsett og passe marger.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🌍 Ukene starter på mandag</h3>
              <p className="text-sm text-muted-foreground">Uken starter på mandag, slik det er vanlig i Norge og i ISO 8601. Du kan velge søndag hvis du foretrekker det.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🎉 Norske helligdager</h3>
              <p className="text-sm text-muted-foreground">Offentlige helligdager, også de bevegelige rundt påske og pinse, er markert i rødt.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Kommende år</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">År</th>
                  <th className="text-center py-2 px-3">Skuddår</th>
                  <th className="text-center py-2 px-3">1. januar er en</th>
                  <th className="text-center py-2 px-3">Uker</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">2026</td><td className="text-center py-2 px-3">Nei</td><td className="text-center py-2 px-3">torsdag</td><td className="text-center py-2 px-3">53</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">2027</td><td className="text-center py-2 px-3">Nei</td><td className="text-center py-2 px-3">fredag</td><td className="text-center py-2 px-3">52</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">2028</td><td className="text-center py-2 px-3">Ja</td><td className="text-center py-2 px-3">lørdag</td><td className="text-center py-2 px-3">52</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">2029</td><td className="text-center py-2 px-3">Nei</td><td className="text-center py-2 px-3">mandag</td><td className="text-center py-2 px-3">52</td></tr>
                <tr><td className="text-left py-2 px-3">2030</td><td className="text-center py-2 px-3">Nei</td><td className="text-center py-2 px-3">tirsdag</td><td className="text-center py-2 px-3">52</td></tr>
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
