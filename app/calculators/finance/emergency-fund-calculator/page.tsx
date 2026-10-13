import { Metadata } from 'next';
import { EmergencyFundCalculator } from '@/components/calculators/finance/emergency-fund-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Buffersparing – gratis kalkulator på nett',
  description: 'Beregn hvor stor sparebuffer du trenger. Gratis og uten registrering.',
  keywords: ['buffer', 'sparemål', 'nødfond', 'økonomisk trygghet'],
  alternates: { canonical: '/calculators/finance/emergency-fund-calculator' },
  openGraph: {
    title: 'Buffersparing',
    description: 'Beregn hvor stor sparebuffer du trenger',
    url: '/calculators/finance/emergency-fund-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Buffersparing',
  description: 'Beregn hvor stor sparebuffer du trenger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn utgifter', text: 'Oppgi hva du bruker i måneden på nødvendige utgifter.' },
  { name: 'Velg antall måneder', text: 'Mange anbefaler 3–6 måneders utgifter.' },
  { name: 'Legg inn sparing', text: 'Oppgi det du har spart og hva du sparer per måned.' },
  { name: 'Se målet', text: 'Se hvor mye som mangler og når du er i mål.' },
];

const faqs = [
  { question: 'Hvor stor bør bufferen være?', answer: 'Mange anbefaler tre til seks måneders nødvendige utgifter. Har du ustabil inntekt eller forsørgeransvar, kan det være lurt å ha mer.' },
  { question: 'Hvor bør jeg ha bufferen?', answer: 'På en sparekonto du får tak i raskt, uten binding og med god rente.' },
  { question: 'Hva regnes som nødvendige utgifter?', answer: 'Bolig, mat, strøm, forsikring, lån, transport og andre faste utgifter du ikke kan kutte raskt.' },
];

const relatedTools = [
  { href: '/calculators/finance/fire-calculator', title: 'FIRE-kalkulator', description: 'Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og gå av tidlig' },
  { href: '/calculators/finance/compound-interest-calculator', title: 'Rentesrentekalkulator', description: 'Beregn hvordan sparing vokser med renters rente' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="emergency-fund-calculator"
          title="Buffersparing"
          description="Beregn hvor stor sparebuffer du trenger"
        />

        <section aria-label="Buffersparing">
          <EmergencyFundCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
