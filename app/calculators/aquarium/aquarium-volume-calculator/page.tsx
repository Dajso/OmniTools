import { Metadata } from 'next';
import { AquariumVolumeCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Akvarievolum – gratis kalkulator på nett',
  description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter. Gratis og uten registrering.',
  keywords: ['akvarievolum', 'akvarium', 'liter', 'fiskekar', 'størrelse'],
  alternates: { canonical: '/calculators/aquarium/aquarium-volume-calculator' },
  openGraph: {
    title: 'Akvarievolum',
    description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter',
    url: '/calculators/aquarium/aquarium-volume-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Akvarievolum',
  description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg form', text: 'Rektangulært, sylinder eller buet front.' },
  { name: 'Mål akvariet', text: 'Oppgi lengde, bredde og høyde i cm (eller diameter og høyde for sylinder).' },
  { name: 'Les av volumet', text: 'Se brutto volum i liter og omtrentlig netto vannvolum.' },
  { name: 'Sjekk vekten', text: 'Se hvor mye vannet veier, så du vet at benken tåler det.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut volumet i et akvarium?', answer: 'Gang lengde × bredde × høyde i cm og del på 1000 for å få liter. Et kar på 100 × 40 × 50 cm rommer 200 liter.' },
  { question: 'Hvorfor er netto volum mindre enn brutto?', answer: 'Substrat, dekor og at du ikke fyller helt til kanten gjør at ekte vannmengde ofte er rundt 90 % av brutto volum.' },
  { question: 'Hvor mye veier et akvarium?', answer: 'Én liter vann veier 1 kg. Et kar på 200 liter har dermed 200 kg vann, i tillegg til glass, substrat og bunnmøbel.' },
  { question: 'Hvordan regner jeg ut et sylinderformet akvarium?', answer: 'Volum = π × radius² × høyde. Del på 1000 for å få liter når målene er i cm.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/substrate-calculator', title: 'Bunnsubstrat', description: 'Regn ut hvor mye grus, sand eller jord akvariet trenger' },
  { href: '/calculators/aquarium/stocking-calculator', title: 'Fiskebesetning', description: 'Regn ut hvor mange fisk akvariet tåler (cm fisk per liter)' },
  { href: '/calculators/aquarium/heater-wattage-calculator', title: 'Varmeelement til akvarium', description: 'Regn ut nødvendig effekt (watt) ut fra volum, romtemperatur og ønsket vanntemperatur' },
];

export default function AquariumVolumeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="aquarium-volume-calculator"
          title="Akvarievolum"
          description="Regn ut volumet i akvariet i liter for rektangulære, sylinderformede og buede kar, med nettovolum og vekt av vannet. Gratis og uten registrering."
        />

        <section aria-label="Akvarievolum">
          <AquariumVolumeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
