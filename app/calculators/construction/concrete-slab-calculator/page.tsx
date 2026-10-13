import { Metadata } from 'next';
import { ConcreteSlabCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Betongplate – gratis kalkulator på nett',
  description: 'Regn ut betongvolum og armering for plate og gulv. Gratis og uten registrering.',
  keywords: ['betongplate', 'betongvolum', 'armering', 'plate på mark', 'fundament'],
  alternates: { canonical: '/calculators/construction/concrete-slab-calculator' },
  openGraph: {
    title: 'Betongplate',
    description: 'Regn ut betongvolum og armering for plate og gulv',
    url: '/calculators/construction/concrete-slab-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Betongplate',
  description: 'Regn ut betongvolum og armering for plate og gulv',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi størrelsen', text: 'Skriv inn lengde og bredde i meter.' },
  { name: 'Velg tykkelse', text: 'Velg bruksområde eller oppgi egen tykkelse i centimeter.' },
  { name: 'Legg til svinn, armering og pukk', text: 'Standard svinn er 10 %. Skriv inn avstanden mellom armeringsjern og tykkelsen på pukklaget hvis du trenger det.' },
  { name: 'Les resultatet', text: 'Se volum å bestille, antall sekker à 25 kg, vekt, armering, pukk og antall lass med betongbil.' },
];

const faqs = [
  { question: 'Hvor mye betong går det til en plate?', answer: 'Volumet er lengde × bredde × tykkelse. En plate på 6 × 4 m og 10 cm tykkelse trenger 2,4 m³ før svinn.' },
  { question: 'Hvor mange sekker trenger jeg?', answer: 'Det avhenger av sekkens størrelse. Kalkulatoren regner med 25 kg ferdigbetong per sekk og en tetthet på ca. 2 300 kg/m³. Sjekk utbytte på posen du kjøper.' },
  { question: 'Når bør jeg bestille betongbil?', answer: 'Over ca. 2 m³ er det vanligvis enklere og billigere å bestille levert betong. Spør leverandøren om minstemengde og kjørekostnad.' },
  { question: 'Hvor tykk bør platen være?', answer: '8–10 cm til gangstier og terrasser, 10–12 cm til garasjegulv og innkjørsler, og 15 cm eller mer for tyngre trafikk. For bærende konstruksjoner gjelder krav fra rådgivende ingeniør.' },
  { question: 'Trenger jeg armering?', answer: 'Armering holder sprekker sammen og anbefales for de fleste plater utenom små gangstier. Til bærende betong skal armeringen prosjekteres.' },
];

const relatedTools = [
  { href: '/calculators/home/concrete-calculator', title: 'Betongkalkulator', description: 'Beregn hvor mye betong du trenger i m³ og antall sekker' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

const quickReferenceTable = [
  { size: '8\' × 10\'', thickness: '4"', cubicYards: '0.99', bags60lb: '66', bags80lb: '50' },
  { size: '10\' × 10\'', thickness: '4"', cubicYards: '1.23', bags60lb: '82', bags80lb: '62' },
  { size: '10\' × 12\'', thickness: '4"', cubicYards: '1.48', bags60lb: '99', bags80lb: '74' },
  { size: '12\' × 12\'', thickness: '4"', cubicYards: '1.78', bags60lb: '119', bags80lb: '89' },
  { size: '12\' × 16\'', thickness: '4"', cubicYards: '2.37', bags60lb: '158', bags80lb: '119' },
  { size: '16\' × 16\'', thickness: '4"', cubicYards: '3.16', bags60lb: '211', bags80lb: '158' },
  { size: '16\' × 20\'', thickness: '4"', cubicYards: '3.95', bags60lb: '264', bags80lb: '198' },
  { size: '20\' × 20\'', thickness: '4"', cubicYards: '4.94', bags60lb: '330', bags80lb: '247' },
  { size: '20\' × 24\'', thickness: '4"', cubicYards: '5.93', bags60lb: '395', bags80lb: '297' },
  { size: '24\' × 24\'', thickness: '4"', cubicYards: '7.11', bags60lb: '475', bags80lb: '356' },
];

export default function ConcreteSlabCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="concrete-slab-calculator"
          title="Betongplate"
          description="Regn ut hvor mye betong du trenger til en plate, uteplass eller et gulv: volum, vekt, sekker, armering og betongbil. Gratis og uten registrering."
          colorClass="bg-gray-100 text-gray-600"
        />

        <section aria-label="Betongplate">
          <ConcreteSlabCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hurtigoppslag: vanlige platestørrelser (10 cm tykk, 10 % svinn)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Størrelse</th>
                  <th className="text-right py-2 px-3">Areal</th>
                  <th className="text-right py-2 px-3">Betong</th>
                  <th className="text-right py-2 px-3">Sekker à 25 kg</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">2 × 1 m</td><td className="text-right py-2 px-3">2,0 m²</td><td className="text-right py-2 px-3">0,22 m³</td><td className="text-right py-2 px-3">21</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">3 × 2 m</td><td className="text-right py-2 px-3">6,0 m²</td><td className="text-right py-2 px-3">0,66 m³</td><td className="text-right py-2 px-3">61</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">4 × 3 m</td><td className="text-right py-2 px-3">12,0 m²</td><td className="text-right py-2 px-3">1,32 m³</td><td className="text-right py-2 px-3">122</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">5 × 4 m</td><td className="text-right py-2 px-3">20,0 m²</td><td className="text-right py-2 px-3">2,20 m³</td><td className="text-right py-2 px-3">203</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">6 × 4 m</td><td className="text-right py-2 px-3">24,0 m²</td><td className="text-right py-2 px-3">2,64 m³</td><td className="text-right py-2 px-3">243</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">8 × 5 m</td><td className="text-right py-2 px-3">40,0 m²</td><td className="text-right py-2 px-3">4,40 m³</td><td className="text-right py-2 px-3">405</td></tr>
                <tr><td className="text-left py-2 px-3">10 × 6 m</td><td className="text-right py-2 px-3">60,0 m²</td><td className="text-right py-2 px-3">6,60 m³</td><td className="text-right py-2 px-3">608</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Over ca. 2 m³ er levert betong som regel enklere enn sekker.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik regner du med betong</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Volum</h3>
              <p className="text-sm text-muted-foreground">Volum = lengde × bredde × tykkelse. Tykkelsen oppgis i cm og deles på 100 for å få meter. Legg til ca. 10 % for svinn og ujevnt underlag.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Armering</h3>
              <p className="text-sm text-muted-foreground">Armeringsnett eller stålnett holder sammen sprekker. Vanlig avstand er 15–20 cm i begge retninger. Legg nettet i midten av platen, støttet opp med avstandsholdere.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Sekker</h3>
              <p className="text-sm text-muted-foreground">Ferdigbetong i sekk koster mer per kubikk enn levert betong. 25 kg gir omtrent 12 liter betong, avhengig av produkt.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Veiledning for tykkelse</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Bruk</th>
                  <th className="text-left py-2 px-3">Tykkelse</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">Gangsti og terrasse</td><td className="text-left py-2 px-3">8–10 cm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Garasjegulv og uteplass</td><td className="text-left py-2 px-3">10 cm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Innkjørsel med personbil</td><td className="text-left py-2 px-3">12 cm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">Tyngre kjøring</td><td className="text-left py-2 px-3">15 cm eller mer</td></tr>
                <tr><td className="text-left py-2 px-3">Fundament og bærende plate</td><td className="text-left py-2 px-3">20 cm eller mer, prosjektert</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Under platen bør du ha et komprimert lag med pukk, ofte 10–20 cm. Til bærende konstruksjoner skal tykkelse og armering fastsettes av en ingeniør.</p>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
