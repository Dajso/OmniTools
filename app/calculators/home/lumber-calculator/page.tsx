import { Metadata } from 'next';
import { LumberCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Trelastkalkulator – gratis kalkulator på nett',
  description: 'Beregn mengde trelast i løpemeter og m³. Gratis og uten registrering.',
  keywords: ['trelast', 'materialliste', 'løpemeter', 'tømmer', 'kubikkmeter'],
  alternates: { canonical: '/calculators/home/lumber-calculator' },
  openGraph: {
    title: 'Trelastkalkulator',
    description: 'Beregn mengde trelast i løpemeter og m³',
    url: '/calculators/home/lumber-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Trelastkalkulator',
  description: 'Beregn mengde trelast i løpemeter og m³',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dimensjon', text: 'Trykk på en vanlig dimensjon eller skriv inn tykkelse og bredde i millimeter.' },
  { name: 'Oppgi lengde og antall', text: 'Lengden per stykk i meter, og hvor mange du trenger.' },
  { name: 'Skriv inn pris', text: 'Pris per løpemeter for å se totalprisen.' },
  { name: 'Les resultatet', text: 'Se totale løpemeter, volum i m³ og total pris.' },
];

const faqs = [
  { question: 'Hva er løpemeter?', answer: 'Samlet lengde av trelasten, uavhengig av tverrsnittet.' },
  { question: 'Hva betyr 48×98?', answer: 'Tverrsnittet i millimeter. Det er den høvlede dimensjonen av det som tidligere ble kalt 2×4 tommer.' },
  { question: 'Hvordan regner jeg om til m³?', answer: 'Tykkelse (m) × bredde (m) × lengde (m) × antall.' },
  { question: 'Hvilke lengder selges trelast i?', answer: 'Vanligvis i lengder med 30 cm økning, for eksempel 3,0, 3,6, 4,2, 4,8 og 5,4 m.' },
];

const relatedTools = [
  { href: '/calculators/home/decking-calculator', title: 'Terrassekalkulator', description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer' },
  { href: '/calculators/home/fence-calculator', title: 'Gjerdekalkulator', description: 'Beregn materialer til gjerde: stolper, bord og fester' },
];

export default function LumberCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="lumber-calculator"
          title="Trelastkalkulator"
          description="Regn ut løpemeter, volum og pris for trelast. Gratis og uten registrering."
        />

        <section aria-label="Trelastkalkulator">
          <LumberCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
