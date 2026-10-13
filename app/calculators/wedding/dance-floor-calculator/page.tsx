import { Metadata } from 'next';
import { DanceFloorCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dansegulv – gratis kalkulator på nett',
  description: 'Regn ut passe størrelse på dansegulvet ut fra antall gjester. Gratis og uten registrering.',
  keywords: ['dansegulv', 'dansegulvstørrelse', 'bryllupsfest', 'arrangement'],
  alternates: { canonical: '/calculators/wedding/dance-floor-calculator' },
  openGraph: {
    title: 'Dansegulv',
    description: 'Regn ut passe størrelse på dansegulvet ut fra antall gjester',
    url: '/calculators/wedding/dance-floor-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dansegulv',
  description: 'Regn ut passe størrelse på dansegulvet ut fra antall gjester',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall gjester', text: 'Totalt antall gjester i selskapet.' },
  { name: 'Angi hvor mange som danser', text: 'Andel som danser samtidig, ofte rundt 40 %.' },
  { name: 'Les av størrelsen', text: 'Se anbefalt mål i meter og areal i m².' },
  { name: 'Tilpass lokalet', text: 'Sjekk at gulvet får plass ved siden av bord og scene.' },
];

const faqs = [
  { question: 'Hvor stort dansegulv trenger jeg?', answer: 'Regn med omtrent 0,5 m² per danser. For 100 gjester der 40 % danser samtidig blir det 20 m².' },
  { question: 'Hvor mange gjester danser samtidig?', answer: 'Ofte 30–50 %, men det varierer mye med publikum, musikk og tid på kvelden.' },
  { question: 'Må dansegulvet være kvadratisk?', answer: 'Nei. Kalkulatoren viser et kvadratisk mål, men et rektangulært gulv med samme areal fungerer også.' },
  { question: 'Hvor bør dansegulvet ligge?', answer: 'Nær bandet eller DJ-en, men med nok avstand til at man kan snakke ved bordene.' },
];

const relatedTools = [
  { href: '/calculators/wedding/tent-size-calculator', title: 'Teltstørrelse', description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement' },
  { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Bordplassering', description: 'Regn ut hvor mange runde bord du trenger. Sammenlign 8 og 10 plasser per bord' },
];

export default function DanceFloorCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dance-floor-calculator"
          title="Dansegulv"
          description="Regn ut hvor stort dansegulvet bør være ut fra antall gjester og hvor mange som danser samtidig. Gratis og uten registrering."
        />

        <section aria-label="Dansegulv">
          <DanceFloorCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
