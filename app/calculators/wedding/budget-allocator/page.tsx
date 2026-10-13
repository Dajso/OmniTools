import { Metadata } from 'next';
import { BudgetAllocatorCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bryllupsbudsjett – gratis kalkulator på nett',
  description: 'Fordel bryllupsbudsjettet på lokale, mat, foto, kjole og mer. Gratis og uten registrering.',
  keywords: ['bryllupsbudsjett', 'budsjettfordeling', 'bryllupskostnad', 'planlegging'],
  alternates: { canonical: '/calculators/wedding/budget-allocator' },
  openGraph: {
    title: 'Bryllupsbudsjett',
    description: 'Fordel bryllupsbudsjettet på lokale, mat, foto, kjole og mer',
    url: '/calculators/wedding/budget-allocator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bryllupsbudsjett',
  description: 'Fordel bryllupsbudsjettet på lokale, mat, foto, kjole og mer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn totalbudsjettet', text: 'Hvor mye du har å bruke, i kroner.' },
  { name: 'Se fordelingen', text: 'Hver post får en prosentandel og et beløp.' },
  { name: 'Juster ut fra prioriteringene', text: 'Bruk tallene som utgangspunkt og flytt penger mellom postene.' },
  { name: 'Ha med en buffer', text: 'Sett av en del til uforutsette utgifter.' },
];

const faqs = [
  { question: 'Hvor stor del av budsjettet går til lokale og mat?', answer: 'Det er vanligvis den største posten, rundt 40 %.' },
  { question: 'Er prosentene faste?', answer: 'Nei. De er veiledende og må tilpasses dine behov, for eksempel om du skal ha stor fest eller liten seremoni.' },
  { question: 'Bør jeg sette av en buffer?', answer: 'Ja. 5 % til uforutsette utgifter er lurt, siden prisene ofte stiger underveis.' },
  { question: 'Er tips med i budsjettet?', answer: 'Nei, driks er ikke vanlig i Norge, så posten er byttet ut med overnatting og bryllupsnatt.' },
];

const relatedTools = [
  { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Drikke til bryllupet', description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten' },
  { href: '/calculators/wedding/catering-quantity-estimator', title: 'Matmengde til selskap', description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert' },
];

export default function BudgetAllocatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="budget-allocator"
          title="Bryllupsbudsjett"
          description="Fordel bryllupsbudsjettet i kroner på lokale og mat, foto, musikk, blomster, antrekk og mer. Gratis og uten registrering."
        />

        <section aria-label="Bryllupsbudsjett">
          <BudgetAllocatorCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
