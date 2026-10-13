import { Metadata } from 'next';
import { LEDResistorCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'LED-motstand – gratis kalkulator på nett',
  description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger. Gratis og uten registrering.',
  keywords: ['LED', 'seriemotstand', 'strømbegrensning', 'elektronikk'],
  alternates: { canonical: '/calculators/electronics/led-resistor' },
  openGraph: {
    title: 'LED-motstand',
    description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger',
    url: '/calculators/electronics/led-resistor',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LED-motstand',
  description: 'Regn ut seriemotstand til LED-kretser, med forhåndsvalg for vanlige farger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn forsyningsspenningen', text: 'Spenningen fra batteriet eller strømforsyningen.' },
  { name: 'Velg LED-farge', text: 'Fargen gir typisk framspenning, eller legg inn din egen fra databladet.' },
  { name: 'Legg inn framstrømmen', text: 'De fleste LED-er kjøres på 10–20 mA.' },
  { name: 'Les av motstanden', text: 'Se utregnet verdi, nærmeste standardverdi og effekt.' },
];

const faqs = [
  { question: 'Hvorfor må en LED ha motstand?', answer: 'En LED begrenser ikke strømmen selv. Uten motstand tar strømmen fort så høy verdi at LED-en ødelegges.' },
  { question: 'Hvilken verdi velger jeg?', answer: 'Velg nærmeste standardverdi i E12- eller E24-serien. Velger du litt høyere verdi, blir LED-en litt svakere, men lever lenger.' },
  { question: 'Kan jeg koble flere LED-er i serie?', answer: 'Ja. Legg inn antall, så regnes den samlede framspenningen med. Forsyningsspenningen må være høyere enn summen.' },
  { question: 'Hva er framspenning?', answer: 'Spenningen som faller over LED-en når den lyser, typisk 2 V for rød og rundt 3,2 V for blå og hvit.' },
];

const relatedTools = [
  { href: '/calculators/electronics/resistor-calculator', title: 'Motstand: fargekode', description: 'Regn ut motstandsverdi fra fargebånd (4 og 5 bånd)' },
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/voltage-divider', title: 'Spenningsdeler', description: 'Regn ut utgangsspenning på en spenningsdeler og finn motstandsverdier' },
];

export default function LEDResistorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="led-resistor"
          title="LED-motstand"
          description="Regn ut hvilken seriemotstand du trenger til en LED, med nærmeste standardverdi og effektrating. Gratis og uten registrering."
        />

        <section aria-label="LED-motstand">
          <LEDResistorCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
