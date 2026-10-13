import { Metadata } from 'next';
import { FuelCostCalculator } from '@/components/calculators/finance/fuel-cost-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Drivstoffkostnad for turen – gratis kalkulator på nett',
  description: 'Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km. Gratis og uten registrering.',
  keywords: ['drivstoffkostnad', 'bensinpris', 'turkostnad', 'liter per mil', 'diesel'],
  alternates: { canonical: '/calculators/finance/fuel-cost-calculator' },
  openGraph: {
    title: 'Drivstoffkostnad for turen',
    description: 'Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km',
    url: '/calculators/finance/fuel-cost-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Drivstoffkostnad for turen',
  description: 'Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi avstand', text: 'Skriv inn hvor mange kilometer du skal kjøre.' },
  { name: 'Oppgi forbruk', text: 'Skriv inn bilens forbruk i liter per 100 km.' },
  { name: 'Skriv inn drivstoffprisen', text: 'Oppgi prisen per liter.' },
  { name: 'Del kostnaden', text: 'Oppgi antall i bilen hvis dere skal dele.' },
];

const faqs = [
  { question: 'Hvordan regner jeg om fra l/mil til l/100 km?', answer: 'Gang med 10. Et forbruk på 0,65 liter per mil er 6,5 liter per 100 km.' },
  { question: 'Hva er et vanlig bilforbruk?', answer: 'Små bensinbiler bruker ofte rundt 5–7 liter per 100 km, større biler og SUV-er mer. Se bilens vognkort eller faktisk forbruk i bilen.' },
  { question: 'Er bompenger og ferger med?', answer: 'Nei. Bompenger, ferge og parkering kommer i tillegg til drivstoffet.' },
];

const relatedTools = [
  { href: '/calculators/finance/car-lease-vs-buy', title: 'Leasing eller kjøp av bil', description: 'Sammenlign kostnadene ved å leasing og kjøpe bil' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fuel-cost-calculator"
          title="Drivstoffkostnad for turen"
          description="Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km"
        />

        <section aria-label="Drivstoffkostnad for turen">
          <FuelCostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
