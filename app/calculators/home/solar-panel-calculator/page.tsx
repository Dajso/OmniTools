import { Metadata } from 'next';
import { SolarPanelCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Solcellekalkulator – gratis kalkulator på nett',
  description: 'Beregn behov, produksjon og innsparing for solcelleanlegg med norske strømpriser. Gratis og uten registrering.',
  keywords: ['solceller', 'solcelleanlegg', 'solenergi', 'kWp', 'plusskunde'],
  alternates: { canonical: '/calculators/home/solar-panel-calculator' },
  openGraph: {
    title: 'Solcellekalkulator',
    description: 'Beregn behov, produksjon og innsparing for solcelleanlegg med norske strømpriser',
    url: '/calculators/home/solar-panel-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solcellekalkulator',
  description: 'Beregn behov, produksjon og innsparing for solcelleanlegg med norske strømpriser',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi forbruket ditt', text: 'Årlig strømforbruk i kWh finner du på strømregningen.' },
  { name: 'Velg landsdel', text: 'Solforholdene varierer fra Sørlandet til Nord-Norge.' },
  { name: 'Legg inn priser', text: 'Pris per kWp installert, strømpris du sparer og pris for overskuddsstrøm.' },
  { name: 'Les resultatet', text: 'Se størrelse på anlegget, årsproduksjon, besparelse og tilbakebetalingstid.' },
];

const faqs = [
  { question: 'Hvor mye strøm produserer solceller i Norge?', answer: 'Et godt orientert anlegg gir ofte 700–900 kWh per installert kWp i året, avhengig av landsdel, takvinkel og skygge.' },
  { question: 'Hva er kWp?', answer: 'Kilowatt-peak, anleggets maksimale effekt under standardforhold. Ti paneler à 430 W er 4,3 kWp.' },
  { question: 'Hvor mye av produksjonen bruker jeg selv?', answer: 'I en vanlig bolig ofte 30–50 %. Resten selges til nettet. Egenbruken øker med batteri eller strømkrevende bruk på dagtid.' },
  { question: 'Finnes det tilskudd?', answer: 'Enova har hatt støtteordninger for husholdninger. Ordningene endres, så sjekk gjeldende vilkår på enova.no.' },
];

const relatedTools = [
  { href: '/calculators/home/electricity-cost-calculator', title: 'Strømkostnad', description: 'Regn ut hva det koster å bruke elektriske apparater, med strømpris i øre per kWh' },
];

export default function SolarPanelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="solar-panel-calculator"
          title="Solcellekalkulator"
          description="Anslå størrelse, årsproduksjon, besparelse og tilbakebetalingstid for solceller på taket. Gratis og uten registrering."
        />

        <section aria-label="Solcellekalkulator">
          <SolarPanelCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
