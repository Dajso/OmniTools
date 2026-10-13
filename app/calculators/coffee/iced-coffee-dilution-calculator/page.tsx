import { Metadata } from 'next';
import { IcedCoffeeDilutionCalculator } from '@/components/calculators/coffee/iced-coffee-dilution-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Iskaffe og fortynning – gratis kalkulator på nett',
  description: 'Regn ut varm kaffe og is for å holde ønsket styrke etter fortynning. Gratis og uten registrering.',
  keywords: ['iskaffe', 'fortynning', 'is', 'kald kaffe', 'TDS'],
  alternates: { canonical: '/calculators/coffee/iced-coffee-dilution-calculator' },
  openGraph: {
    title: 'Iskaffe og fortynning',
    description: 'Regn ut varm kaffe og is for å holde ønsket styrke etter fortynning',
    url: '/calculators/coffee/iced-coffee-dilution-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Iskaffe og fortynning',
  description: 'Regn ut varm kaffe og is for å holde ønsket styrke etter fortynning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi ønsket sluttvolum', text: 'Hvor mye iskaffe du vil ende opp med, i ml.' },
  { name: 'Velg TDS og andel is', text: 'Velg styrke og hvor stor del av volumet som skal være is.' },
  { name: 'Les resultatet', text: 'Se hvor mye varm kaffe du skal brygge, og hvor sterk den må være.' },
  { name: 'Følg trinnene', text: 'Brygg, hell over isen og rør forsiktig.' },
];

const faqs = [
  { question: 'Hvorfor må kaffen brygges sterkere?', answer: 'Isen smelter og tynner ut kaffen. Brygger du sterkere i starten, blir den riktig når isen er borte.' },
  { question: 'Hvor mye is bør jeg bruke?', answer: '30–40 % is gir vanlig iskaffe. Over 50 % gir en kald, men vannaktig kaffe.' },
  { question: 'Hva er japansk iskaffe?', answer: 'Kaffe som brygges varm rett over isen, slik kalkulatoren legger opp til. Det gir en frisk og aromatisk kopp.' },
  { question: 'Må jeg vite TDS?', answer: 'Ikke nødvendigvis. Standardverdien passer til vanlig filterkaffe.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
];

export default function IcedCoffeeDilutionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="iced-coffee-dilution-calculator"
          title="Iskaffe og fortynning"
          description="Regn ut hvor mye varm kaffe og is du trenger for å få riktig styrke når isen er smeltet. Gratis og uten registrering."
        />

        <section aria-label="Iskaffe og fortynning">
          <IcedCoffeeDilutionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
