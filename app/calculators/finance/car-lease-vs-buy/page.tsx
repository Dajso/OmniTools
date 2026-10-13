import { Metadata } from 'next';
import { CarLeaseVsBuyCalculator } from '@/components/calculators/finance/car-lease-vs-buy-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Leasing eller kjøp av bil – gratis kalkulator på nett',
  description: 'Sammenlign kostnadene ved å leasing og kjøpe bil. Gratis og uten registrering.',
  keywords: ['billeasing', 'leasing eller kjøp', 'billån', 'bilkostnad', 'månedskostnad'],
  alternates: { canonical: '/calculators/finance/car-lease-vs-buy' },
  openGraph: {
    title: 'Leasing eller kjøp av bil',
    description: 'Sammenlign kostnadene ved å leasing og kjøpe bil',
    url: '/calculators/finance/car-lease-vs-buy',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Leasing eller kjøp av bil',
  description: 'Sammenlign kostnadene ved å leasing og kjøpe bil',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi bilprisen', text: 'Skriv inn prisen på bilen, inkludert avgifter.' },
  { name: 'Fyll inn lån', text: 'Oppgi egenandel, lånerente, lånetid og bilens verdi når lånet er nedbetalt.' },
  { name: 'Fyll inn leasing', text: 'Oppgi leasingperiode og månedlig leasingleie.' },
  { name: 'Sammenlign', text: 'Se totalkostnad og hvilket alternativ som er billigst.' },
];

const faqs = [
  { question: 'Hva er forskjellen på leasing og kjøp?', answer: 'Ved leasing betaler du leie for å bruke bilen i en avtalt periode og leverer den tilbake. Ved kjøp eier du bilen og tar vare på verdien når du selger.' },
  { question: 'Hva er restverdi?', answer: 'Restverdien er hva bilen er verdt når lånet er nedbetalt eller leasingavtalen er over. Høy restverdi gjør kjøp mer gunstig.' },
  { question: 'Hva er ikke med i regnestykket?', answer: 'Forsikring, årsavgift, service, dekk, bompenger, parkering og eventuelle kjørelengdebegrensninger eller overkjøringsgebyr i leasingavtalen kommer i tillegg.' },
];

const relatedTools = [
  { href: '/calculators/finance/fuel-cost-calculator', title: 'Drivstoffkostnad for turen', description: 'Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="car-lease-vs-buy"
          title="Leasing eller kjøp av bil"
          description="Sammenlign kostnadene ved å leasing og kjøpe bil"
        />

        <section aria-label="Leasing eller kjøp av bil">
          <CarLeaseVsBuyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
