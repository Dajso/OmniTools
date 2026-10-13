import { Metadata } from 'next';
import { URLEncoder } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'URL-koding – gratis kalkulator på nett',
  description: 'Kod og dekod URL-er for bruk på nett. Gratis og uten registrering.',
  keywords: ['URL-koding', 'prosentkoding', 'encodeURIComponent', 'URL-dekoding'],
  alternates: { canonical: '/calculators/productivity/url-encoder' },
  openGraph: {
    title: 'URL-koding',
    description: 'Kod og dekod URL-er for bruk på nett',
    url: '/calculators/productivity/url-encoder',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL-koding',
  description: 'Kod og dekod URL-er for bruk på nett',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Kod eller dekod.' },
  { name: 'Velg metode', text: 'encodeURIComponent koder alt, encodeURI lar URL-strukturen stå.' },
  { name: 'Skriv inn teksten', text: 'Lim inn teksten eller URL-en.' },
  { name: 'Kopier', text: 'Kopier resultatet.' },
];

const faqs = [
  { question: 'Hvorfor koder man URL-er?', answer: 'Bare noen tegn er tillatt i en URL. Andre, som mellomrom og æ, ø og å, må skrives som %-koder.' },
  { question: 'Hva er forskjellen på de to metodene?', answer: 'encodeURIComponent koder også tegn som /, ? og &, og passer til deler av en URL. encodeURI beholder dem og passer til en hel URL.' },
  { question: 'Hvordan blir æ, ø og å kodet?', answer: 'Som %C3%A6, %C3%B8 og %C3%A5 (UTF-8).' },
  { question: 'Hva er %20?', answer: 'Et mellomrom.' },
];

const relatedTools = [
  { href: '/calculators/productivity/base64-converter', title: 'Base64-koding', description: 'Kod og dekod Base64-strenger' },
];

export default function URLEncoderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="url-encoder"
          title="URL-koding"
          description="Kod og dekod URL-er og tegn med prosentkoding, med oversikt over vanlige tegn. Gratis og uten registrering."
        />

        <section aria-label="URL-koding">
          <URLEncoder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
