import { Metadata } from 'next';
import { TextToBinaryConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tekst til binær – gratis kalkulator på nett',
  description: 'Gjør om tekst til binærkode og tilbake. Gratis og uten registrering.',
  keywords: ['tekst til binær', 'binærkode', 'ASCII', 'binær tekst'],
  alternates: { canonical: '/calculators/productivity/text-to-binary' },
  openGraph: {
    title: 'Tekst til binær',
    description: 'Gjør om tekst til binærkode og tilbake',
    url: '/calculators/productivity/text-to-binary',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tekst til binær',
  description: 'Gjør om tekst til binærkode og tilbake',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Tekst til binær, eller binær til tekst.' },
  { name: 'Skriv inn teksten eller binærkoden', text: 'Bruk 8 sifre per tegn for binær inndata.' },
  { name: 'Velg skilletegn', text: 'Mellomrom, bindestrek eller ingenting mellom hver byte.' },
  { name: 'Regn om', text: 'Trykk på knappen og kopier resultatet.' },
];

const faqs = [
  { question: 'Hvordan fungerer binærkode?', answer: 'Hvert tegn lagres som tall, og tallene skrives med 0 og 1. En byte har 8 sifre.' },
  { question: 'Hvordan blir bokstaver som å og ø kodet?', answer: 'De tar mer enn én byte i UTF-8, så de blir lengre enn vanlige bokstaver.' },
  { question: 'Hvorfor feiler binær til tekst?', answer: 'Antallet sifre må være delelig med 8, og skal bare inneholde 0 og 1.' },
  { question: 'Er dette kryptering?', answer: 'Nei. Binærkode er bare en annen måte å skrive teksten på.' },
];

const relatedTools = [
  { href: '/calculators/productivity/base64-converter', title: 'Base64-koding', description: 'Kod og dekod Base64-strenger' },
];

export default function TextToBinaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="text-to-binary"
          title="Tekst til binær"
          description="Gjør om tekst til binærkode og binærkode til tekst. Gratis og uten registrering."
        />

        <section aria-label="Tekst til binær">
          <TextToBinaryConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
