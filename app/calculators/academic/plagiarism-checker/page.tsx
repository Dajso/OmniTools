import { Metadata } from 'next';
import { PlagiarismChecker } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tekstsammenligning – gratis kalkulator på nett',
  description: 'Sammenlign to tekster for å finne likheter og forskjeller. Gratis og uten registrering.',
  keywords: ['tekstsammenligning', 'plagiat', 'likhet', 'duplikat'],
  alternates: { canonical: '/calculators/academic/plagiarism-checker' },
  openGraph: {
    title: 'Tekstsammenligning',
    description: 'Sammenlign to tekster for å finne likheter og forskjeller',
    url: '/calculators/academic/plagiarism-checker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tekstsammenligning',
  description: 'Sammenlign to tekster for å finne likheter og forskjeller',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn originalteksten', text: 'Skriv inn eller lim inn første tekst.' },
  { name: 'Lim inn teksten du vil sammenligne', text: 'Den andre teksten.' },
  { name: 'Sammenlign', text: 'Trykk på knappen for å regne ut likheten.' },
  { name: 'Les av resultatet', text: 'Se likhetsprosent, felles ord og felles fraser.' },
];

const faqs = [
  { question: 'Er dette en plagiatkontroll som skolen godtar?', answer: 'Nei. Kalkulatoren sammenligner bare to tekster du selv limer inn. Den søker ikke i databaser, og skoler bruker egne verktøy.' },
  { question: 'Hvordan regnes likheten ut?', answer: 'Den bygger på felles ord og sammenfallende frasebiter på flere ord. Høy prosent betyr at tekstene ligner mye.' },
  { question: 'Lagres tekstene mine?', answer: 'Nei. Sammenligningen skjer i nettleseren din.' },
];

const relatedTools = [
  { href: '/calculators/productivity/word-counter', title: 'Ordteller', description: 'Tell ord, tegn og setninger i en tekst' },
];

export default function PlagiarismCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="plagiarism-checker"
          title="Tekstsammenligning"
          description="Sammenlign to tekster og finn likheter, felles ord og frasene som er like. Støtter norske tegn (æ, ø og å). Gratis og uten registrering."
        />

        <section aria-label="Tekstsammenligning">
          <PlagiarismChecker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
