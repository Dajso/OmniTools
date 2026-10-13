import { Metadata } from 'next';
import { PottingSoilCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pottejord – gratis kalkulator på nett',
  description: 'Regn ut hvor mye pottejord du trenger til potter og kasser. Gratis og uten registrering.',
  keywords: ['pottejord', 'potter', 'planter i krukke', 'plantekasse', 'liter'],
  alternates: { canonical: '/calculators/garden/potting-soil-calculator' },
  openGraph: {
    title: 'Pottejord',
    description: 'Regn ut hvor mye pottejord du trenger til potter og kasser',
    url: '/calculators/garden/potting-soil-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pottejord',
  description: 'Regn ut hvor mye pottejord du trenger til potter og kasser',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg form', text: 'Rund potte, kasse eller potte som smalner av.' },
  { name: 'Oppgi målene', text: 'Diameter eller lengde og bredde, og høyde, i cm.' },
  { name: 'Velg fyllingsgrad', text: 'La det være 2–4 cm fra kanten så det er plass til vann.' },
  { name: 'Les av volumet', text: 'Se liter og antall sekker du trenger.' },
];

const faqs = [
  { question: 'Hvor høyt bør jeg fylle potten?', answer: 'La det være 2–4 cm igjen til kanten så vannet ikke renner over. 90 % fyllingsgrad er en grei start.' },
  { question: 'Hvor mange liter er en potte?', answer: 'Volumet i liter regnes ut fra formen og målene. En 30 cm bred og 25 cm høy rund potte rommer ca. 16 liter ved 90 % fyll.' },
  { question: 'Hvilke sekkestørrelser finnes?', answer: 'I Norge selges pottejord vanligvis i sekker på 10, 20, 50 og 70 liter, men dette varierer mellom produsenter.' },
  { question: 'Trenger jeg drenering nederst?', answer: 'Legg gjerne lecakuler eller grov grus nederst i store potter, og bland perlitt inn i jorda for bedre drenering.' },
];

const relatedTools = [
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Jord og barkflis', description: 'Regn ut hvor mye jord eller barkflis du trenger til bed, i liter og m³' },
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Vanningsplan', description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong' },
];

export default function PottingSoilCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="potting-soil-calculator"
          title="Pottejord"
          description="Regn ut hvor mye pottejord du trenger til runde potter, kasser og trau, i liter og antall sekker à 10, 20, 50 og 70 liter. Gratis og uten registrering."
        />

        <section aria-label="Pottejord">
          <PottingSoilCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
