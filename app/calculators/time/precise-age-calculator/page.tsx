import { Metadata } from 'next';
import { PreciseAgeCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Nøyaktig alder – gratis kalkulator på nett',
  description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag. Gratis og uten registrering.',
  keywords: ['alder', 'nøyaktig alder', 'bursdag', 'hvor gammel er jeg'],
  alternates: { canonical: '/calculators/time/precise-age-calculator' },
  openGraph: {
    title: 'Nøyaktig alder',
    description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag',
    url: '/calculators/time/precise-age-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Nøyaktig alder',
  description: 'Regn ut alder i år, måneder, dager, timer og sekunder, og dager til neste bursdag',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn fødselsdato', text: 'Velg dato, og eventuelt klokkeslett.' },
  { name: 'Les alderen', text: 'Se alderen oppdatert hvert sekund.' },
  { name: 'Se mer', text: 'Dager levd, ukedag du er født på, stjernetegn og dager til neste bursdag.' },
];

const faqs = [
  { question: 'Hvordan regnes alderen ut?', answer: 'Kalkulatoren teller hele år og måneder fra fødselsdatoen og viser resten som dager, timer, minutter og sekunder.' },
  { question: 'Hva med skuddår?', answer: 'De er tatt hensyn til. Skuddagen 29. februar telles som en vanlig dag.' },
  { question: 'Hvilket klokkeslett brukes?', answer: 'Hvis du ikke oppgir fødselstidspunkt, regnes det fra midnatt den dagen.' },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Virkedager', description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager' },
  { href: '/calculators/time/week-number-calculator', title: 'Ukenummer', description: 'Finn ISO-ukenummer for en dato, eller datoene for et ukenummer' },
  { href: '/calculators/time/time-duration-calculator', title: 'Tidsregning', description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett' },
];

export default function PreciseAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="precise-age-calculator"
          title="Nøyaktig alder"
          description="Regn ut din nøyaktige alder i år, måneder, dager, timer, minutter og sekunder. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Nøyaktig alder">
          <PreciseAgeCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Alder i dager og timer</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Alder</th>
                  <th className="text-right py-2 px-3">Dager</th>
                  <th className="text-right py-2 px-3">Timer</th>
                  <th className="text-right py-2 px-3">Hjerteslag*</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">1 år</td><td className="text-right py-2 px-3">365</td><td className="text-right py-2 px-3">8 760</td><td className="text-right py-2 px-3">ca. 42 millioner</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">10 år</td><td className="text-right py-2 px-3">3 652</td><td className="text-right py-2 px-3">87 648</td><td className="text-right py-2 px-3">ca. 420 millioner</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">18 år</td><td className="text-right py-2 px-3">6 574</td><td className="text-right py-2 px-3">157 776</td><td className="text-right py-2 px-3">ca. 756 millioner</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">30 år</td><td className="text-right py-2 px-3">10 957</td><td className="text-right py-2 px-3">262 968</td><td className="text-right py-2 px-3">ca. 1,26 milliarder</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">50 år</td><td className="text-right py-2 px-3">18 262</td><td className="text-right py-2 px-3">438 288</td><td className="text-right py-2 px-3">ca. 2,1 milliarder</td></tr>
                <tr><td className="text-left py-2 px-3">80 år</td><td className="text-right py-2 px-3">29 220</td><td className="text-right py-2 px-3">701 280</td><td className="text-right py-2 px-3">ca. 3,36 milliarder</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">* Anslått med gjennomsnittlig puls på 80 slag i minuttet</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Stjernetegn</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-muted/50 rounded">♈ Væren: 21. mars – 19. april</div>
            <div className="p-2 bg-muted/50 rounded">♉ Tyren: 20. april – 20. mai</div>
            <div className="p-2 bg-muted/50 rounded">♊ Tvillingene: 21. mai – 20. juni</div>
            <div className="p-2 bg-muted/50 rounded">♋ Krepsen: 21. juni – 22. juli</div>
            <div className="p-2 bg-muted/50 rounded">♌ Løven: 23. juli – 22. august</div>
            <div className="p-2 bg-muted/50 rounded">♍ Jomfruen: 23. august – 22. september</div>
            <div className="p-2 bg-muted/50 rounded">♎ Vekten: 23. september – 22. oktober</div>
            <div className="p-2 bg-muted/50 rounded">♏ Skorpionen: 23. oktober – 21. november</div>
            <div className="p-2 bg-muted/50 rounded">♐ Skytten: 22. november – 21. desember</div>
            <div className="p-2 bg-muted/50 rounded">♑ Steinbukken: 22. desember – 19. januar</div>
            <div className="p-2 bg-muted/50 rounded">♒ Vannmannen: 20. januar – 18. februar</div>
            <div className="p-2 bg-muted/50 rounded">♓ Fiskene: 19. februar – 20. mars</div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
