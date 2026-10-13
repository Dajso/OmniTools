import { Metadata } from 'next';
import { CompoundInterestCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Rentesrentekalkulator – gratis kalkulator på nett',
  description: 'Beregn hvordan sparing vokser med renters rente. Gratis og uten registrering.',
  keywords: ['renters rente', 'sparekalkulator', 'sparing', 'fondssparing', 'vekst'],
  alternates: { canonical: '/calculators/finance/compound-interest-calculator' },
  openGraph: {
    title: 'Rentesrentekalkulator',
    description: 'Beregn hvordan sparing vokser med renters rente',
    url: '/calculators/finance/compound-interest-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rentesrentekalkulator',
  description: 'Beregn hvordan sparing vokser med renters rente',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn startbeløp', text: 'Oppgi hvor mye du har spart fra før.' },
  { name: 'Velg rente og tid', text: 'Oppgi forventet årlig avkastning og hvor mange år du sparer.' },
  { name: 'Legg til regelmessig sparing', text: 'Oppgi hvor mye du sparer, og hvor ofte.' },
  { name: 'Se veksten', text: 'Se sluttbeløp, innskudd og opptjente renter, år for år.' },
];

const faqs = [
  { question: 'Hva er renters rente?', answer: 'Renters rente betyr at du får avkastning både på pengene du har satt inn og på rentene som allerede er opptjent. Over tid gir det eksponentiell vekst.' },
  { question: 'Hva er 72-regelen?', answer: 'Del 72 på årlig rente for å anslå hvor mange år det tar å doble pengene. Med 6 % rente tar det omtrent 12 år.' },
  { question: 'Hvilken rente bør jeg bruke?', answer: 'Bruk en forsiktig anslått rente. Sparekonto gir ofte noen få prosent. Aksjefond kan gi mer over lang tid, men med risiko og svingninger.' },
  { question: 'Er skatt og kostnader med?', answer: 'Nei. Trekk fra forvaltningskostnader og skatt for å få et realistisk bilde, for eksempel skatt på gevinst i aksjefond.' },
];

const relatedTools = [
  { href: '/calculators/finance/roi-calculator', title: 'Avkastningskalkulator (ROI)', description: 'Beregn avkastningen på en investering' },
];

export default function CompoundInterestCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="compound-interest-calculator"
          title="Rentesrentekalkulator"
          description="Beregn hvordan sparing vokser med renters rente"
        />

        <section aria-label="Rentesrentekalkulator">
          <CompoundInterestCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
