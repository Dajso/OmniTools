import { Metadata } from 'next';
import { MulchSoilCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Jord og barkflis – gratis kalkulator på nett',
  description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³. Gratis og uten registrering.',
  keywords: ['jord', 'barkflis', 'bed', 'kubikkmeter', 'hage'],
  alternates: { canonical: '/calculators/garden/mulch-soil-calculator' },
  openGraph: {
    title: 'Jord og barkflis',
    description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³',
    url: '/calculators/garden/mulch-soil-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Jord og barkflis',
  description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg materiale', text: 'Bark/mulch, matjord eller grus og stein.' },
  { name: 'Oppgi flaten', text: 'Lengde og bredde i meter, eller diameter hvis flaten er rund.' },
  { name: 'Velg lagtykkelse', text: 'Bark: 5–10 cm, matjord: 10–20 cm, grus: 5–10 cm.' },
  { name: 'Les av mengden', text: 'Se volum i m³ og liter, antall sekker og omtrentlig vekt.' },
];

const faqs = [
  { question: 'Hvor tykt lag med bark bør jeg ha?', answer: '5–8 cm holder for å hindre ugress, og 8–10 cm gir bedre isolasjon rundt busker og trær. Hold barken litt unna stammen.' },
  { question: 'Lønner det seg å bestille løs vekt?', answer: 'Ofte, når du trenger mer enn rundt 2 m³. Da er levering av løs masse som regel billigere enn sekker, men spør leverandøren om pris per m³ og leveringsgebyr.' },
  { question: 'Hvorfor bør jeg legge til litt ekstra?', answer: 'Jord og bark setter seg, og noe går tapt ved utlegging. Legg til 5–10 %.' },
  { question: 'Hvor nøyaktig er vekten?', answer: 'Vekten er et grovt anslag med 320 kg/m³ for bark, 1200 kg/m³ for jord og 1600 kg/m³ for grus. Fuktig masse veier mer.' },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/compost-calculator', title: 'Kompost (C:N-forhold)', description: 'Regn ut karbon–nitrogen-forholdet i komposten' },
  { href: '/calculators/garden/potting-soil-calculator', title: 'Pottejord', description: 'Regn ut hvor mye pottejord du trenger til potter og kasser' },
];

export default function MulchSoilCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mulch-soil-calculator"
          title="Jord og barkflis"
          description="Regn ut hvor mye bark, matjord eller grus du trenger til bed og gangstier, i liter, m³, sekker og kilo. Gratis og uten registrering."
        />

        <section aria-label="Jord og barkflis">
          <MulchSoilCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
