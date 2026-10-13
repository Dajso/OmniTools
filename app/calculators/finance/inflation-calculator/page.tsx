import { Metadata } from 'next';
import { InflationCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Inflasjonskalkulator – gratis kalkulator på nett',
  description: 'Se hvordan inflasjon påvirker kjøpekraften over tid. Gratis og uten registrering.',
  keywords: ['inflasjon', 'kjøpekraft', 'konsumprisindeks', 'KPI', 'pengeverdi'],
  alternates: { canonical: '/calculators/finance/inflation-calculator' },
  openGraph: {
    title: 'Inflasjonskalkulator',
    description: 'Se hvordan inflasjon påvirker kjøpekraften over tid',
    url: '/calculators/finance/inflation-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Inflasjonskalkulator',
  description: 'Se hvordan inflasjon påvirker kjøpekraften over tid',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn beløpet', text: 'Oppgi beløpet du vil regne på, i dagens kroner.' },
  { name: 'Velg inflasjon', text: 'Oppgi forventet inflasjon per år i prosent.' },
  { name: 'Velg tidsperiode', text: 'Oppgi antall år du vil regne fremover.' },
  { name: 'Se kjøpekraften', text: 'Se hva beløpet tilsvarer i fremtiden og hvor mye kjøpekraft du taper.' },
];

const faqs = [
  { question: 'Hva er inflasjon?', answer: 'Inflasjon er prisstigning over tid. Når prisene stiger, kan du kjøpe mindre for de samme kronene.' },
  { question: 'Hva er Norges Banks inflasjonsmål?', answer: 'Norges Bank har et mål om at inflasjonen over tid skal være nær 2 %. Faktisk inflasjon varierer, og målt via konsumprisindeksen (KPI) hos SSB har den vært høyere i perioder.' },
  { question: 'Hvorfor taper jeg penger på å la dem stå på lav rente?', answer: 'Hvis renten på sparekontoen er lavere enn inflasjonen, taper pengene kjøpekraft selv om saldoen står stille eller vokser litt.' },
];

const relatedTools = [
  { href: '/calculators/finance/compound-interest-calculator', title: 'Rentesrentekalkulator', description: 'Beregn hvordan sparing vokser med renters rente' },
];

export default function InflationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="inflation-calculator"
          title="Inflasjonskalkulator"
          description="Se hvordan inflasjon påvirker kjøpekraften over tid"
        />

        <section aria-label="Inflasjonskalkulator">
          <InflationCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
