import { Metadata } from 'next';
import { CashOnCashCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Egenkapitalavkastning – gratis kalkulator på nett',
  description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig. Gratis og uten registrering.',
  keywords: ['egenkapitalavkastning', 'kontantavkastning', 'belånt', 'utleie', 'leieinntekt'],
  alternates: { canonical: '/calculators/realestate/cash-on-cash-calculator' },
  openGraph: {
    title: 'Egenkapitalavkastning',
    description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig',
    url: '/calculators/realestate/cash-on-cash-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Egenkapitalavkastning',
  description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Beregn årlig kontantstrøm', text: 'Trekk kostnader, renter og avdrag fra leieinntektene.' },
  { name: 'Oppgi investert egenkapital', text: 'Legg sammen egenkapital, omkostninger og oppussing.' },
  { name: 'Les avkastningen', text: 'Se hvor mange prosent kontantstrømmen utgjør av egenkapitalen.' },
];

const faqs = [
  { question: 'Hva måler egenkapitalavkastning?', answer: 'Hvor mye kontantstrøm du får hvert år i forhold til pengene du selv har skutt inn. Den fanger opp effekten av lånefinansiering.' },
  { question: 'Er avdrag en kostnad?', answer: 'Avdrag er ikke en kostnad, men det reduserer kontantstrømmen din. Regn gjerne begge veier for å se forskjellen.' },
  { question: 'Tar kalkulatoren hensyn til skatt?', answer: 'Nei, avkastningen er før skatt. Leieinntekter beskattes som alminnelig inntekt (22 %) etter fradrag for kostnader og renter.' },
  { question: 'Hva om kontantstrømmen er negativ?', answer: 'Da blir avkastningen negativ, og du må tilføre penger hver måned. Det kan likevel gå bra hvis boligen stiger i verdi, men det er en risiko.' },
];

const relatedTools = [
  { href: '/calculators/realestate/cap-rate-calculator', title: 'Yield-kalkulator (direkteavkastning)', description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig' },
  { href: '/calculators/realestate/brrrr-calculator', title: 'BRRRR-kalkulator', description: 'Regn ut avkastning på kjøp–oppussing–utleie–refinansiering–gjenta' },
];

export default function CashOnCashCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cash-on-cash-calculator"
          title="Egenkapitalavkastning"
          description="Regn ut avkastningen på egenkapitalen du har bundet i en utleiebolig. Gratis og uten registrering."
        />

        <section aria-label="Egenkapitalavkastning">
          <CashOnCashCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
