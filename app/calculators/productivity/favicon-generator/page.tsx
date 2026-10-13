import { Metadata } from 'next';
import { FaviconGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Favicon-generator – gratis kalkulator på nett',
  description: 'Lag favicon fra tekst eller emoji. Gratis og uten registrering.',
  keywords: ['favicon', 'emoji-favicon', 'nettstedsikon', 'faviconlager'],
  alternates: { canonical: '/calculators/productivity/favicon-generator' },
  openGraph: {
    title: 'Favicon-generator',
    description: 'Lag favicon fra tekst eller emoji',
    url: '/calculators/productivity/favicon-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Favicon-generator',
  description: 'Lag favicon fra tekst eller emoji',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn tekst eller emoji', text: 'Én eller to bokstaver, eller en emoji, fungerer best.' },
  { name: 'Velg farger og stil', text: 'Velg bakgrunn, tekstfarge, skrift og hjørneradius.' },
  { name: 'Se forhåndsvisningen', text: 'Se hvordan favicon ser ut i ulike størrelser.' },
  { name: 'Last ned', text: 'Last ned én størrelse eller alle.' },
];

const faqs = [
  { question: 'Hva er en favicon?', answer: 'Det lille ikonet som vises i nettleserfanen og bokmerker.' },
  { question: 'Hvilke størrelser trenger jeg?', answer: '16, 32 og 180 piksler dekker de fleste behov. Mange nettsteder bruker også 192 og 512 piksler til apper.' },
  { question: 'Hvilket format bør jeg bruke?', answer: 'PNG fungerer i alle moderne nettlesere. SVG er et godt alternativ.' },
  { question: 'Får æ, ø og å plass?', answer: 'Ja, men bruk gjerne en stor, tydelig skrift.' },
];

const relatedTools = [
  { href: '/calculators/productivity/hex-to-rgb', title: 'HEX til RGB', description: 'Gjør om HEX-fargekoder til RGB-verdier' },
];

export default function FaviconGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="favicon-generator"
          title="Favicon-generator"
          description="Lag favicon fra tekst eller emoji, med egne farger og stil, og last ned i flere størrelser. Gratis og uten registrering."
        />

        <section aria-label="Favicon-generator">
          <FaviconGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
