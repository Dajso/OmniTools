import { Metadata } from 'next';
import { CarpetCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Teppekalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye teppe eller gulvbelegg du trenger til et rom. Gratis og uten registrering.',
  keywords: ['teppe', 'gulvbelegg', 'areal', 'rom', 'belegg'],
  alternates: { canonical: '/calculators/home/carpet-calculator' },
  openGraph: {
    title: 'Teppekalkulator',
    description: 'Beregn hvor mye teppe eller gulvbelegg du trenger til et rom',
    url: '/calculators/home/carpet-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Teppekalkulator',
  description: 'Beregn hvor mye teppe eller gulvbelegg du trenger til et rom',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Oppgi lengde og bredde i meter.' },
  { name: 'Velg rullbredde', text: 'Teppe og belegg selges gjerne i 2, 3, 4 eller 5 meter brede ruller.' },
  { name: 'Skriv inn pris', text: 'Oppgi prisen per kvadratmeter for å få et kostnadsanslag.' },
  { name: 'Les resultatet', text: 'Se løpemeter å kjøpe, hvor mye som blir til overs og anslått pris.' },
];

const faqs = [
  { question: 'Hva er løpemeter?', answer: 'Det er lengden på rullen du kjøper. Du betaler for rullbredden gange løpemeter, også for det som kappes bort.' },
  { question: 'Hvilken leggeretning velger kalkulatoren?', answer: 'Den prøver begge retninger og velger den som gir minst forbruk. Husk at mønster og lysfall kan gjøre at du vil legge på en bestemt måte.' },
  { question: 'Hvorfor er arealet jeg betaler for større enn rommet?', answer: 'Rullbredden passer sjelden akkurat, og det trengs ca. 10 cm ekstra per bane til tilpasning langs vegg.' },
  { question: 'Gjelder dette også for vinylbelegg?', answer: 'Ja, beregningen fungerer for alle gulvbelegg som selges på rull.' },
];

const relatedTools = [
  { href: '/calculators/home/tile-calculator', title: 'Flisekalkulator', description: 'Beregn hvor mange fliser du trenger til gulv eller vegg' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function CarpetCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="carpet-calculator"
          title="Teppekalkulator"
          description="Regn ut hvor mange løpemeter teppe eller gulvbelegg du må kjøpe, og hva det koster. Gratis og uten registrering."
        />

        <section aria-label="Teppekalkulator">
          <CarpetCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
