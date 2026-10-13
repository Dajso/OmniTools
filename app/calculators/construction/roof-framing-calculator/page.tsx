import { Metadata } from 'next';
import { RoofFramingCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Taksperrer – gratis kalkulator på nett',
  description: 'Regn ut sperrelengder, vinkler og kutt for takkonstruksjon. Gratis og uten registrering.',
  keywords: ['taksperrer', 'sperrelengde', 'takkonstruksjon', 'vinkler', 'kutt'],
  alternates: { canonical: '/calculators/construction/roof-framing-calculator' },
  openGraph: {
    title: 'Taksperrer',
    description: 'Regn ut sperrelengder, vinkler og kutt for takkonstruksjon',
    url: '/calculators/construction/roof-framing-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Taksperrer',
  description: 'Regn ut sperrelengder, vinkler og kutt for takkonstruksjon',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi husbredden', text: 'Mål fra ytterkant til ytterkant av veggene, i meter.' },
  { name: 'Velg takvinkel', text: 'Velg en vanlig takvinkel eller skriv inn din egen i grader.' },
  { name: 'Sett sperreavstand og utstikk', text: 'Vanlig senteravstand er 600 mm. Utstikk oppgis i centimeter.' },
  { name: 'Les resultatet', text: 'Se sperrelengde, møneshøyde, kappevinkler, antall sperrer og takflate.' },
];

const faqs = [
  { question: 'Hvordan regnes sperrelengden ut?', answer: 'Halve husbredden delt på cosinus til takvinkelen, pluss utstikket langs sperra.' },
  { question: 'Hvilken takvinkel er vanlig i Norge?', answer: 'Mange boliger har 22–35°. Vinkelen påvirker snølast, valg av taktekking og hvor mye loft du får.' },
  { question: 'Kan jeg bruke tallene til å bestille tømmer?', answer: 'De gir et godt grunnlag for mengde, men dimensjon på sperrene avhenger av spenn og snølast. Få det kontrollert mot leverandørens tabeller eller av en ingeniør.' },
  { question: 'Hva er møneshøyde?', answer: 'Høyden fra toppen av ytterveggen til mønet (toppen av taket).' },
];

const relatedTools = [
  { href: '/calculators/home/roof-pitch-calculator', title: 'Takvinkelkalkulator', description: 'Beregn takvinkel i grader og prosent' },
  { href: '/calculators/home/stair-calculator', title: 'Trappekalkulator', description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn' },
];

const pitchReferenceChart = [
  { pitch: '2:12', angle: '9.46°', rise: '2"', description: 'Low slope - requires special roofing' },
  { pitch: '4:12', angle: '18.43°', rise: '4"', description: 'Moderate - common residential' },
  { pitch: '5:12', angle: '22.62°', rise: '5"', description: 'Standard - good for most climates' },
  { pitch: '6:12', angle: '26.57°', rise: '6"', description: 'Standard - most common residential' },
  { pitch: '8:12', angle: '33.69°', rise: '8"', description: 'Steep - good for snow shedding' },
  { pitch: '10:12', angle: '39.81°', rise: '10"', description: 'Very steep - dramatic appearance' },
  { pitch: '12:12', angle: '45.00°', rise: '12"', description: '45° angle - maximum common pitch' },
];

export default function RoofFramingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roof-framing-calculator"
          title="Taksperrer"
          description="Regn ut sperrelengde, møneshøyde, vinkler og antall sperrer for et saltak ut fra husbredde og takvinkel. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Taksperrer">
          <RoofFramingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Takvinkler: eksempel for hus som er 8 m bredt</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Takvinkel</th>
                  <th className="text-right py-2 px-3">Stigning</th>
                  <th className="text-right py-2 px-3">Møneshøyde</th>
                  <th className="text-right py-2 px-3">Sperre (uten utstikk)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">15°</td><td className="text-right py-2 px-3">26,8 %</td><td className="text-right py-2 px-3">1,07 m</td><td className="text-right py-2 px-3">4,14 m</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">22°</td><td className="text-right py-2 px-3">40,4 %</td><td className="text-right py-2 px-3">1,62 m</td><td className="text-right py-2 px-3">4,31 m</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">27°</td><td className="text-right py-2 px-3">51,0 %</td><td className="text-right py-2 px-3">2,04 m</td><td className="text-right py-2 px-3">4,49 m</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">30°</td><td className="text-right py-2 px-3">57,7 %</td><td className="text-right py-2 px-3">2,31 m</td><td className="text-right py-2 px-3">4,62 m</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">35°</td><td className="text-right py-2 px-3">70,0 %</td><td className="text-right py-2 px-3">2,80 m</td><td className="text-right py-2 px-3">4,88 m</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">40°</td><td className="text-right py-2 px-3">83,9 %</td><td className="text-right py-2 px-3">3,36 m</td><td className="text-right py-2 px-3">5,22 m</td></tr>
                <tr><td className="text-left py-2 px-3">45°</td><td className="text-right py-2 px-3">100 %</td><td className="text-right py-2 px-3">4,00 m</td><td className="text-right py-2 px-3">5,66 m</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Møneshøyden er målt fra toppen av ytterveggen. Utstikk kommer i tillegg.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Begreper</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Spenn og løp</h3>
              <p className="text-sm text-muted-foreground">Spennet er husbredden. Løpet er halve spennet, altså den horisontale lengden fra yttervegg til mønet.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Stigning</h3>
              <p className="text-sm text-muted-foreground">Stigning angis i grader eller i prosent. 100 % er det samme som 45°.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Loddkutt og sperreinnskjæring</h3>
              <p className="text-sm text-muted-foreground">Loddkutt er kappet ved mønet. Sperreinnskjæring (også kalt fuglemunn) er utsparingen der sperra hviler på ytterveggen.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Utstikk</h3>
              <p className="text-sm text-muted-foreground">Utstikket er hvor langt taket stikker ut over veggen. Det regnes horisontalt i kalkulatoren.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Formlene</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Sperrelengde</h3>
              <p className="text-sm text-muted-foreground">Sperrelengde = løp ÷ cos(takvinkel). Utstikket legges til etter samme formel.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Møneshøyde</h3>
              <p className="text-sm text-muted-foreground">Møneshøyde = løp × tan(takvinkel).</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Antall sperrer</h3>
              <p className="text-sm text-muted-foreground">Antall per side = byggets lengde ÷ senteravstand, rundet opp, pluss én.</p>
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
