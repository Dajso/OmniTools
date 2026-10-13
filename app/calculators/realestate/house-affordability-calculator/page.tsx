import { Metadata } from 'next';
import { HouseAffordabilityCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hvor mye bolig har jeg råd til? – gratis kalkulator på nett',
  description: 'Anslå hvor stort lån og hvilken boligpris du kan klare ut fra inntekt, gjeld og egenkapital. Gratis og uten registrering.',
  keywords: ['boliglån', 'lånekapasitet', 'gjeldsgrad', 'egenkapital', 'boligbudsjett'],
  alternates: { canonical: '/calculators/realestate/house-affordability-calculator' },
  openGraph: {
    title: 'Hvor mye bolig har jeg råd til?',
    description: 'Anslå hvor stort lån og hvilken boligpris du kan klare ut fra inntekt, gjeld og egenkapital',
    url: '/calculators/realestate/house-affordability-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hvor mye bolig har jeg råd til?',
  description: 'Anslå hvor stort lån og hvilken boligpris du kan klare ut fra inntekt, gjeld og egenkapital',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi inntekt og gjeld', text: 'Samlet bruttoinntekt per år og annen gjeld.' },
  { name: 'Legg inn egenkapital', text: 'Hva du kan skyte inn i kjøpet. Du trenger minst 15 %.' },
  { name: 'Sett rente og tid', text: 'Nedbetalingstid kan være maks 30 år.' },
  { name: 'Les resultatet', text: 'Se maks boligpris, lånebeløp og månedlig betaling, også ved 3 prosentpoeng høyere rente.' },
];

const faqs = [
  { question: 'Hva sier utlånsforskriften?', answer: 'Samlet gjeld bør ikke overstige 5 ganger bruttoinntekten, du må ha minst 15 % egenkapital, og du må tåle en renteøkning på 3 prosentpoeng. Banker kan gjøre unntak for en liten andel av lånene.' },
  { question: 'Er resultatet en garanti for lån?', answer: 'Nei. Banken vurderer også betjeningsevne, sikkerhet og din økonomi for øvrig. Kalkulatoren er en pekepinn.' },
  { question: 'Hvorfor viser dere betaling ved høyere rente?', answer: 'Banken tester at du fortsatt kan betjene lånet hvis renten stiger med 3 prosentpoeng. Det er lurt å gjøre den samme vurderingen selv.' },
  { question: 'Må jeg betale avdrag?', answer: 'Lån over 60 % av boligverdien må normalt ha avdrag. Beregningen her er et annuitetslån.' },
];

const relatedTools = [
  { href: '/calculators/realestate/closing-cost-estimator', title: 'Omkostninger ved boligkjøp', description: 'Anslå kjøpsomkostninger: dokumentavgift, tinglysing og andre gebyrer' },
  { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Egenkapitalavkastning', description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig' },
];

export default function HouseAffordabilityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="house-affordability-calculator"
          title="Hvor mye bolig har jeg råd til?"
          description="Se hvor dyr bolig du kan kjøpe ut fra inntekt, egenkapital og bankenes krav. Gratis og uten registrering."
        />

        <section aria-label="Hvor mye bolig har jeg råd til?">
          <HouseAffordabilityCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
