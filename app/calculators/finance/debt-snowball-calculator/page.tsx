import { Metadata } from 'next';
import { DebtSnowballCalculator } from '@/components/calculators/finance/debt-snowball-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Snøballmetoden for gjeld – gratis kalkulator på nett',
  description: 'Lag en plan for å bli kvitt gjelden med snøballmetoden. Gratis og uten registrering.',
  keywords: ['snøballmetoden', 'gjeldsnedbetaling', 'gjeldfri', 'gjeldsplan', 'avalanche'],
  alternates: { canonical: '/calculators/finance/debt-snowball-calculator' },
  openGraph: {
    title: 'Snøballmetoden for gjeld',
    description: 'Lag en plan for å bli kvitt gjelden med snøballmetoden',
    url: '/calculators/finance/debt-snowball-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Snøballmetoden for gjeld',
  description: 'Lag en plan for å bli kvitt gjelden med snøballmetoden',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn gjelden', text: 'Skriv inn saldo, rente og minstebeløp for hver gjeld.' },
  { name: 'Legg til ekstra', text: 'Oppgi hvor mye ekstra du kan betale hver måned.' },
  { name: 'Se planen', text: 'Se nedbetalingsrekkefølge, tid til gjeldfri og sum renter.' },
];

const faqs = [
  { question: 'Hva er snøballmetoden?', answer: 'Du betaler minstebeløp på all gjeld og legger alt ekstra på den minste gjelden først. Når den er betalt, flytter du hele beløpet til neste gjeld.' },
  { question: 'Hva er forskjellen på snøball og avalanche?', answer: 'Snøballmetoden tar minste gjeld først for motivasjon. Avalanche-metoden tar den høyeste renten først og gir lavest renter totalt.' },
  { question: 'Bør jeg samle gjelden i ett lån?', answer: 'Ofte ja, hvis du kan få lavere effektiv rente enn på dagens gjeld. Sjekk gebyrer før du bestemmer deg.' },
];

const relatedTools = [
  { href: '/calculators/finance/credit-card-payoff', title: 'Kalkulator for nedbetaling av kredittkortgjeld', description: 'Se hvor lang tid det tar å betale ned kredittkortgjeld med minstebeløp eller fast månedsbeløp' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="debt-snowball-calculator"
          title="Snøballmetoden for gjeld"
          description="Lag en plan for å bli kvitt gjelden med snøballmetoden"
        />

        <section aria-label="Snøballmetoden for gjeld">
          <DebtSnowballCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
