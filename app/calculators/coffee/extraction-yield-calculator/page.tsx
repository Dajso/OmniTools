import { Metadata } from 'next';
import { ExtractionYieldCalculator } from '@/components/calculators/coffee';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ekstraksjonsgrad for kaffe – gratis kalkulator på nett',
  description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket. Gratis og uten registrering.',
  keywords: ['ekstraksjon', 'TDS', 'kaffe', 'bryggestyrke', 'kaffevitenskap'],
  alternates: { canonical: '/calculators/coffee/extraction-yield-calculator' },
  openGraph: {
    title: 'Ekstraksjonsgrad for kaffe',
    description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket',
    url: '/calculators/coffee/extraction-yield-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ekstraksjonsgrad for kaffe',
  description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål TDS', text: 'Bruk et refraktometer og oppgi TDS i prosent.' },
  { name: 'Oppgi kaffemengde og drikke', text: 'Skriv inn gram kaffe og vekten på ferdig kaffe.' },
  { name: 'Les ekstraksjonsgraden', text: 'Se vurderingen og anbefalingen.' },
];

const faqs = [
  { question: 'Hva er ekstraksjonsgrad?', answer: 'Hvor stor andel av den malte kaffen som er løst opp i vannet. Optimalt er 18–22 % ifølge SCA.' },
  { question: 'Hva er TDS?', answer: 'Total mengde oppløst stoff i kaffen, målt i prosent. For filterkaffe er 1,15–1,55 % vanlig.' },
  { question: 'Hva gjør jeg hvis kaffen er underekstrahert?', answer: 'Kverner finere, bruk varmere vann eller la kaffen trekke lenger.' },
  { question: 'Hva gjør jeg hvis kaffen er overekstrahert?', answer: 'Kvern grovere, bruk litt kaldere vann eller kort ned trekketiden.' },
  { question: 'Trenger jeg et refraktometer?', answer: 'Ja, for å måle TDS nøyaktig. Uten måler kan du justere etter smak.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/iced-coffee-dilution-calculator', title: 'Iskaffe og fortynning', description: 'Regn ut varm kaffe og is for å holde ønsket styrke etter fortynning' },
];

export default function ExtractionYieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="extraction-yield-calculator"
          title="Ekstraksjonsgrad for kaffe"
          description="Regn ut ekstraksjonsgraden fra TDS, kaffemengde og vekt på drikken, og se om kaffen er under-, riktig eller overekstrahert. Gratis og uten registrering."
        />

        <section aria-label="Ekstraksjonsgrad for kaffe">
          <ExtractionYieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
