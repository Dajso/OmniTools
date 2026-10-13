import { Metadata } from 'next';
import { RefinanceCalculator } from '@/components/calculators/finance/refinance-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Refinansieringskalkulator – gratis kalkulator på nett',
  description: 'Finn ut om det lønner seg å refinansiere boliglånet. Gratis og uten registrering.',
  keywords: ['refinansiering', 'refinansiere', 'bytte bank', 'lånerente', 'break-even'],
  alternates: { canonical: '/calculators/finance/refinance-calculator' },
  openGraph: {
    title: 'Refinansieringskalkulator',
    description: 'Finn ut om det lønner seg å refinansiere boliglånet',
    url: '/calculators/finance/refinance-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Refinansieringskalkulator',
  description: 'Finn ut om det lønner seg å refinansiere boliglånet',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi dagens lån', text: 'Skriv inn restgjeld, rente og gjenstående nedbetalingstid.' },
  { name: 'Oppgi ny rente', text: 'Skriv inn renten du kan få hos en ny bank.' },
  { name: 'Legg til kostnader', text: 'Oppgi etableringsgebyr, tinglysing og andre kostnader ved å bytte lån.' },
  { name: 'Se om det lønner seg', text: 'Se månedlig besparelse og hvor lang tid det tar før kostnadene er tjent inn.' },
];

const faqs = [
  { question: 'Når lønner det seg å refinansiere?', answer: 'Når du sparer mer på lavere rente enn det koster å bytte, og du blir boende lenge nok til at kostnadene er tjent inn.' },
  { question: 'Hva er tilbakebetalingstid?', answer: 'Tiden det tar før besparelsen per måned har dekket kostnadene ved å bytte.' },
  { question: 'Kan jeg bare få banken til å senke renten?', answer: 'Ja, prøv å forhandle med din nåværende bank først. Mange banker tilbyr bedre rente når du viser at du har et tilbud fra en annen bank.' },
];

const relatedTools = [
  { href: '/calculators/finance/mortgage-calculator', title: 'Boliglånskalkulator', description: 'Beregn terminbeløp, renter og gebyrer på boliglånet, med annuitet eller serielån' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="refinance-calculator"
          title="Refinansieringskalkulator"
          description="Finn ut om det lønner seg å refinansiere boliglånet"
        />

        <section aria-label="Refinansieringskalkulator">
          <RefinanceCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
