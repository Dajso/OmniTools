import { Metadata } from 'next';
import { RoofPitchCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Takvinkelkalkulator – gratis kalkulator på nett',
  description: 'Beregn takvinkel i grader og prosent. Gratis og uten registrering.',
  keywords: ['takvinkel', 'takhelning', 'taktilt', 'tak', 'stigning'],
  alternates: { canonical: '/calculators/home/roof-pitch-calculator' },
  openGraph: {
    title: 'Takvinkelkalkulator',
    description: 'Beregn takvinkel i grader og prosent',
    url: '/calculators/home/roof-pitch-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Takvinkelkalkulator',
  description: 'Beregn takvinkel i grader og prosent',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål høyden', text: 'Oppgi høyden fra raft til møne i meter.' },
  { name: 'Mål lengden', text: 'Oppgi horisontal avstand fra raft til under mønet i meter.' },
  { name: 'Les resultatet', text: 'Se takvinkelen i grader, stigning i prosent og sperrelengde.' },
];

const faqs = [
  { question: 'Hva er en vanlig takvinkel i Norge?', answer: 'De fleste saltak ligger mellom 22° og 40°. Flate tak har ofte 1–5° fall.' },
  { question: 'Hvordan regner jeg om grader til prosent?', answer: 'Prosent er tangens til vinkelen gange 100. 45° tilsvarer 100 %.' },
  { question: 'Hva er sperrefaktor?', answer: 'Tallet du ganger horisontal lengde med for å få sperrelengden langs taket.' },
  { question: 'Hvilken takvinkel krever tekkingen min?', answer: 'Det avhenger av tekkingstype. Les produsentens anvisning for minste takvinkel.' },
];

const relatedTools = [
  { href: '/calculators/home/stair-calculator', title: 'Trappekalkulator', description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function RoofPitchCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roof-pitch-calculator"
          title="Takvinkelkalkulator"
          description="Regn ut takvinkel i grader og prosent, og lengden på sperrene. Gratis og uten registrering."
        />

        <section aria-label="Takvinkelkalkulator">
          <RoofPitchCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
