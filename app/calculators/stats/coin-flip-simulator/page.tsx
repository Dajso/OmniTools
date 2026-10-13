import { Metadata } from 'next';
import { CoinFlipSimulator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Myntkast – gratis kalkulator på nett',
  description: 'Kast mynt og se fordelingen av kron og mynt. Gratis og uten registrering.',
  keywords: ['myntkast', 'kron og mynt', 'sannsynlighet', 'tilfeldig', 'store talls lov'],
  alternates: { canonical: '/calculators/stats/coin-flip-simulator' },
  openGraph: {
    title: 'Myntkast',
    description: 'Kast mynt og se fordelingen av kron og mynt',
    url: '/calculators/stats/coin-flip-simulator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Myntkast',
  description: 'Kast mynt og se fordelingen av kron og mynt',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg antall kast', text: 'Velg hvor mange ganger mynten skal kastes.' },
  { name: 'Kast mynten', text: 'Trykk på knappen for å simulere kastene.' },
  { name: 'Se fordelingen', text: 'Se antall kron og mynt, avvik og de siste kastene.' },
];

const faqs = [
  { question: 'Er myntkastet virkelig tilfeldig?', answer: 'Simuleringen bruker datamaskinens tilfeldighetsgenerator, som er god nok til lek og undervisning, men ikke til sikkerhetsformål.' },
  { question: 'Hvorfor blir det sjelden akkurat 50/50?', answer: 'Fordi tilfeldigheter gir avvik. Jo flere kast, desto nærmere 50 % kommer andelen, men differansen i antall kan fortsatt vokse.' },
  { question: 'Hva er «gamblers fallacy»?', answer: 'Troen på at mynten «har skylden» etter en rekke kron. Hvert kast er uavhengig av de forrige.' },
];

const relatedTools = [
  { href: '/calculators/stats/dice-probability-calculator', title: 'Terningsannsynlighet', description: 'Regn ut sannsynligheten for bestemte summer med flere terninger' },
  { href: '/calculators/productivity/random-number-generator', title: 'Tilfeldig tallgenerator', description: 'Trekk tilfeldige tall innenfor et intervall' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
];

export default function CoinFlipSimulatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="coin-flip-simulator"
          title="Myntkast"
          description="Simuler myntkast og se fordelingen av kron og mynt, med avvik fra forventet 50/50. Gratis og uten registrering."
          colorClass="bg-yellow-100 text-yellow-600"
        />

        <section aria-label="Myntkast">
          <CoinFlipSimulator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Sannsynlighet i praksis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🎲 Uavhengige hendelser</h3>
              <p className="text-sm text-muted-foreground">Hvert myntkast er uavhengig av de forrige. Fem kron på rad gjør ikke mynt mer sannsynlig i neste kast.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">📊 De store talls lov</h3>
              <p className="text-sm text-muted-foreground">Jo flere kast, desto nærmere 50 % kommer andelen kron. Prøv 10 kast mot 10 000 kast og se forskjellen.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🔔 Normalfordeling</h3>
              <p className="text-sm text-muted-foreground">Ved mange kast følger antall kron en klokkekurve rundt halvparten av kastene.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">⚖️ Forventningsverdi</h3>
              <p className="text-sm text-muted-foreground">Forventet antall kron er alltid n/2, der n er antall kast. Ved 100 kast er snittet 50 kron.</p>
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
