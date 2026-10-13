import { Metadata } from 'next';
import { GravelCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Grus- og pukkalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye grus eller pukk du trenger i m³ og tonn. Gratis og uten registrering.',
  keywords: ['grus', 'pukk', 'pukk og singel', 'innkjørsel', 'kubikkmeter', 'tonn'],
  alternates: { canonical: '/calculators/home/gravel-calculator' },
  openGraph: {
    title: 'Grus- og pukkalkulator',
    description: 'Beregn hvor mye grus eller pukk du trenger i m³ og tonn',
    url: '/calculators/home/gravel-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Grus- og pukkalkulator',
  description: 'Beregn hvor mye grus eller pukk du trenger i m³ og tonn',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål flaten', text: 'Oppgi lengde og bredde i meter.' },
  { name: 'Velg lagtykkelse og materiale', text: 'Tykkelsen oppgis i centimeter. Velg materiale for riktig tetthet.' },
  { name: 'Legg til komprimering', text: 'Løs masse setter seg. 10–20 % ekstra er vanlig.' },
  { name: 'Les resultatet', text: 'Se vekt i tonn, volum i m³ og antall storsekker.' },
];

const faqs = [
  { question: 'Hvor tykt lag trenger jeg?', answer: 'Til gangsti holder 5–10 cm. Til innkjørsel og parkering bør bærelaget være 20–40 cm, avhengig av underlag og belastning.' },
  { question: 'Hva veier en kubikkmeter grus?', answer: 'Vanligvis 1 400–1 900 kg, avhengig av type og fuktighet. Spør leverandøren om nøyaktig tetthet.' },
  { question: 'Hvorfor må jeg legge til komprimering?', answer: 'Når massen pakkes sammen, blir laget tynnere. Uten tillegg risikerer du å mangle materiale.' },
  { question: 'Kan jeg bestille på tonn eller kubikk?', answer: 'Begge deler brukes. Pukkleverandører selger ofte per tonn, mens sand og singel kan selges per m³.' },
];

const relatedTools = [
  { href: '/calculators/home/concrete-calculator', title: 'Betongkalkulator', description: 'Beregn hvor mye betong du trenger i m³ og antall sekker' },
  { href: '/calculators/home/mulch-calculator', title: 'Barkflis- og jordkalkulator', description: 'Beregn hvor mye barkflis eller dekkemateriale du trenger i hagen' },
];

export default function GravelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gravel-calculator"
          title="Grus- og pukkalkulator"
          description="Regn ut hvor mange tonn og kubikkmeter grus, pukk eller sand du trenger. Gratis og uten registrering."
        />

        <section aria-label="Grus- og pukkalkulator">
          <GravelCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
