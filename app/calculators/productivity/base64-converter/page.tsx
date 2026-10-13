import { Metadata } from 'next';
import { Base64Converter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Base64-koding – gratis kalkulator på nett',
  description: 'Kod og dekod Base64-strenger. Gratis og uten registrering.',
  keywords: ['Base64', 'Base64-koding', 'dekoding', 'enkoding'],
  alternates: { canonical: '/calculators/productivity/base64-converter' },
  openGraph: {
    title: 'Base64-koding',
    description: 'Kod og dekod Base64-strenger',
    url: '/calculators/productivity/base64-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64-koding',
  description: 'Kod og dekod Base64-strenger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Kod tekst til Base64, eller dekod tilbake.' },
  { name: 'Skriv inn teksten', text: 'Lim inn teksten eller Base64-strengen.' },
  { name: 'Les av resultatet', text: 'Resultatet vises med en gang.' },
  { name: 'Kopier', text: 'Kopier resultatet med ett klikk.' },
];

const faqs = [
  { question: 'Hva er Base64?', answer: 'En måte å skrive binære data som tekst, brukt i e-post, nettadresser og API-er.' },
  { question: 'Er Base64 kryptering?', answer: 'Nei. Alle kan dekode det. Bruk ikke Base64 for å skjule passord.' },
  { question: 'Fungerer det med æ, ø og å?', answer: 'Ja, teksten kodes som UTF-8.' },
  { question: 'Hva er URL-sikker koding?', answer: 'En variant som bytter + og / med - og _, så strengen kan brukes i nettadresser.' },
];

const relatedTools = [
  { href: '/calculators/productivity/text-to-binary', title: 'Tekst til binær', description: 'Gjør om tekst til binærkode og tilbake' },
  { href: '/calculators/productivity/base64-converter', title: 'Base64-koding', description: 'Kod og dekod Base64-strenger' },
];

export default function Base64ConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="base64-converter"
          title="Base64-koding"
          description="Kod og dekod Base64, også URL-sikker variant. Gratis og uten registrering."
        />

        <section aria-label="Base64-koding">
          <Base64Converter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
