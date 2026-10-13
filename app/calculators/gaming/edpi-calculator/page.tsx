import { Metadata } from 'next';
import { EDPICalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'eDPI-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet. Gratis og uten registrering.',
  keywords: ['edpi', 'effektiv dpi', 'mus-dpi', 'gaming', 'dpi-kalkulator'],
  alternates: { canonical: '/calculators/gaming/edpi-calculator' },
  openGraph: {
    title: 'eDPI-kalkulator',
    description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet',
    url: '/calculators/gaming/edpi-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'eDPI-kalkulator',
  description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi mus-DPI', text: 'DPI-en som er stilt inn på musa.' },
  { name: 'Skriv inn følsomhet i spillet', text: 'Følsomheten du bruker.' },
  { name: 'Les av eDPI', text: 'Se verdien og klassifiseringen.' },
  { name: 'Sammenlign med proffer', text: 'Klikk på en proffspiller for å prøve innstillingene hans eller hennes.' },
];

const faqs = [
  { question: 'Hva er eDPI?', answer: 'Effektiv DPI: mus-DPI multiplisert med følsomheten i spillet. Den lar deg sammenligne innstillinger på tvers av DPI.' },
  { question: 'Hva er en vanlig eDPI?', answer: 'Mange spillere ligger mellom 200 og 1 000. Lav eDPI gir presis sikting, høy eDPI gir raske svinger.' },
  { question: 'Er eDPI det samme i alle spill?', answer: 'Nei. Spillene har ulike multiplikatorer, så bruk omregneren for musefølsomhet når du bytter spill.' },
  { question: 'Hvordan regner jeg ut følsomhet fra ønsket eDPI?', answer: 'Del eDPI på DPI. 800 eDPI ved 800 DPI gir følsomhet 1,0.' },
];

const relatedTools = [
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Musfølsomhet-omregner', description: 'Regn om musfølsomhet mellom spill som Valorant, CS2, Apex Legends, Overwatch 2 og Fortnite' },
  { href: '/calculators/gaming/aim-trainer', title: 'Siktetrener', description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet' },
];

export default function EDPICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="edpi-calculator"
          title="eDPI-kalkulator"
          description="Regn ut eDPI (DPI × følsomhet i spillet) og sammenlign med innstillingene til proffspillere. Gratis og uten registrering."
        />

        <section aria-label="eDPI-kalkulator">
          <EDPICalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
