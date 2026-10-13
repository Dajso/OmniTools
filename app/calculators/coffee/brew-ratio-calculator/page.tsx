import { Metadata } from 'next';
import { BrewRatioCalculator } from '@/components/calculators/coffee/brew-ratio-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bryggeforhold – gratis kalkulator på nett',
  description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke. Gratis og uten registrering.',
  keywords: ['bryggeforhold', 'kaffe og vann', 'vannmengde', 'kaffestyrke', 'dosering'],
  alternates: { canonical: '/calculators/coffee/brew-ratio-calculator' },
  openGraph: {
    title: 'Bryggeforhold',
    description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke',
    url: '/calculators/coffee/brew-ratio-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bryggeforhold',
  description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn kaffemengden', text: 'Oppgi hvor mange gram malt kaffe du skal bruke.' },
  { name: 'Velg bryggeforhold', text: 'For eksempel 1:15 for sterkt, 1:16 for balansert og 1:17 for mildt.' },
  { name: 'Les av vannmengden', text: 'Se hvor mange ml vann du trenger.' },
  { name: 'Sjekk styrkeprofilen', text: 'Se om styrken passer smaken din.' },
];

const faqs = [
  { question: 'Hva er et bryggeforhold?', answer: 'Forholdet mellom kaffe og vann, oftest skrevet 1:X. 1:16 betyr 1 gram kaffe til 16 gram vann.' },
  { question: 'Hvilket bryggeforhold er best?', answer: 'Det er smak. 1:15 til 1:17 fungerer for de fleste filtermetoder. Sterkere (1:12–1:15) passer konsentrerte brygg, mildere (1:17–1:20) gir lettere kaffe.' },
  { question: 'Hvordan regner jeg ut vannmengden?', answer: 'Gang kaffemengden med forholdet. 20 g kaffe og 1:16 gir 20 × 16 = 320 g (omtrent 320 ml) vann.' },
  { question: 'Hvilket forhold passer til pour over?', answer: 'Mellom 1:15 og 1:17. 1:16 er et godt utgangspunkt.' },
  { question: 'Påvirker forholdet styrken?', answer: 'Ja. Lavere tall gir sterkere kaffe, høyere tall gir mildere kaffe.' },
];

const relatedTools = [
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
  { href: '/calculators/coffee/iced-coffee-dilution-calculator', title: 'Iskaffe og fortynning', description: 'Regn ut varm kaffe og is for å holde ønsket styrke etter fortynning' },
];

export default function BrewRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="brew-ratio-calculator"
          title="Bryggeforhold"
          description="Regn ut hvor mye vann du trenger til kaffemengden din, med styrkeprofil for pour over, presskanne og traktekaffe. Gratis og uten registrering."
        />

        <section aria-label="Bryggeforhold">
          <BrewRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
