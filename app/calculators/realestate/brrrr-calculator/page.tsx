import { Metadata } from 'next';
import { BRRRRCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BRRRR-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut avkastning på kjøp–oppussing–utleie–refinansiering–gjenta. Gratis og uten registrering.',
  keywords: ['BRRRR', 'oppussing', 'utleie', 'refinansiering', 'boliginvestering'],
  alternates: { canonical: '/calculators/realestate/brrrr-calculator' },
  openGraph: {
    title: 'BRRRR-kalkulator',
    description: 'Regn ut avkastning på kjøp–oppussing–utleie–refinansiering–gjenta',
    url: '/calculators/realestate/brrrr-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BRRRR-kalkulator',
  description: 'Regn ut avkastning på kjøp–oppussing–utleie–refinansiering–gjenta',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn kjøp og oppussing', text: 'Kjøpesum, oppussingskostnad og omkostninger.' },
  { name: 'Anslå ny verdi og leie', text: 'Oppgi forventet verdi etter oppussing og leie per måned.' },
  { name: 'Sett belåningsgrad', text: 'Maks 85 % av boligverdien i Norge.' },
  { name: 'Les resultatet', text: 'Se hvor mye kapital som er bundet, og kontantstrømmen din.' },
];

const faqs = [
  { question: 'Hva står BRRRR for?', answer: 'Buy, rehab, rent, refinance, repeat: kjøp, pusse opp, leie ut, refinansiere og gjenta med frigjort kapital.' },
  { question: 'Kan jeg refinansiere opptil 85 %?', answer: 'Utlånsforskriften krever minst 15 % egenkapital, så banken kan normalt gi deg opptil 85 % av verdien. Banken avgjør ut fra egen vurdering og taksten.' },
  { question: 'Er renter og avdrag med?', answer: 'Nei, kontantstrømmen er leie minus kostnader. Husk å trekke fra renter og avdrag på det nye lånet.' },
  { question: 'Er strategien risikabel?', answer: 'Ja. Oppussing kan bli dyrere enn planlagt, og taksten kan bli lavere enn forventet. Legg inn buffer.' },
];

const relatedTools = [
  { href: '/calculators/realestate/renovation-roi-estimator', title: 'Verdiøkning ved oppussing', description: 'Anslå hvor mye kjøkken, bad og annen oppussing øker boligverdien' },
  { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Egenkapitalavkastning', description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig' },
];

export default function BRRRRCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="brrrr-calculator"
          title="BRRRR-kalkulator"
          description="Regn ut hvor mye kapital som er bundet etter kjøp, oppussing og refinansiering av en utleiebolig. Gratis og uten registrering."
        />

        <section aria-label="BRRRR-kalkulator">
          <BRRRRCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
