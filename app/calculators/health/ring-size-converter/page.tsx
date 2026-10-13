import { Metadata } from 'next';
import { RingSizeConverter } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ringstørrelse – gratis kalkulator på nett',
  description: 'Regn om ringstørrelser mellom omkrets, EU, UK og US. Gratis og uten registrering.',
  keywords: ['ringstørrelse', 'ring', 'smykke', 'omkrets', 'ringmål'],
  alternates: { canonical: '/calculators/health/ring-size-converter' },
  openGraph: {
    title: 'Ringstørrelse',
    description: 'Regn om ringstørrelser mellom omkrets, EU, UK og US',
    url: '/calculators/health/ring-size-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ringstørrelse',
  description: 'Regn om ringstørrelser mellom omkrets, EU, UK og US',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg system', text: 'Europa/Norge er vanligvis innvendig omkrets i mm.' },
  { name: 'Skriv inn størrelsen', text: 'For eksempel 54.' },
  { name: 'Les resultatet', text: 'Se størrelser i alle systemer, diameter og omkrets.' },
];

const faqs = [
  { question: 'Hvordan måler jeg ringstørrelse?', answer: 'Legg en papirstrimmel rundt fingeren, marker, og mål lengden i mm. Det er omkretsen.' },
  { question: 'Hva er vanlige størrelser?', answer: 'Kvinner ofte 50–58, menn 58–66.' },
  { question: 'Hvordan bruker norske gullsmeder størrelse?', answer: 'De fleste angir innvendig omkrets i mm.' },
  { question: 'Hvorfor varierer det?', answer: 'Fingeren er størst på ettermiddagen eller når det er varmt.' },
];

const relatedTools = [
  { href: '/calculators/health/shoe-size-converter', title: 'Skostørrelse', description: 'Regn om skostørrelser mellom EU, UK og US' },
];

export default function RingSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ring-size-converter"
          title="Ringstørrelse"
          description="Regn om ringstørrelse mellom Europa/Norge (omkrets i mm), USA og Storbritannia. Gratis og uten registrering."
        />

        <section aria-label="Ringstørrelse">
          <RingSizeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
