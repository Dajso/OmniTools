import { Metadata } from 'next';
import { GoldenHourCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gylden time og blå time – gratis kalkulator på nett',
  description: 'Regn ut gylden time og blå time for et sted. Gratis og uten registrering.',
  keywords: ['gylden time', 'blå time', 'soloppgang', 'skumring', 'fotografi'],
  alternates: { canonical: '/calculators/photo/golden-hour-calculator' },
  openGraph: {
    title: 'Gylden time og blå time',
    description: 'Regn ut gylden time og blå time for et sted',
    url: '/calculators/photo/golden-hour-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gylden time og blå time',
  description: 'Regn ut gylden time og blå time for et sted',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg sted', text: 'Velg en norsk by, bruk posisjonen din eller skriv inn koordinater.' },
  { name: 'Velg dato', text: 'Tidene regnes ut for datoen du velger.' },
  { name: 'Les av tidene', text: 'Se gyllen time og blå time morgen og kveld.' },
  { name: 'Planlegg fotograferingen', text: 'Vær på plass i god tid før lyset kommer.' },
];

const faqs = [
  { question: 'Hva er gyllen time?', answer: 'Tiden når sola står lavt, 0–6° over horisonten, og lyset er varmt og mykt.' },
  { question: 'Hva er blå time?', answer: 'Tiden når sola står 4–6° under horisonten og himmelen er dypblå.' },
  { question: 'Hvorfor finnes det ikke blå time om sommeren i nord?', answer: 'Midt på sommeren kommer sola ikke langt nok ned, så himmelen blir aldri mørk nok. Kalkulatoren viser «Ikke i dag».' },
  { question: 'Hva med midnattssol og mørketid?', answer: 'Nord for polarsirkelen går ikke sola ned i sommerhalvåret eller opp om vinteren. Kalkulatoren viser da en melding i stedet for tider.' },
  { question: 'Hvilken tid bruker kalkulatoren?', answer: 'Norsk tid, med sommertid, for steder i Norge. Ellers brukes nettleserens tidssone.' },
  { question: 'Er tidene nøyaktige?', answer: 'De er beregnet og stemmer vanligvis innenfor noen minutter. Terreng, fjell og skyer kan flytte lyset.' },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Dybdeskarphet', description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND-filter', description: 'Regn ut lukkertid ved bruk av ND-filter' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Tidsforløp (timelapse)', description: 'Regn ut intervall og varighet for timelapse-fotografering' },
];

export default function GoldenHourCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="golden-hour-calculator"
          title="Gylden time og blå time"
          description="Finn tidspunktet for gyllen time og blå time, soloppgang og solnedgang på et valgt sted og en valgt dato. Med norske byer og norsk tid. Gratis og uten registrering."
        />

        <section aria-label="Gylden time og blå time">
          <GoldenHourCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
