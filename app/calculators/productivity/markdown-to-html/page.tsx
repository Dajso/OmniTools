import { Metadata } from 'next';
import { MarkdownToHtml } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Markdown til HTML – gratis kalkulator på nett',
  description: 'Gjør om Markdown til HTML med forhåndsvisning. Gratis og uten registrering.',
  keywords: ['markdown', 'markdown til html', 'md til html', 'forhåndsvisning'],
  alternates: { canonical: '/calculators/productivity/markdown-to-html' },
  openGraph: {
    title: 'Markdown til HTML',
    description: 'Gjør om Markdown til HTML med forhåndsvisning',
    url: '/calculators/productivity/markdown-to-html',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Markdown til HTML',
  description: 'Gjør om Markdown til HTML med forhåndsvisning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv eller lim inn Markdown', text: 'Skriv i feltet til venstre, eller last inn et eksempel.' },
  { name: 'Se forhåndsvisningen', text: 'Forhåndsvisningen oppdateres mens du skriver.' },
  { name: 'Hent HTML-koden', text: 'Bytt til HTML-fanen og kopier koden.' },
];

const faqs = [
  { question: 'Hva er Markdown?', answer: 'Et enkelt tekstformat som gjør det lett å skrive overskrifter, lister og lenker med vanlige tegn.' },
  { question: 'Hvordan lager jeg en overskrift?', answer: 'Skriv # først i linjen. ## gir mindre overskrift.' },
  { question: 'Er HTML-en trygg å bruke?', answer: 'Sjekk og rens HTML-en hvis den kommer fra uvedkommende kilder før du viser den på et nettsted.' },
  { question: 'Støttes tabeller?', answer: 'Ikke alle utvidelser, så sjekk forhåndsvisningen.' },
];

const relatedTools = [
  { href: '/calculators/productivity/json-formatter', title: 'JSON-formaterer og validator', description: 'Formater og valider JSON-data' },
];

export default function MarkdownToHtmlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="markdown-to-html"
          title="Markdown til HTML"
          description="Gjør om Markdown til HTML med live forhåndsvisning og hurtigreferanse. Gratis og uten registrering."
        />

        <section aria-label="Markdown til HTML">
          <MarkdownToHtml />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
