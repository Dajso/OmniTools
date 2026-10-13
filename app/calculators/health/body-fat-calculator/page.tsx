import { Metadata } from 'next';
import { BodyFatCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kroppsfettkalkulator – gratis kalkulator på nett',
  description: 'Beregn fettprosent med Navy-formelen. Gratis og uten registrering.',
  keywords: ['fettprosent', 'kroppsfett', 'Navy-formelen', 'kroppssammensetning'],
  alternates: { canonical: '/calculators/health/body-fat-calculator' },
  openGraph: {
    title: 'Kroppsfettkalkulator',
    description: 'Beregn fettprosent med Navy-formelen',
    url: '/calculators/health/body-fat-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kroppsfettkalkulator',
  description: 'Beregn fettprosent med Navy-formelen',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg kjønn', text: 'Formelen er ulik for menn og kvinner.' },
  { name: 'Mål deg', text: 'Høyde, livvidde, halsomkrets (og hofter for kvinner) i cm.' },
  { name: 'Les resultatet', text: 'Se fettprosent og kategori.' },
];

const faqs = [
  { question: 'Hva er Navy-metoden?', answer: 'En enkel formel utviklet av det amerikanske forsvaret for å anslå kroppsfett ut fra kroppsmål.' },
  { question: 'Hvor nøyaktig er den?', answer: 'Avviket kan være flere prosentpoeng. DEXA-skanning eller bioimpedans gir mer presise tall.' },
  { question: 'Hvordan måler jeg riktig?', answer: 'Mål livvidden ved navlen etter at du har pustet ut, og halsen under strupehodet.' },
  { question: 'Hva er sunt kroppsfett?', answer: 'Typisk 10–20 % for menn og 18–28 % for kvinner, men det varierer med alder og aktivitet.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'KMI-kalkulator (BMI)', description: 'Beregn kroppsmasseindeks (KMI) i kilo og centimeter' },
  { href: '/calculators/health/tdee-calculator', title: 'Kalorikalkulator (TDEE)', description: 'Beregn hvor mange kalorier du forbruker per dag' },
];

export default function BodyFatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="body-fat-calculator"
          title="Kroppsfettkalkulator"
          description="Anslå kroppsfettprosenten din med Navy-metoden. Gratis og uten registrering."
        />

        <section aria-label="Kroppsfettkalkulator">
          <BodyFatCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
