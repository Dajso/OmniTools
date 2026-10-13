import { Metadata } from 'next';
import { PressureConverter } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Trykkomregner (fysikk) – gratis kalkulator på nett',
  description: 'Regn om mellom pascal, bar, PSI, atm og mer. Gratis og uten registrering.',
  keywords: ['trykk', 'bar til psi', 'pascal', 'atmosfære'],
  alternates: { canonical: '/calculators/physics/pressure-converter' },
  openGraph: {
    title: 'Trykkomregner (fysikk)',
    description: 'Regn om mellom pascal, bar, PSI, atm og mer',
    url: '/calculators/physics/pressure-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Trykkomregner (fysikk)',
  description: 'Regn om mellom pascal, bar, PSI, atm og mer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn trykket', text: 'Skriv inn verdien du har.' },
  { name: 'Velg enhet', text: 'Velg enheten du regner fra.' },
  { name: 'Les resultatet', text: 'Se verdien i alle andre enheter samtidig.' },
];

const faqs = [
  { question: 'Hvor mange pascal er 1 bar?', answer: '1 bar er 100 000 Pa, eller 100 kPa.' },
  { question: 'Hva er normalt lufttrykk?', answer: '1 atmosfære er 101 325 Pa, altså omtrent 1,013 bar eller 760 mmHg.' },
  { question: 'Hvor mye trykk skal det være i bildekk?', answer: 'Mange personbiler bruker rundt 2,2–2,5 bar. Se bilens dørkarm eller instruksjonsbok for riktig trykk.' },
  { question: 'Hva er forskjellen på bar og psi?', answer: 'psi (pund per kvadrattomme) brukes i USA. 1 bar er omtrent 14,5 psi.' },
];

const relatedTools = [
  { href: '/calculators/physics/torque-converter', title: 'Dreiemoment (fysikk)', description: 'Regn om mellom newtonmeter, fot-pund og tomme-pund' },
  { href: '/calculators/physics/density-calculator', title: 'Tetthet', description: 'Regn ut tetthet med formelen ρ = m/V' },
];

export default function PressureConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="physics-pressure-converter"
          title="Trykkomregner (fysikk)"
          description="Regn om trykk mellom pascal, bar, atmosfærer, psi, mmHg og flere enheter. Gratis og uten registrering."
        />

        <section aria-label="Trykkomregner (fysikk)">
          <PressureConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
