import { Metadata } from 'next';
import { MoonPhaseCalculator } from '@/components/calculators/fun/moon-phase-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Månefase – gratis kalkulator på nett',
  description: 'Se månefasen for en hvilken som helst dato, med synlig andel og kommende hendelser. Gratis og uten registrering.',
  keywords: ['månefase', 'måne', 'fullmåne', 'nymåne', 'månekalender'],
  alternates: { canonical: '/calculators/fun/moon-phase-calculator' },
  openGraph: {
    title: 'Månefase',
    description: 'Se månefasen for en hvilken som helst dato, med synlig andel og kommende hendelser',
    url: '/calculators/fun/moon-phase-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Månefase',
  description: 'Se månefasen for en hvilken som helst dato, med synlig andel og kommende hendelser',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dato', text: 'Bruk dagens dato eller en annen dato.' },
  { name: 'Se månefasen', text: 'Du får fasen, alder og andel opplyst.' },
  { name: 'Se neste fullmåne og nymåne', text: 'Datoene vises under resultatet.' },
];

const faqs = [
  { question: 'Hvor lang er en månesyklus?', answer: 'Omtrent 29,5 døgn fra nymåne til nymåne.' },
  { question: 'Hvordan regnes fasen ut?', answer: 'Fra tiden siden en kjent nymåne og gjennomsnittlig lengde på en månesyklus. Det er nøyaktig nok til dagligbruk, men kan avvike noen timer.' },
  { question: 'Er månefasen lik overalt?', answer: 'Ja, fasen er den samme på hele jorda, men månen ser speilvendt ut på den sørlige halvkulen.' },
  { question: 'Hva betyr tolkningene under fasen?', answer: 'De er tradisjonelle symbolske tolkninger og har ikke noe vitenskapelig grunnlag.' },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Stjernetegn', description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn' },
  { href: '/calculators/fun/biorhythm', title: 'Biorytme', description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato' },
  { href: '/calculators/travel/sun-calculator', title: 'Solhøyde og solnedgang', description: 'Regn ut soloppgang, solnedgang, gylden time og solhøyde, også midnattssol og mørketid' },
];

export default function MoonPhaseCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="moon-phase-calculator"
          title="Månefase"
          description="Se månefasen for en hvilken som helst dato, med hvor stor del av månen som er opplyst og når neste fullmåne og nymåne kommer. Gratis og uten registrering."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Månefase">
          <MoonPhaseCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Månefasene</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Månen går gjennom alle fasene på omtrent 29,5 døgn. Hver fase har sine egne kjennetegn:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌑</span>
                <span className="font-medium text-sm">Nymåne</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌓</span>
                <span className="font-medium text-sm">Første kvarter</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌕</span>
                <span className="font-medium text-sm">Fullmåne</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌗</span>
                <span className="font-medium text-sm">Siste kvarter</span>
              </div>
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
