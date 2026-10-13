import { Metadata } from 'next';
import { PercentageCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Prosentkalkulator – gratis kalkulator på nett',
  description: 'Regn ut prosent, økning og nedgang. Gratis og uten registrering.',
  keywords: ['prosentkalkulator', 'prosent', 'prosentvis endring', 'prosent av'],
  alternates: { canonical: '/calculators/productivity/percentage-calculator' },
  openGraph: {
    title: 'Prosentkalkulator',
    description: 'Regn ut prosent, økning og nedgang',
    url: '/calculators/productivity/percentage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Prosentkalkulator',
  description: 'Regn ut prosent, økning og nedgang',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg type utregning', text: 'For eksempel «Hva er X % av Y?» eller «Prosentvis endring».' },
  { name: 'Fyll inn tallene', text: 'Feltene tilpasses valget ditt.' },
  { name: 'Les av svaret', text: 'Du ser svaret og formelen som er brukt.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut 25 % av 200?', answer: '200 × 25 ÷ 100 = 50.' },
  { question: 'Hvordan regner jeg ut prosentvis endring?', answer: '(nytt tall − gammelt tall) ÷ gammelt tall × 100.' },
  { question: 'Hvordan regner jeg ut mva. fra et beløp?', answer: 'For å legge til 25 % mva., øk med 25 %. For å finne beløpet uten mva. fra et beløp med mva., del på 1,25.' },
  { question: 'Hva er forskjellen på prosent og prosentpoeng?', answer: 'Går renten fra 4 % til 5 %, har den økt med 1 prosentpoeng, men 25 % i prosentvis økning.' },
];

const relatedTools = [
  { href: '/calculators/finance/discount-calculator', title: 'Rabattkalkulator', description: 'Regn ut rabatt, tilbudspris og pris med MVA' },
];

export default function PercentageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="percentage-calculator"
          title="Prosentkalkulator"
          description="Regn ut prosent av et tall, hvor mange prosent ett tall er av et annet, prosentvis endring, økning og reduksjon. Gratis og uten registrering."
        />

        <section aria-label="Prosentkalkulator">
          <PercentageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
