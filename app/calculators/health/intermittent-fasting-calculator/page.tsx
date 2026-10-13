import { Metadata } from 'next';
import { IntermittentFastingCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidsstyrt spising (intermittent faste) – gratis kalkulator på nett',
  description: 'Hold oversikt over fastevinduet ditt med 16:8 og 18:6. Gratis og uten registrering.',
  keywords: ['intermittent faste', 'fastetimer', '16:8', 'tidsbegrenset spising'],
  alternates: { canonical: '/calculators/health/intermittent-fasting-calculator' },
  openGraph: {
    title: 'Tidsstyrt spising (intermittent faste)',
    description: 'Hold oversikt over fastevinduet ditt med 16:8 og 18:6',
    url: '/calculators/health/intermittent-fasting-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidsstyrt spising (intermittent faste)',
  description: 'Hold oversikt over fastevinduet ditt med 16:8 og 18:6',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg protokoll', text: '16:8 er mest brukt. Du kan også velge egne timer.' },
  { name: 'Sett starttid', text: 'Oppgi klokkeslettet for siste måltid.' },
  { name: 'Se status', text: 'Se når fasten slutter og hvilken fase kroppen er i.' },
];

const faqs = [
  { question: 'Hva er intervallfasting?', answer: 'Et spisemønster der du bytter mellom perioder med faste og perioder der du spiser.' },
  { question: 'Er det trygt for alle?', answer: 'Nei. Gravide, ammende, barn og unge, personer med diabetes eller spiseforstyrrelser bør ikke faste uten råd fra lege.' },
  { question: 'Er tidslinjen for fastefasene eksakt?', answer: 'Tidspunktene er veiledende. Kroppens reaksjoner varierer mye fra person til person.' },
  { question: 'Kan jeg drikke under fasten?', answer: 'Vann, svart kaffe og usøtet te regnes vanligvis som greit.' },
];

const relatedTools = [
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

export default function IntermittentFastingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="intermittent-fasting-calculator"
          title="Tidsstyrt spising (intermittent faste)"
          description="Planlegg fastevinduet ditt med 16:8, 18:6 og andre protokoller, og se når du kan spise igjen. Gratis og uten registrering."
        />

        <section aria-label="Tidsstyrt spising (intermittent faste)">
          <IntermittentFastingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
