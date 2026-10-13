import { Metadata } from 'next';
import { TimeZoneDifferenceMap } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidsforskjell mellom byer – gratis kalkulator på nett',
  description: 'Sammenlign klokkeslett i ulike tidssoner visuelt. Gratis og uten registrering.',
  keywords: ['tidsforskjell', 'verdensklokke', 'tidssoner', 'internasjonal tid'],
  alternates: { canonical: '/calculators/time/timezone-difference-map' },
  openGraph: {
    title: 'Tidsforskjell mellom byer',
    description: 'Sammenlign klokkeslett i ulike tidssoner visuelt',
    url: '/calculators/time/timezone-difference-map',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidsforskjell mellom byer',
  description: 'Sammenlign klokkeslett i ulike tidssoner visuelt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg to byer', text: 'Velg byene du vil sammenligne.' },
  { name: 'Se klokkeslettet nå', text: 'Klokkene oppdateres hvert minutt.' },
  { name: 'Regn om et klokkeslett', text: 'Skriv inn et klokkeslett i den første byen og se hva klokka er i den andre.' },
];

const faqs = [
  { question: 'Hva er tidsforskjellen mellom Norge og USA?', answer: 'Norge er normalt 6 timer foran New York, men forskjellen kan variere noen uker i mars og oktober/november fordi sommertiden starter og slutter på ulike datoer.' },
  { question: 'Håndteres sommertid?', answer: 'Ja, kalkulatoren bruker faktiske tidssoner og tar hensyn til sommertid for den dagen du ser på.' },
  { question: 'Hvorfor er tidspunktet annerledes i kalenderen min?', answer: 'Sjekk at enheten din har riktig tidssone og at klokka går riktig.' },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Virkedager', description: 'Regn ut virkedager mellom to datoer, uten helger og norske helligdager' },
  { href: '/calculators/time/time-duration-calculator', title: 'Tidsregning', description: 'Legg til eller trekk fra tid, og finn forskjellen mellom klokkeslett' },
];

export default function TimeZoneDifferenceMapPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timezone-difference-map"
          title="Tidsforskjell mellom byer"
          description="Sammenlign klokkeslett og tidsforskjell mellom byer, med sommertid. Gratis og uten registrering."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Tidsforskjell mellom byer">
          <TimeZoneDifferenceMap />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Vanlige tidssoner sett fra Norge</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">By</th>
                  <th className="text-left py-2 px-3">Tidssone</th>
                  <th className="text-center py-2 px-3">Forskjell mot UTC</th>
                  <th className="text-center py-2 px-3">Forskjell mot Oslo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">Reykjavik</td><td className="text-left py-2 px-3">GMT</td><td className="text-center py-2 px-3">0:00</td><td className="text-center py-2 px-3">−1 time (−2 om sommeren)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">London</td><td className="text-left py-2 px-3">GMT/BST</td><td className="text-center py-2 px-3">0:00 / +1:00</td><td className="text-center py-2 px-3">−1 time</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Oslo</td><td className="text-left py-2 px-3">CET/CEST</td><td className="text-center py-2 px-3">+1:00 / +2:00</td><td className="text-center py-2 px-3">0</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Helsingfors</td><td className="text-left py-2 px-3">EET/EEST</td><td className="text-center py-2 px-3">+2:00 / +3:00</td><td className="text-center py-2 px-3">+1 time</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Dubai</td><td className="text-left py-2 px-3">GST</td><td className="text-center py-2 px-3">+4:00</td><td className="text-center py-2 px-3">+3 (+2 om sommeren)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Mumbai</td><td className="text-left py-2 px-3">IST</td><td className="text-center py-2 px-3">+5:30</td><td className="text-center py-2 px-3">+4:30 (+3:30 om sommeren)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Tokyo</td><td className="text-left py-2 px-3">JST</td><td className="text-center py-2 px-3">+9:00</td><td className="text-center py-2 px-3">+8 (+7 om sommeren)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">New York</td><td className="text-left py-2 px-3">EST/EDT</td><td className="text-center py-2 px-3">−5:00 / −4:00</td><td className="text-center py-2 px-3">−6 timer</td></tr>
                <tr><td className="text-left py-2 px-3">Los Angeles</td><td className="text-left py-2 px-3">PST/PDT</td><td className="text-center py-2 px-3">−8:00 / −7:00</td><td className="text-center py-2 px-3">−9 timer</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">* Sommertid i Norge og Europa starter siste søndag i mars og slutter siste søndag i oktober. USA bytter noen uker tidligere om våren og senere om høsten, så forskjellen kan avvike i korte perioder.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips til samarbeid på tvers av tidssoner</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🌍 Finn overlapp</h3>
              <p className="text-sm text-muted-foreground">Til USA er ettermiddag i Norge best (kl. 15–18 hos oss er formiddag på østkysten). Til Asia fungerer tidlig morgen eller sen ettermiddag.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">📅 Avtal møter</h3>
              <p className="text-sm text-muted-foreground">Skriv alltid tidssonen i invitasjonen, eller oppgi klokkeslettet i begge steder.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">⏰ Husk sommertid</h3>
              <p className="text-sm text-muted-foreground">Overgangen til sommertid skjer på ulike datoer i ulike land. Et møte som passer nå kan flytte seg en time.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">🔄 Roter ubekvemme tidspunkter</h3>
              <p className="text-sm text-muted-foreground">Hvis dere har faste møter over mange tidssoner, bytt på hvem som tar de dårligste tidene.</p>
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
