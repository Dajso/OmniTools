import { Metadata } from 'next';
import { TentSizeCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Teltstørrelse – gratis kalkulator på nett',
  description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement. Gratis og uten registrering.',
  keywords: ['telt', 'festtelt', 'utebryllup', 'arrangement', 'teltleie'],
  alternates: { canonical: '/calculators/wedding/tent-size-calculator' },
  openGraph: {
    title: 'Teltstørrelse',
    description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement',
    url: '/calculators/wedding/tent-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Teltstørrelse',
  description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall gjester', text: 'Totalt antall gjester.' },
  { name: 'Velg type arrangement', text: 'Stående mottakelse, sittende middag eller middag med dansegulv.' },
  { name: 'Se anbefalt telt', text: 'Få areal i m² og nærmeste vanlige teltstørrelse.' },
  { name: 'Bestill med litt slingringsmonn', text: 'Sjekk målene med teltleverandøren.' },
];

const faqs = [
  { question: 'Hvor mye plass trenger hver gjest?', answer: 'Veiledende ca. 0,6 m² stående, 1,2 m² ved sittende middag og 1,5 m² når det er dansegulv.' },
  { question: 'Hva er vanlige teltstørrelser?', answer: 'Partytelt leies ofte i størrelser som 5 × 10, 6 × 12, 8 × 15, 10 × 20 og 12 × 25 meter, men utvalget varierer mellom leverandører.' },
  { question: 'Må jeg ha plass til catering og scene?', answer: 'Ja. Ta med ekstra areal til buffet, scene, bar og eventuelt toalettvogner.' },
  { question: 'Trenger jeg tillatelse til å sette opp telt?', answer: 'Det avhenger av størrelse og hvor lenge det står, og du kan trenge tillatelse fra grunneier eller kommunen. Spør teltleverandøren og kommunen.' },
];

const relatedTools = [
  { href: '/calculators/wedding/dance-floor-calculator', title: 'Dansegulv', description: 'Regn ut passe størrelse på dansegulvet ut fra antall gjester' },
  { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Bordplassering', description: 'Regn ut hvor mange runde bord du trenger. Sammenlign 8 og 10 plasser per bord' },
];

export default function TentSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tent-size-calculator"
          title="Teltstørrelse"
          description="Finn ut hvor stort telt du bør leie til bryllupet, ut fra antall gjester og hvordan selskapet skal være. Gratis og uten registrering."
        />

        <section aria-label="Teltstørrelse">
          <TentSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
