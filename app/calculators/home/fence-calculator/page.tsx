import { Metadata } from 'next';
import { FenceCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gjerdekalkulator – gratis kalkulator på nett',
  description: 'Beregn materialer til gjerde: stolper, bord og fester. Gratis og uten registrering.',
  keywords: ['gjerde', 'gjerdestolper', 'gjerdemateriell', 'tomtegrense'],
  alternates: { canonical: '/calculators/home/fence-calculator' },
  openGraph: {
    title: 'Gjerdekalkulator',
    description: 'Beregn materialer til gjerde: stolper, bord og fester',
    url: '/calculators/home/fence-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gjerdekalkulator',
  description: 'Beregn materialer til gjerde: stolper, bord og fester',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi lengde og høyde', text: 'Skriv inn total lengde i meter og gjerdehøyde i centimeter.' },
  { name: 'Velg stolpeavstand', text: 'Vanlig avstand mellom stolper er 1,8–2,4 meter.' },
  { name: 'Oppgi bordbredde og mellomrom', text: 'Bredde og mellomrom i millimeter avgjør hvor mange bord som trengs.' },
  { name: 'Les resultatet', text: 'Se antall stolper, løsholter, bord og sekker støpemasse.' },
];

const faqs = [
  { question: 'Hvor dypt bør stolpene stå?', answer: 'Minst 80–100 cm for å stå i telen. I områder med mye tele kan det trenges dypere fundamentering.' },
  { question: 'Må jeg søke om å sette opp gjerde?', answer: 'Ofte ikke, men det kommer an på høyde, plassering og reguleringsplan. Sjekk reglene i kommunen. Gjerde i nabogrense bør avtales med naboen.' },
  { question: 'Hvor mange løsholter trenger jeg?', answer: 'To per felt til gjerder opp til 150 cm, og tre ved høyere gjerder.' },
  { question: 'Tar kalkulatoren hensyn til porter?', answer: 'Ja, hver port gir én ekstra stolpe. Portbladene og beslag må du regne for deg.' },
];

const relatedTools = [
  { href: '/calculators/home/decking-calculator', title: 'Terrassekalkulator', description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer' },
  { href: '/calculators/home/lumber-calculator', title: 'Trelastkalkulator', description: 'Beregn mengde trelast i løpemeter og m³' },
];

export default function FenceCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fence-calculator"
          title="Gjerdekalkulator"
          description="Regn ut hvor mange stolper, løsholter og bord du trenger til et gjerde. Gratis og uten registrering."
        />

        <section aria-label="Gjerdekalkulator">
          <FenceCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
