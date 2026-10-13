import { Metadata } from 'next';
import { CitationGenerator } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kildehenvisning (APA/MLA) – gratis kalkulator på nett',
  description: 'Lag riktig formaterte kildehenvisninger for bøker og nettsider. Gratis og uten registrering.',
  keywords: ['kildehenvisning', 'APA', 'MLA', 'litteraturliste', 'referanse'],
  alternates: { canonical: '/calculators/academic/citation-generator' },
  openGraph: {
    title: 'Kildehenvisning (APA/MLA)',
    description: 'Lag riktig formaterte kildehenvisninger for bøker og nettsider',
    url: '/calculators/academic/citation-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kildehenvisning (APA/MLA)',
  description: 'Lag riktig formaterte kildehenvisninger for bøker og nettsider',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg stil og kildetype', text: 'APA er mest brukt ved norske universiteter og høgskoler. Velg bok, nettside eller tidsskriftartikkel.' },
  { name: 'Fyll inn opplysningene', text: 'Forfattere, tittel, år, forlag og eventuelt nettadresse eller DOI.' },
  { name: 'Lag kildehenvisningen', text: 'Trykk på knappen og se ferdig formatert tekst.' },
  { name: 'Kopier og kontroller', text: 'Kopier teksten til litteraturlista, og sjekk den mot retningslinjene til skolen din.' },
];

const faqs = [
  { question: 'Hvilken stil skal jeg bruke?', answer: 'Det avhenger av studiested og fag. Mange norske universiteter og høgskoler bruker APA 7. Sjekk alltid retningslinjene til institusjonen din, for noen bruker for eksempel Chicago, Harvard eller Vancouver.' },
  { question: 'Hva betyr mfl. og u.å.?', answer: 'Mfl. står for «med flere» og brukes for mange forfattere. U.å. står for «uten år» når årstall mangler. Engelsk tilsvarer «et al.» og «n.d.».' },
  { question: 'Må jeg ha med hentedato?', answer: 'I APA er hentedato bare nødvendig for sider som endrer seg ofte. I MLA oppgis hentedato for nettsider.' },
  { question: 'Er resultatet alltid riktig?', answer: 'Kalkulatoren er et hjelpemiddel. Kursiv markeres med stjerner i teksten, og detaljer for spesialtilfeller må du kontrollere selv.' },
];

export default function CitationGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="citation-generator"
          title="Kildehenvisning (APA/MLA)"
          description="Lag kildehenvisninger i APA 7 og MLA 9 for bøker, nettsider og tidsskriftartikler, med norske forkortelser som utg., mfl. og u.å. Gratis og uten registrering."
        />

        <section aria-label="Kildehenvisning (APA/MLA)">
          <CitationGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
      </main>
    </>
  );
}
