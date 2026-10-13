import { Metadata } from 'next';
import { ROICalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Avkastningskalkulator (ROI) – gratis kalkulator på nett',
  description: 'Beregn avkastningen på en investering. Gratis og uten registrering.',
  keywords: ['ROI', 'avkastning', 'investering', 'fortjeneste'],
  alternates: { canonical: '/calculators/finance/roi-calculator' },
  openGraph: {
    title: 'Avkastningskalkulator (ROI)',
    description: 'Beregn avkastningen på en investering',
    url: '/calculators/finance/roi-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Avkastningskalkulator (ROI)',
  description: 'Beregn avkastningen på en investering',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn innskutt beløp', text: 'Oppgi hvor mye du investerte i begynnelsen.' },
  { name: 'Skriv inn sluttverdi', text: 'Oppgi hva investeringen er verdt nå, eller hva du solgte den for.' },
  { name: 'Legg til periode', text: 'Valgfritt: oppgi antall år for å se årlig avkastning.' },
  { name: 'Les avkastningen', text: 'Se total avkastning i prosent, gevinst eller tap i kroner og årlig avkastning.' },
];

const faqs = [
  { question: 'Hva er ROI?', answer: 'ROI står for return on investment, eller avkastning på investering. Det er gevinsten delt på det du investerte, uttrykt i prosent.' },
  { question: 'Hvorfor er årlig avkastning nyttig?', answer: 'En avkastning på 50 % over fem år er ikke det samme som 50 % over ett år. Årlig avkastning gjør det mulig å sammenligne investeringer over ulik tid.' },
  { question: 'Er skatt og gebyrer med i beregningen?', answer: 'Nei. Trekk fra kostnader som kurtasje, forvaltningsgebyr og skatt på gevinst for å få avkastningen etter kostnader.' },
];

const relatedTools = [
  { href: '/calculators/finance/compound-interest-calculator', title: 'Rentesrentekalkulator', description: 'Beregn hvordan sparing vokser med renters rente' },
];

export default function ROICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roi-calculator"
          title="Avkastningskalkulator (ROI)"
          description="Beregn avkastningen på en investering"
        />

        <section aria-label="Avkastningskalkulator (ROI)">
          <ROICalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
