import { Metadata } from 'next';
import { SeatingCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bordplassering – gratis kalkulator på nett',
  description: 'Regn ut hvor mange runde bord du trenger. Sammenlign 8 og 10 plasser per bord. Gratis og uten registrering.',
  keywords: ['bordplassering', 'bordoppsett', 'runde bord', 'bryllup', 'arrangement'],
  alternates: { canonical: '/calculators/wedding/seating-arrangement-calculator' },
  openGraph: {
    title: 'Bordplassering',
    description: 'Regn ut hvor mange runde bord du trenger. Sammenlign 8 og 10 plasser per bord',
    url: '/calculators/wedding/seating-arrangement-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bordplassering',
  description: 'Regn ut hvor mange runde bord du trenger. Sammenlign 8 og 10 plasser per bord',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall gjester', text: 'Alle som skal sitte, også brudeparet.' },
  { name: 'Velg plasser per bord', text: 'Vanligvis 8 eller 10 plasser.' },
  { name: 'Angi æresbordet', text: 'Hvor mange som sitter ved æresbordet.' },
  { name: 'Les av antall bord', text: 'Se antall bord og ledige plasser.' },
];

const faqs = [
  { question: 'Hvor mange gjester passer per bord?', answer: 'Runde bord har ofte 8–10 plasser. 8 gir bedre samtaler, 10 gir færre bord.' },
  { question: 'Hva er et æresbord?', answer: 'Bordet der brudeparet og ofte forlovere og nærmeste familie sitter, gjerne med utsikt over salen.' },
  { question: 'Hvorfor har jeg ledige plasser?', answer: 'Siste bord blir sjelden helt fullt. Bruk plassene til gjester som melder seg sent, eller del jevnere ut mellom bordene.' },
  { question: 'Bør jeg ha reserveplasser?', answer: 'Ja, 2–3 ekstra plasser kan redde dagen hvis noen tar med seg en ekstra gjest.' },
];

const relatedTools = [
  { href: '/calculators/wedding/dance-floor-calculator', title: 'Dansegulv', description: 'Regn ut passe størrelse på dansegulvet ut fra antall gjester' },
  { href: '/calculators/wedding/tent-size-calculator', title: 'Teltstørrelse', description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement' },
];

export default function SeatingArrangementCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="seating-arrangement-calculator"
          title="Bordplassering"
          description="Regn ut hvor mange bord du trenger til bryllupsmiddagen, med plass til æresbord. Gratis og uten registrering."
        />

        <section aria-label="Bordplassering">
          <SeatingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
