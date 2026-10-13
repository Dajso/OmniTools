import { Metadata } from 'next';
import { ZeroSixtyEstimator } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: '0–100 km/t – gratis kalkulator på nett',
  description: 'Anslå akselerasjon fra 0 til 100 km/t ut fra effekt og vekt. Gratis og uten registrering.',
  keywords: ['0-100', 'akselerasjon', 'effekt per vekt', 'bilytelse'],
  alternates: { canonical: '/calculators/auto/zero-sixty-estimator' },
  openGraph: {
    title: '0–100 km/t',
    description: 'Anslå akselerasjon fra 0 til 100 km/t ut fra effekt og vekt',
    url: '/calculators/auto/zero-sixty-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '0–100 km/t',
  description: 'Anslå akselerasjon fra 0 til 100 km/t ut fra effekt og vekt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi effekt og vekt', text: 'Effekt i kW og egenvekt i kg. Begge står i vognkortet.' },
  { name: 'Velg drivlinje og girkasse', text: 'De påvirker veigrep og tap.' },
  { name: 'Les anslaget', text: 'Se 0–100 km/t, kvartmil og effekt per tonn.' },
];

const faqs = [
  { question: 'Hvor nøyaktig er anslaget?', answer: 'Det er et grovt anslag basert på formler. Reell tid avhenger av dekk, underlag, temperatur og førerens teknikk.' },
  { question: 'Gjelder det elbiler?', answer: 'Ikke godt. Elbiler har høyt dreiemoment fra start og leverer akselerasjon på en annen måte enn formlene her forutsetter.' },
  { question: 'Hva er kvartmil?', answer: 'En kvartmil er 402 meter. Det er en vanlig målestokk i bilsport.' },
  { question: 'Hva er egenvekt?', answer: 'Vekten på bilen uten last og passasjerer, som står i vognkortet.' },
];

const relatedTools = [
  { href: '/calculators/auto/horsepower-kw-converter', title: 'Hestekrefter til kW', description: 'Regn om mellom hestekrefter (hk) og kilowatt (kW)' },
  { href: '/calculators/auto/wheel-offset-calculator', title: 'Felg-ET (offset)', description: 'Regn ut felgens ET-verdi og se om nye felger passer på bilen' },
  { href: '/calculators/auto/tire-size-calculator', title: 'Dekkstørrelse', description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer' },
];

export default function ZeroSixtyEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="zero-sixty-estimator"
          title="0–100 km/t"
          description="Anslå hvor raskt bilen akselererer fra 0 til 100 km/t ut fra effekt, vekt og drivlinje. Gratis og uten registrering."
        />

        <section aria-label="0–100 km/t">
          <ZeroSixtyEstimator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
