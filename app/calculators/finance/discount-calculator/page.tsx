import { Metadata } from 'next';
import { DiscountCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Rabattkalkulator – gratis kalkulator på nett',
  description: 'Regn ut rabatt, tilbudspris og pris med MVA. Gratis og uten registrering.',
  keywords: ['rabatt', 'tilbudspris', 'prosent av', 'salg', 'sparing'],
  alternates: { canonical: '/calculators/finance/discount-calculator' },
  openGraph: {
    title: 'Rabattkalkulator',
    description: 'Regn ut rabatt, tilbudspris og pris med MVA',
    url: '/calculators/finance/discount-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rabattkalkulator',
  description: 'Regn ut rabatt, tilbudspris og pris med MVA',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn opprinnelig pris', text: 'Oppgi prisen før rabatt.' },
  { name: 'Velg rabatt', text: 'Velg prosent, eller bruk en av snarveiene.' },
  { name: 'Legg til MVA ved behov', text: 'La MVA stå på 0 hvis prisen allerede inkluderer MVA.' },
  { name: 'Se ny pris', text: 'Se ny pris, hvor mye du sparer og beløp i MVA.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut rabatt i prosent?', answer: 'Gang prisen med rabatten delt på 100 og trekk beløpet fra prisen. 20 % rabatt på 1 000 kr er 200 kr, så prisen blir 800 kr.' },
  { question: 'Hva om jeg har flere rabatter?', answer: 'Rabatter regnes etter hverandre og ikke lagt sammen. 20 % og deretter 10 % blir 28 % totalt, ikke 30 %.' },
  { question: 'Er prisene i butikken med MVA?', answer: 'Ja, priser til forbrukere i Norge oppgis inkludert MVA. Da kan du la MVA stå på 0 her.' },
];

const relatedTools = [
  { href: '/calculators/finance/sales-tax-calculator', title: 'MVA-kalkulator', description: 'Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA' },
];

export default function DiscountCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="discount-calculator"
          title="Rabattkalkulator"
          description="Regn ut rabatt, tilbudspris og pris med MVA"
        />

        <section aria-label="Rabattkalkulator">
          <DiscountCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
