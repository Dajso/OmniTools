import { Metadata } from 'next';
import { WheelOffsetCalculator } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Felg-ET (offset) – gratis kalkulator på nett',
  description: 'Regn ut felgens ET-verdi og se om nye felger passer på bilen. Gratis og uten registrering.',
  keywords: ['ET', 'offset', 'innpress', 'felg', 'felgbredde'],
  alternates: { canonical: '/calculators/auto/wheel-offset-calculator' },
  openGraph: {
    title: 'Felg-ET (offset)',
    description: 'Regn ut felgens ET-verdi og se om nye felger passer på bilen',
    url: '/calculators/auto/wheel-offset-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Felg-ET (offset)',
  description: 'Regn ut felgens ET-verdi og se om nye felger passer på bilen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi dagens felg', text: 'Diameter og bredde i tommer, og ET i millimeter.' },
  { name: 'Oppgi ny felg', text: 'Fyll inn samme mål for felgen du vurderer.' },
  { name: 'Les resultatet', text: 'Se endring i sporvidde og klaring innvendig og utvendig.' },
];

const faqs = [
  { question: 'Hva er ET?', answer: 'ET (Einpresstiefe) er avstanden i mm fra felgens midtlinje til monteringsflaten. Lavere ET gjør at felgen stikker lenger ut.' },
  { question: 'Hva er baksett?', answer: 'Avstanden fra monteringsflaten til felgens innerkant. Det sier hvor mye plass felgen trenger bak mot opphenget.' },
  { question: 'Kan jeg bruke hvilken som helst felg?', answer: 'Nei. Felgen må være godkjent for bilen, og bolt-mønster og navhull må passe. Sjekk typegodkjenningen og reglene hos Statens vegvesen.' },
  { question: 'Hvor nøyaktig er kalkulatoren?', answer: 'Den viser endringer i forhold til dagens felg. Den kan ikke si om felgen faktisk passer i din bil.' },
];

const relatedTools = [
  { href: '/calculators/auto/tire-size-calculator', title: 'Dekkstørrelse', description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer' },
  { href: '/calculators/auto/zero-sixty-estimator', title: '0–100 km/t', description: 'Anslå akselerasjon fra 0 til 100 km/t ut fra effekt og vekt' },
];

export default function WheelOffsetCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wheel-offset-calculator"
          title="Felg-ET (offset)"
          description="Regn ut hvordan endret felgbredde og ET påvirker plassen i hjulhuset. Gratis og uten registrering."
        />

        <section aria-label="Felg-ET (offset)">
          <WheelOffsetCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
