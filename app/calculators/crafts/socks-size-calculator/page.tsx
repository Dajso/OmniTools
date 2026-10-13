import { Metadata } from 'next';
import { SocksSizeCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sokkestørrelse – gratis kalkulator på nett',
  description: 'Regn ut mål og maskeantall til sokker ut fra fotmål. Gratis og uten registrering.',
  keywords: ['sokker', 'strikke sokker', 'fotmål', 'masker', 'hekle sokker'],
  alternates: { canonical: '/calculators/crafts/socks-size-calculator' },
  openGraph: {
    title: 'Sokkestørrelse',
    description: 'Regn ut mål og maskeantall til sokker ut fra fotmål',
    url: '/calculators/crafts/socks-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sokkestørrelse',
  description: 'Regn ut mål og maskeantall til sokker ut fra fotmål',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål foten', text: 'Fotlengde og omkrets over tåleddene, i cm.' },
  { name: 'Legg inn fastheten din', text: 'Masker og pinner per 10 cm i glattstrikk.' },
  { name: 'Velg garntykkelse', text: 'Sokkegarn, sportsgarn eller lett garn.' },
  { name: 'Les av maskeantallene', text: 'Se opplegg, hælmasker, kilemasker og tåfelling.' },
];

const faqs = [
  { question: 'Hvor mye mindre bør sokken være enn foten?', answer: 'Rundt 10 % mindre i omkrets, slik at den sitter tett. Kalkulatoren regner med det.' },
  { question: 'Hvor stor fotlengde skal jeg regne med?', answer: 'Mål foten fra hælen til tuppen av den lengste tåen. Sokken blir litt lengre enn foten før tåfellingen starter.' },
  { question: 'Hvilken skostørrelse har jeg?', answer: 'Kalkulatoren regner EU-størrelse ut fra fotlengden. Det er veiledende, og størrelsene varierer litt mellom merker.' },
  { question: 'Hvor mye garn trenger jeg?', answer: 'Rundt 300–400 m til et par vanlige sokker i sokkegarn. Lengre legg krever mer.' },
];

const relatedTools = [
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Hekle lue', description: 'Regn ut mål til hekla luer ut fra hodeomkrets' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Strikkeoppskrift til din strikkefasthet', description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp' },
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Garnbytte', description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift' },
];

export default function SocksSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="socks-size-calculator"
          title="Sokkestørrelse"
          description="Regn ut mål og maskeantall til sokker, ut fra fotlengde, fotomkrets og strikkefasthet. Med skostørrelse (EU) og garnbehov. Gratis og uten registrering."
        />

        <section aria-label="Sokkestørrelse">
          <SocksSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
