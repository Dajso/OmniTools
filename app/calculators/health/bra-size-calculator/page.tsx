import { Metadata } from 'next';
import { BraSizeCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BH-størrelse – gratis kalkulator på nett',
  description: 'Finn riktig BH-størrelse ut fra bruststørrelse og under-bryst-mål. Gratis og uten registrering.',
  keywords: ['BH-størrelse', 'BH', 'skålstørrelse', 'omkrets'],
  alternates: { canonical: '/calculators/health/bra-size-calculator' },
  openGraph: {
    title: 'BH-størrelse',
    description: 'Finn riktig BH-størrelse ut fra bruststørrelse og under-bryst-mål',
    url: '/calculators/health/bra-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BH-størrelse',
  description: 'Finn riktig BH-størrelse ut fra bruststørrelse og under-bryst-mål',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål under brystet', text: 'Rett under brystene, i cm.' },
  { name: 'Mål over brystet', text: 'Der brystet er fyldigst, i cm.' },
  { name: 'Les resultatet', text: 'Se størrelse i EU, UK og USA.' },
];

const faqs = [
  { question: 'Hvordan leser jeg størrelsen?', answer: 'Tallet er omkretsen under brystet (65, 70, 75 …) og bokstaven er skålstørrelsen.' },
  { question: 'Hvorfor passer ikke alltid resultatet?', answer: 'Størrelsene varierer mellom merker og modeller. Prøv gjerne naboøstørrelser.' },
  { question: 'Hva er forskjellen på europeisk og engelsk størrelse?', answer: 'Europa bruker cm for omkrets, mens UK og USA bruker tommer.' },
  { question: 'Hvor ofte bør jeg måle?', answer: 'Mål gjerne på nytt hvis vekten endrer seg, ved graviditet eller ammeperiode.' },
];

const relatedTools = [
  { href: '/calculators/health/ring-size-converter', title: 'Ringstørrelse', description: 'Regn om ringstørrelser mellom omkrets, EU, UK og US' },
];

export default function BraSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bra-size-calculator"
          title="BH-størrelse"
          description="Finn BH-størrelsen din ut fra mål under og over brystet. Svaret vises i europeisk størrelse (75C, 80B …), med omregning til UK og USA. Gratis og uten registrering."
        />

        <section aria-label="BH-størrelse">
          <BraSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
