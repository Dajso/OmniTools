import { Metadata } from 'next';
import { CO2BubbleCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'CO₂-bobler – gratis kalkulator på nett',
  description: 'Regn ut CO₂-konsentrasjon fra KH og pH, og anbefalt boblefrekvens. Gratis og uten registrering.',
  keywords: ['CO2', 'KH', 'pH', 'plantet akvarium', 'bobler'],
  alternates: { canonical: '/calculators/aquarium/co2-bubble-calculator' },
  openGraph: {
    title: 'CO₂-bobler',
    description: 'Regn ut CO₂-konsentrasjon fra KH og pH, og anbefalt boblefrekvens',
    url: '/calculators/aquarium/co2-bubble-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CO₂-bobler',
  description: 'Regn ut CO₂-konsentrasjon fra KH og pH, og anbefalt boblefrekvens',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål KH og pH', text: 'Bruk dråpetest eller sonde, og oppgi KH i °dH.' },
  { name: 'Oppgi volumet', text: 'Akvariumvolum i liter.' },
  { name: 'Les av CO₂-nivået', text: 'Se konsentrasjonen i ppm og om den er lav, ideell eller farlig.' },
  { name: 'Juster bobletakten', text: 'Følg forslaget og endre litt om gangen.' },
];

const faqs = [
  { question: 'Hva er ideelt CO₂-nivå i et plantet akvarium?', answer: 'Rundt 15–30 mg/l. Over 35 mg/l øker risikoen for at fisk får problemer.' },
  { question: 'Hvordan regnes CO₂ ut fra KH og pH?', answer: 'CO₂ (mg/l) = 3,0 × KH × 10^(7,0 − pH). Metoden er et anslag og gir mest mening i ferskvann uten buffer-tilsetninger.' },
  { question: 'Hvor fort bør jeg øke CO₂?', answer: 'Gradvis over flere dager, og følg med på fiskene. Fisk som går etter luft ved overflaten får for mye CO₂.' },
  { question: 'Hva er KH?', answer: 'Karbonathardhet, målt i °dH. Den viser hvor godt vannet motstår endringer i pH.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Gjødseldosering (EI)', description: 'Regn ut EI-dosering av gjødsel til plantet akvarium' },
  { href: '/calculators/aquarium/par-estimator', title: 'Lysstyrke (PAR) i akvarium', description: 'Anslå hvordan vanndybde svekker lyset (PAR) i plantet akvarium' },
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
];

export default function CO2BubbleCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="co2-bubble-calculator"
          title="CO₂-bobler"
          description="Regn ut CO₂-konsentrasjonen i akvariet ut fra KH og pH, og få forslag til bobletakt. Gratis og uten registrering."
        />

        <section aria-label="CO₂-bobler">
          <CO2BubbleCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
