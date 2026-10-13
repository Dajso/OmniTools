import { Metadata } from 'next';
import { FlowerStemCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Blomster til bryllup – gratis kalkulator på nett',
  description: 'Regn ut hvor mange blomsterstilker du trenger til brudebukett og bordpynt. Gratis og uten registrering.',
  keywords: ['blomster', 'brudebukett', 'bordpynt', 'stilker', 'blomsterdekorasjon'],
  alternates: { canonical: '/calculators/wedding/flower-stem-counter' },
  openGraph: {
    title: 'Blomster til bryllup',
    description: 'Regn ut hvor mange blomsterstilker du trenger til brudebukett og bordpynt',
    url: '/calculators/wedding/flower-stem-counter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Blomster til bryllup',
  description: 'Regn ut hvor mange blomsterstilker du trenger til brudebukett og bordpynt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg til arrangement', text: 'Velg type, for eksempel brudebukett eller bordpynt.' },
  { name: 'Oppgi antall', text: 'Hvor mange av hver type du trenger.' },
  { name: 'Les av totalen', text: 'Se stilker per type og samlet antall.' },
  { name: 'Legg på litt ekstra', text: 'Kjøp 10–15 % ekstra til skader og justeringer.' },
];

const faqs = [
  { question: 'Hvor mange stilker går det i en brudebukett?', answer: 'Rundt 30 stilker i en typisk brudebukett. Det avhenger av blomstertype og størrelse.' },
  { question: 'Hvor mange blomster trenger jeg til bordpynt?', answer: 'Omtrent 12 stilker til en liten pynt og 25 til en stor.' },
  { question: 'Bør jeg bestille ekstra?', answer: 'Ja, 10–15 % ekstra gir rom for skadde stilker og endringer.' },
  { question: 'Er tallene nøyaktige?', answer: 'De er gjennomsnitt. Blomsterdekoratøren din kan gi et mer presist tall ut fra blomstertypen.' },
];

const relatedTools = [
  { href: '/calculators/wedding/budget-allocator', title: 'Bryllupsbudsjett', description: 'Fordel bryllupsbudsjettet på lokale, mat, foto, kjole og mer' },
  { href: '/calculators/wedding/wedding-cake-calculator', title: 'Bryllupskake', description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester' },
];

export default function FlowerStemCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="flower-stem-counter"
          title="Blomster til bryllup"
          description="Regn ut hvor mange blomsterstilker du trenger til brudebukett, forlover-/brudepikebukett, knapphullsblomster og bordpynt. Gratis og uten registrering."
        />

        <section aria-label="Blomster til bryllup">
          <FlowerStemCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
