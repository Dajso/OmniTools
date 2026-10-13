import { Metadata } from 'next';
import { TorqueConverter } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dreiemoment (fysikk) – gratis kalkulator på nett',
  description: 'Regn om mellom newtonmeter, fot-pund og tomme-pund. Gratis og uten registrering.',
  keywords: ['dreiemoment', 'Nm', 'fot-pund', 'newtonmeter'],
  alternates: { canonical: '/calculators/physics/torque-converter' },
  openGraph: {
    title: 'Dreiemoment (fysikk)',
    description: 'Regn om mellom newtonmeter, fot-pund og tomme-pund',
    url: '/calculators/physics/torque-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dreiemoment (fysikk)',
  description: 'Regn om mellom newtonmeter, fot-pund og tomme-pund',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn dreiemomentet', text: 'Skriv inn verdien du har.' },
  { name: 'Velg enhet', text: 'Velg enheten du regner fra.' },
  { name: 'Les resultatet', text: 'Se verdien i alle andre enheter samtidig.' },
];

const faqs = [
  { question: 'Hva er newtonmeter?', answer: 'Enheten for dreiemoment i SI-systemet. 1 N·m er kraften 1 newton på en momentarm på 1 meter.' },
  { question: 'Hvordan regner jeg fra fot-pund til N·m?', answer: 'Gang med 1,3558. 80 ft-lb er omtrent 108 N·m.' },
  { question: 'Hvilket moment skal hjulbolter ha?', answer: 'Det varierer mellom biler, ofte rundt 100–140 N·m. Se instruksjonsboken for din bil.' },
  { question: 'Hva er kilogram-meter?', answer: 'En eldre enhet der kraften regnes i kilopond. 1 kg·m er omtrent 9,807 N·m.' },
];

const relatedTools = [
  { href: '/calculators/physics/pressure-converter', title: 'Trykkomregner (fysikk)', description: 'Regn om mellom pascal, bar, PSI, atm og mer' },
  { href: '/calculators/physics/kinetic-energy-calculator', title: 'Bevegelsesenergi', description: 'Regn ut bevegelsesenergi med E = ½mv²' },
];

export default function TorqueConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="physics-torque-converter"
          title="Dreiemoment (fysikk)"
          description="Regn om dreiemoment mellom newtonmeter, fot-pund, tomme-pund og kilogram-meter. Gratis og uten registrering."
        />

        <section aria-label="Dreiemoment (fysikk)">
          <TorqueConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
