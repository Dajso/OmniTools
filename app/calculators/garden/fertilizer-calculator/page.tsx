import { Metadata } from 'next';
import { FertilizerCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gjødsel (N-P-K) – gratis kalkulator på nett',
  description: 'Regn ut gjødselmengde ut fra N-P-K-forhold til plen eller hage. Gratis og uten registrering.',
  keywords: ['gjødsel', 'NPK', 'nitrogen', 'plengjødsel', 'hagegjødsel'],
  alternates: { canonical: '/calculators/garden/fertilizer-calculator' },
  openGraph: {
    title: 'Gjødsel (N-P-K)',
    description: 'Regn ut gjødselmengde ut fra N-P-K-forhold til plen eller hage',
    url: '/calculators/garden/fertilizer-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gjødsel (N-P-K)',
  description: 'Regn ut gjødselmengde ut fra N-P-K-forhold til plen eller hage',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg gjødsel', text: 'Velg ferdig type eller legg inn N-P-K fra pakken.' },
  { name: 'Velg ønsket nitrogenmengde', text: 'Bruk et hurtigvalg for plen, grønnsaker, blomster eller trær, eller sett egen verdi.' },
  { name: 'Oppgi arealet', text: 'Arealet som skal gjødsles, i m².' },
  { name: 'Les av mengden', text: 'Se kg gjødsel totalt, gram per m² og hvor mye N, P og K som tilføres.' },
];

const faqs = [
  { question: 'Hva betyr N-P-K?', answer: 'Prosent nitrogen (N), fosfor (P) og kalium (K) i gjødselen. 14-4-21 betyr 14 % nitrogen, 4 % fosfor og 21 % kalium. På gjødselsekker i Norge er fosfor og kalium oppgitt som P og K, ikke som oksider.' },
  { question: 'Hvor mye gjødsel er for mye?', answer: 'Mer enn rundt 5–8 g nitrogen per m² om gangen gir fare for gjødselskade. Del heller opp i flere omganger.' },
  { question: 'Er hurtigvalgene eksakte?', answer: 'Nei. De er veiledende verdier. Følg alltid anbefalingen på pakken til gjødselen du bruker.' },
  { question: 'Når bør jeg gjødsle?', answer: 'Gjødsle i vekstsesongen, gjerne på fuktig jord, og vann inn gjødselen hvis det ikke ventes regn.' },
];

const relatedTools = [
  { href: '/calculators/garden/compost-calculator', title: 'Kompost (C:N-forhold)', description: 'Regn ut karbon–nitrogen-forholdet i komposten' },
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Grønnsakavling', description: 'Anslå avling av grønnsaker ut fra antall planter og sort' },
];

export default function FertilizerCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fertilizer-calculator"
          title="Gjødsel (N-P-K)"
          description="Regn ut hvor mye gjødsel du trenger ut fra N-P-K-innholdet og hvor mye nitrogen du vil gi. Resultat i kg og gram per m². Gratis og uten registrering."
        />

        <section aria-label="Gjødsel (N-P-K)">
          <FertilizerCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
