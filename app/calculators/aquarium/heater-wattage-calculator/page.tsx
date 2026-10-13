import { Metadata } from 'next';
import { HeaterWattageCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Varmeelement til akvarium – gratis kalkulator på nett',
  description: 'Regn ut nødvendig effekt (watt) ut fra volum, romtemperatur og ønsket vanntemperatur. Gratis og uten registrering.',
  keywords: ['akvarievarmer', 'watt', 'varmeelement', 'vanntemperatur'],
  alternates: { canonical: '/calculators/aquarium/heater-wattage-calculator' },
  openGraph: {
    title: 'Varmeelement til akvarium',
    description: 'Regn ut nødvendig effekt (watt) ut fra volum, romtemperatur og ønsket vanntemperatur',
    url: '/calculators/aquarium/heater-wattage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Varmeelement til akvarium',
  description: 'Regn ut nødvendig effekt (watt) ut fra volum, romtemperatur og ønsket vanntemperatur',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi volumet', text: 'Akvariumvolum i liter.' },
  { name: 'Skriv inn romtemperatur', text: 'Temperaturen i rommet der akvariet står.' },
  { name: 'Velg ønsket vanntemperatur', text: 'For eksempel 25 °C for tropiske fisk.' },
  { name: 'Les av anbefalingen', text: 'Se effekt i watt og om du bør bruke ett eller to elementer.' },
];

const faqs = [
  { question: 'Hvor mange watt trenger jeg per liter?', answer: 'Veiledende omtrent 0,5–1 watt per liter i en vanlig stue, og mer hvis rommet er kjølig.' },
  { question: 'Er det lurt å bruke to varmeelementer?', answer: 'Ja, for større kar. Hvis ett svikter, holder det andre vannet varmt, og et element som står fast på kan ikke overopphete hele karet.' },
  { question: 'Hva er en god vanntemperatur?', answer: 'De fleste tropiske fisk trives på 24–26 °C. Sjekk alltid hva artene dine trenger.' },
  { question: 'Må jeg ha termostat?', answer: 'Ja, bruk element med termostat og et separat termometer for kontroll.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/stocking-calculator', title: 'Fiskebesetning', description: 'Regn ut hvor mange fisk akvariet tåler (cm fisk per liter)' },
];

export default function HeaterWattageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="heater-wattage-calculator"
          title="Varmeelement til akvarium"
          description="Regn ut hvor mange watt varmeelement akvariet trenger ut fra volum, romtemperatur og ønsket vanntemperatur. Gratis og uten registrering."
        />

        <section aria-label="Varmeelement til akvarium">
          <HeaterWattageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
