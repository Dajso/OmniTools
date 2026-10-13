import { Metadata } from 'next';
import { DepthOfFieldCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dybdeskarphet – gratis kalkulator på nett',
  description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand. Gratis og uten registrering.',
  keywords: ['dybdeskarphet', 'blender', 'hyperfokal', 'fotografi', 'fokusavstand'],
  alternates: { canonical: '/calculators/photo/depth-of-field-calculator' },
  openGraph: {
    title: 'Dybdeskarphet',
    description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand',
    url: '/calculators/photo/depth-of-field-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dybdeskarphet',
  description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg sensorstørrelse', text: 'For eksempel fullformat eller APS-C.' },
  { name: 'Oppgi brennvidde og blenderåpning', text: 'Brennvidde i mm og blenderåpning som f-tall.' },
  { name: 'Oppgi avstand til motivet', text: 'I meter.' },
  { name: 'Les av dybdeskarpheten', text: 'Se skarpt område foran og bak motivet.' },
];

const faqs = [
  { question: 'Hva er dybdeskarphet?', answer: 'Området i bildet som oppleves som skarpt, fra nærmeste til fjerneste punkt.' },
  { question: 'Hva er hyperfokal avstand?', answer: 'Fokusavstanden som gir skarphet fra halve avstanden og til uendelig.' },
  { question: 'Hva gir grunnere dybdeskarphet?', answer: 'Lengre brennvidde, større blenderåpning (lavere f-tall) og kortere motivavstand.' },
  { question: 'Hvorfor spiller sensorstørrelsen en rolle?', answer: 'Mindre sensorer har mindre uskarphetssirkel og gir ved samme synsfelt større dybdeskarphet.' },
];

const relatedTools = [
  { href: '/calculators/photo/focal-length-calculator', title: 'Brennvidde og crop-faktor', description: 'Regn ut tilsvarende brennvidde med crop-faktor' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND-filter', description: 'Regn ut lukkertid ved bruk av ND-filter' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Gylden time og blå time', description: 'Regn ut gylden time og blå time for et sted' },
];

export default function DepthOfFieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="depth-of-field-calculator"
          title="Dybdeskarphet"
          description="Regn ut dybdeskarphet, nærmeste og fjerneste skarpe punkt og hyperfokal avstand ut fra brennvidde, blenderåpning, motivavstand og sensorstørrelse. Gratis og uten registrering."
        />

        <section aria-label="Dybdeskarphet">
          <DepthOfFieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
