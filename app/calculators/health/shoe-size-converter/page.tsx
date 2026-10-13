import { Metadata } from 'next';
import { ShoeSizeConverter } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Skostørrelse – gratis kalkulator på nett',
  description: 'Regn om skostørrelser mellom EU, UK og US. Gratis og uten registrering.',
  keywords: ['skostørrelse', 'sko', 'EU', 'UK', 'US', 'fotlengde'],
  alternates: { canonical: '/calculators/health/shoe-size-converter' },
  openGraph: {
    title: 'Skostørrelse',
    description: 'Regn om skostørrelser mellom EU, UK og US',
    url: '/calculators/health/shoe-size-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Skostørrelse',
  description: 'Regn om skostørrelser mellom EU, UK og US',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg system', text: 'Europa er standard i Norge.' },
  { name: 'Skriv inn størrelse', text: 'For eksempel 42.' },
  { name: 'Les resultatet', text: 'Se størrelser i alle systemer og fotlengde.' },
];

const faqs = [
  { question: 'Hvordan henger europeisk størrelse og fotlengde sammen?', answer: 'Én størrelse tilsvarer 2/3 cm. Skoens innvendige lengde er fotlengden pluss ca. 1,5 cm.' },
  { question: 'Er størrelsene like hos alle merker?', answer: 'Nei. Produsenter varierer. Se merkets egen tabell.' },
  { question: 'Hvor mye plass bør det være foran tærne?', answer: 'Ca. 1–1,5 cm.' },
  { question: 'Når bør jeg måle foten?', answer: 'På ettermiddagen, når foten er størst.' },
];

const relatedTools = [
  { href: '/calculators/health/ring-size-converter', title: 'Ringstørrelse', description: 'Regn om ringstørrelser mellom omkrets, EU, UK og US' },
];

export default function ShoeSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="shoe-size-converter"
          title="Skostørrelse"
          description="Regn om skostørrelse mellom Europa/Norge, USA, Storbritannia og fotlengde i cm. Gratis og uten registrering."
        />

        <section aria-label="Skostørrelse">
          <ShoeSizeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
