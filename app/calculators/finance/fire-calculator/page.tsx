import { Metadata } from 'next';
import { FireCalculator } from '@/components/calculators/finance/fire-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'FIRE-kalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og gå av tidlig. Gratis og uten registrering.',
  keywords: ['FIRE', 'økonomisk uavhengighet', 'tidlig pensjon', 'pensjonstall'],
  alternates: { canonical: '/calculators/finance/fire-calculator' },
  openGraph: {
    title: 'FIRE-kalkulator',
    description: 'Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og gå av tidlig',
    url: '/calculators/finance/fire-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FIRE-kalkulator',
  description: 'Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og gå av tidlig',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi årlige utgifter', text: 'Skriv inn hva du bruker i året. Det avgjør hvor mye du trenger.' },
  { name: 'Fyll inn sparing', text: 'Oppgi det du har spart og hvor mye du sparer per år.' },
  { name: 'Velg avkastning og uttaksrate', text: 'Forventet avkastning og trygg uttaksrate. 4 % er et vanlig utgangspunkt.' },
  { name: 'Les FIRE-tallet', text: 'Se hvor mye du trenger og hvor mange år det tar.' },
];

const faqs = [
  { question: 'Hva er FIRE?', answer: 'FIRE står for financial independence, retire early. Målet er å spare nok til at avkastningen dekker utgiftene dine, slik at du kan slutte å jobbe tidlig.' },
  { question: 'Hva er 4 %-regelen?', answer: 'Regelen sier at du kan ta ut omtrent 4 % av formuen første år og justere for prisvekst, og ha gode sjanser til at pengene varer i 30 år eller mer. Det er en tommelfingerregel, ikke en garanti.' },
  { question: 'Tar kalkulatoren hensyn til skatt og pensjon?', answer: 'Nei. Skatt på gevinst og uttak, trygd og tjenestepensjon er ikke med i beregningen.' },
];

const relatedTools = [
  { href: '/calculators/finance/compound-interest-calculator', title: 'Rentesrentekalkulator', description: 'Beregn hvordan sparing vokser med renters rente' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fire-calculator"
          title="FIRE-kalkulator"
          description="Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og gå av tidlig"
        />

        <section aria-label="FIRE-kalkulator">
          <FireCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
