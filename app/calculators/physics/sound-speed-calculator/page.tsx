import { Metadata } from 'next';
import { SoundSpeedCalculator } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lydhastighet – gratis kalkulator på nett',
  description: 'Regn ut lydhastigheten i luft ut fra temperatur. Gratis og uten registrering.',
  keywords: ['lydhastighet', 'lydfart', 'temperatur', 'akustikk'],
  alternates: { canonical: '/calculators/physics/sound-speed-calculator' },
  openGraph: {
    title: 'Lydhastighet',
    description: 'Regn ut lydhastigheten i luft ut fra temperatur',
    url: '/calculators/physics/sound-speed-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lydhastighet',
  description: 'Regn ut lydhastigheten i luft ut fra temperatur',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg stoff og temperatur', text: 'Velg for eksempel luft og oppgi temperaturen i grader celsius.' },
  { name: 'Les lydhastigheten', text: 'Se hastigheten i m/s, km/t og knop.' },
  { name: 'Finn avstanden til lynet', text: 'Skriv inn sekundene mellom lyn og torden.' },
];

const faqs = [
  { question: 'Hvor fort går lyden i luft?', answer: 'Omtrent 343 m/s ved 20 °C, altså rundt 1235 km/t. Hastigheten øker med omtrent 0,6 m/s for hver grad.' },
  { question: 'Hvordan finner jeg avstanden til et tordenvær?', answer: 'Tell sekundene fra lynet til du hører tordenen og gang med lydhastigheten. Omtrent tre sekunder tilsvarer én kilometer.' },
  { question: 'Hvorfor går lyden fortere i vann og stål?', answer: 'Lyd går raskere i stoffer som er stivere og har fast struktur. I ferskvann er hastigheten omtrent 1481 m/s og i stål omtrent 5960 m/s.' },
  { question: 'Hva er Mach 1?', answer: 'Lydhastigheten i luften akkurat der og da. Den varierer med temperaturen, og er omtrent 1235 km/t ved 20 °C.' },
];

const relatedTools = [
  { href: '/calculators/physics/pressure-converter', title: 'Trykkomregner (fysikk)', description: 'Regn om mellom pascal, bar, PSI, atm og mer' },
  { href: '/calculators/physics/projectile-motion-calculator', title: 'Skrått kast', description: 'Regn ut bane, maksimal høyde, rekkevidde og flytid for et skrått kast' },
];

export default function SoundSpeedCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sound-speed-calculator"
          title="Lydhastighet"
          description="Regn ut lydhastigheten i luft, vann, stål og andre stoffer ut fra temperaturen, og finn avstanden til et tordenvær. Gratis og uten registrering."
        />

        <section aria-label="Lydhastighet">
          <SoundSpeedCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
