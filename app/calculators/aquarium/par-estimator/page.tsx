import { Metadata } from 'next';
import { PAREstimatorCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lysstyrke (PAR) i akvarium – gratis kalkulator på nett',
  description: 'Anslå hvordan vanndybde svekker lyset (PAR) i plantet akvarium. Gratis og uten registrering.',
  keywords: ['PAR', 'akvarielys', 'lysstyrke', 'plantet akvarium', 'vanndybde'],
  alternates: { canonical: '/calculators/aquarium/par-estimator' },
  openGraph: {
    title: 'Lysstyrke (PAR) i akvarium',
    description: 'Anslå hvordan vanndybde svekker lyset (PAR) i plantet akvarium',
    url: '/calculators/aquarium/par-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lysstyrke (PAR) i akvarium',
  description: 'Anslå hvordan vanndybde svekker lyset (PAR) i plantet akvarium',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi PAR ved overflaten', text: 'Bruk målt verdi eller oppgitt verdi fra armaturet.' },
  { name: 'Oppgi vanndybde', text: 'Avstand fra overflaten til substratet i cm.' },
  { name: 'Velg vannklarhet', text: 'Fra krystallklart til tanninfarget eller grønt vann.' },
  { name: 'Les av resultatet', text: 'Se PAR ved bunnen og hvilke planter som passer.' },
];

const faqs = [
  { question: 'Hva er PAR?', answer: 'Fotosyntetisk aktiv stråling, altså lyset plantene faktisk kan bruke, målt i µmol/m²/s.' },
  { question: 'Hvor mye PAR trenger akvarieplanter?', answer: 'Planter med lite behov klarer seg på 15–40, vanlige stengelplanter trenger 80 eller mer, og teppeplanter 150 eller mer ved bunnen.' },
  { question: 'Hvorfor faller lyset med dybden?', answer: 'Vannet og partikler i det absorberer lys. Jo mer farget eller grumsete vannet er, desto fortere svekkes lyset.' },
  { question: 'Er tallene nøyaktige?', answer: 'Nei, de er et anslag. Måler du med PAR-meter, får du best resultat.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/co2-bubble-calculator', title: 'CO₂-bobler', description: 'Regn ut CO₂-konsentrasjon fra KH og pH, og anbefalt boblefrekvens' },
  { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Gjødseldosering (EI)', description: 'Regn ut EI-dosering av gjødsel til plantet akvarium' },
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
];

export default function PAREstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="par-estimator"
          title="Lysstyrke (PAR) i akvarium"
          description="Anslå hvor mye lys (PAR) som når bunnen av akvariet ut fra vanndybde og vannklarhet, og se hvilke planter som passer. Gratis og uten registrering."
        />

        <section aria-label="Lysstyrke (PAR) i akvarium">
          <PAREstimatorCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
