import { Metadata } from 'next';
import { HourlySalaryCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Timelønn til årslønn – gratis kalkulator på nett',
  description: 'Regn om mellom timelønn, månedslønn og årslønn. Gratis og uten registrering.',
  keywords: ['timelønn', 'årslønn', 'månedslønn', 'lønnskalkulator', 'brutto lønn'],
  alternates: { canonical: '/calculators/finance/hourly-salary-calculator' },
  openGraph: {
    title: 'Timelønn til årslønn',
    description: 'Regn om mellom timelønn, månedslønn og årslønn',
    url: '/calculators/finance/hourly-salary-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Timelønn til årslønn',
  description: 'Regn om mellom timelønn, månedslønn og årslønn',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Velg om du vil regne fra timelønn eller fra årslønn.' },
  { name: 'Skriv inn lønn', text: 'Oppgi timelønn eller årslønn i kroner.' },
  { name: 'Oppgi arbeidstid', text: 'En full arbeidsuke er normalt 37,5 timer, og året har 52 uker.' },
  { name: 'Se resultatet', text: 'Se lønn per time, dag, uke, 14. dag, måned og år.' },
];

const faqs = [
  { question: 'Hvor mange timer er en full stilling i Norge?', answer: 'Normalt 37,5 timer per uke i mange bransjer, og opptil 40 timer i andre. Se arbeidsavtalen eller tariffavtalen din.' },
  { question: 'Er beløpene før eller etter skatt?', answer: 'Beløpene er brutto, før skatt og trekk.' },
  { question: 'Hva med feriepenger?', answer: 'Feriepenger er normalt 10,2 % av lønnen (12 % med ekstra ferieuke for de over 60 år eller etter tariffavtale). Har du fast månedslønn, er de ofte allerede en del av årslønnen.' },
];

const relatedTools = [
  { href: '/calculators/finance/freelance-rate-calculator', title: 'Timepris for frilansere', description: 'Beregn hvilken timepris du bør ta som frilanser eller selvstendig' },
];

export default function HourlySalaryCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hourly-salary-calculator"
          title="Timelønn til årslønn"
          description="Regn om mellom timelønn, månedslønn og årslønn"
        />

        <section aria-label="Timelønn til årslønn">
          <HourlySalaryCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
