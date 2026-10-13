import { Metadata } from 'next';
import { BusinessNameGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Firmanavn-generator – gratis kalkulator på nett',
  description: 'Få forslag til kreative firmanavn. Gratis og uten registrering.',
  keywords: ['firmanavn', 'bedriftsnavn', 'merkenavn', 'navnegenerator'],
  alternates: { canonical: '/calculators/creator/business-name-generator' },
  openGraph: {
    title: 'Firmanavn-generator',
    description: 'Få forslag til kreative firmanavn',
    url: '/calculators/creator/business-name-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Firmanavn-generator',
  description: 'Få forslag til kreative firmanavn',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg bransje', text: 'For eksempel teknologi, mat eller rådgivning.' },
  { name: 'Velg navnestil', text: 'Moderne, klassisk, leken, profesjonell eller abstrakt.' },
  { name: 'Legg til et stikkord (valgfritt)', text: 'Et ord som skal inngå i navnene.' },
  { name: 'Lag navn', text: 'Marker favorittene dine.' },
];

const faqs = [
  { question: 'Hvordan sjekker jeg om navnet er ledig?', answer: 'Sjekk Brønnøysundregistrene for firmanavn, Patentstyret for varemerker, og et domeneregister for domenet (for eksempel .no).' },
  { question: 'Kan jeg bruke navnet som domene?', answer: 'Det avhenger av om domenet er ledig. Sjekk hos en domeneregistrar.' },
  { question: 'Må jeg ha AS i navnet?', answer: 'Aksjeselskap må ha «AS» eller «Aksjeselskap» i firmanavnet. Enkeltpersonforetak trenger ikke.' },
  { question: 'Hvor mange navn får jeg?', answer: 'Ti forslag om gangen. Trykk «Lag navn» igjen for flere.' },
];

const relatedTools = [
  { href: '/calculators/creator/signature-generator', title: 'Signaturgenerator', description: 'Lag signaturer i håndskriftstil til dokumenter og e-post' },
];

export default function BusinessNameGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="business-name-generator"
          title="Firmanavn-generator"
          description="Få forslag til firmanavn ut fra bransje og stil, med norske ord. Gratis og uten registrering."
        />

        <section aria-label="Firmanavn-generator">
          <BusinessNameGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
