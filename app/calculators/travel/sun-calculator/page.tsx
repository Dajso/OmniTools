import { Metadata } from 'next';
import { SunCalculator } from '@/components/calculators/travel/sun-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Solhøyde og solnedgang – gratis kalkulator på nett',
  description: 'Regn ut soloppgang, solnedgang, gylden time og solhøyde, også midnattssol og mørketid. Gratis og uten registrering.',
  keywords: ['solnedgang', 'soloppgang', 'gylden time', 'solhøyde', 'fotografi'],
  alternates: { canonical: '/calculators/travel/sun-calculator' },
  openGraph: {
    title: 'Solhøyde og solnedgang',
    description: 'Regn ut soloppgang, solnedgang, gylden time og solhøyde, også midnattssol og mørketid',
    url: '/calculators/travel/sun-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solhøyde og solnedgang',
  description: 'Regn ut soloppgang, solnedgang, gylden time og solhøyde, også midnattssol og mørketid',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg sted', text: 'Velg en by, bruk din posisjon, eller skriv inn breddegrad og lengdegrad.' },
  { name: 'Velg dato', text: 'Velg datoen du vil se soltidene for.' },
  { name: 'Les soltidene', text: 'Se soloppgang, solnedgang, dagens lengde og høyeste solhøyde, i lokal tid.' },
  { name: 'Planlegg fotograferingen', text: 'Bruk tidene for gylden time og blå time til å finne det beste lyset.' },
];

const faqs = [
  { question: 'Hva er gylden time og blå time?', answer: 'Gylden time er tiden når sola står lavt, mellom −4° og 6° over horisonten, med varmt og mykt lys. Blå time er tiden like før soloppgang og etter solnedgang, når himmelen er dypblå.' },
  { question: 'Hva er midnattssol og mørketid?', answer: 'Nord for polarsirkelen går ikke sola ned i en periode om sommeren (midnattssol), og den kommer ikke opp i en periode om vinteren (mørketid). Kalkulatoren viser det for datoer og steder der det gjelder, for eksempel Tromsø og Longyearbyen.' },
  { question: 'Hvilken tid vises klokkeslettene i?', answer: 'Lokal tid for stedet, med sommertid der det gjelder. Hvis du skriver inn egne koordinater, vises tiden i nettleserens tidssone.' },
  { question: 'Hvor nøyaktig er beregningen?', answer: 'Den er nøyaktig til noen få minutter. Fjell og horisonten rundt deg kan gjøre at sola oppleves å gå opp senere eller ned tidligere.' },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Møteplanlegger på tvers av tidssoner', description: 'Planlegg møter på tvers av tidssoner, med sommertid, og finn tidspunkt som passer for alle' },
  { href: '/calculators/travel/packing-list', title: 'Pakkeliste', description: 'Lag en tilpasset pakkeliste ut fra reisemål, vær og varighet' },
];

export default function SunCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sun-calculator"
          title="Solhøyde og solnedgang"
          description="Regn ut soloppgang, solnedgang, gylden time, blå time og solhøyde for et sted og en dato. Støtter midnattssol og mørketid. Gratis og uten registrering."
        />

        <section aria-label="Solhøyde og solnedgang">
          <SunCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
