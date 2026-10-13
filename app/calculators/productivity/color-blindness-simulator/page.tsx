import { Metadata } from 'next';
import { ColorBlindnessSimulator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fargeblindhet-simulator – gratis kalkulator på nett',
  description: 'Se hvordan farger oppleves med ulike typer fargesynsavvik. Gratis og uten registrering.',
  keywords: ['fargeblindhet', 'universell utforming', 'deuteranopi', 'protanopi', 'fargesyn'],
  alternates: { canonical: '/calculators/productivity/color-blindness-simulator' },
  openGraph: {
    title: 'Fargeblindhet-simulator',
    description: 'Se hvordan farger oppleves med ulike typer fargesynsavvik',
    url: '/calculators/productivity/color-blindness-simulator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fargeblindhet-simulator',
  description: 'Se hvordan farger oppleves med ulike typer fargesynsavvik',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg en farge', text: 'Velg fargen du vil teste.' },
  { name: 'Velg type fargesyn', text: 'For eksempel deuteranopi eller protanopi.' },
  { name: 'Se resultatet', text: 'Se hvordan fargen oppleves, og forhåndsvisning av alle typer.' },
  { name: 'Bruk det i designet', text: 'Velg farger som kan skilles fra hverandre og ikke bare bruk farge til å formidle informasjon.' },
];

const faqs = [
  { question: 'Hvor vanlig er fargeblindhet?', answer: 'Rundt 8 % av menn og 0,5 % av kvinner har fargesynsavvik, oftest rødgrønt.' },
  { question: 'Hvor nøyaktig er simuleringen?', answer: 'Den er en tilnærming. Opplevelsen varierer fra person til person.' },
  { question: 'Hva krever universell utforming?', answer: 'Informasjon skal ikke formidles med farge alene. Bruk også tekst, symboler eller mønster.' },
  { question: 'Hva er deuteranomali?', answer: 'Redusert følsomhet for grønt lys. Det er den vanligste formen.' },
];

const relatedTools = [
  { href: '/calculators/productivity/contrast-checker', title: 'Kontrastsjekker (WCAG)', description: 'Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming' },
];

export default function ColorBlindnessSimulatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="color-blindness-simulator"
          title="Fargeblindhet-simulator"
          description="Se hvordan farger oppleves med ulike typer fargesynsavvik som rødgrønn fargeblindhet. Gratis og uten registrering."
        />

        <section aria-label="Fargeblindhet-simulator">
          <ColorBlindnessSimulator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
