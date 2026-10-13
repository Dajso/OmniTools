import { Metadata } from 'next';
import { MedicineDosageCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Medisindosering i akvarium – gratis kalkulator på nett',
  description: 'Regn ut riktig dose akvariemedisin ut fra volum. Gratis og uten registrering.',
  keywords: ['akvariemedisin', 'dosering', 'malakittgrønt', 'metylenblått'],
  alternates: { canonical: '/calculators/aquarium/medicine-dosage-calculator' },
  openGraph: {
    title: 'Medisindosering i akvarium',
    description: 'Regn ut riktig dose akvariemedisin ut fra volum',
    url: '/calculators/aquarium/medicine-dosage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Medisindosering i akvarium',
  description: 'Regn ut riktig dose akvariemedisin ut fra volum',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi volumet', text: 'Akvariumvolum i liter.' },
  { name: 'Velg medisin', text: 'Velg et av produktene, eller legg inn egen dosering.' },
  { name: 'Les av dosen', text: 'Se hvor mange ml (og teskjeer) du skal bruke.' },
  { name: 'Les merknaden', text: 'Sjekk forholdsregler og følg alltid bruksanvisningen på produktet.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut medisindosen?', answer: 'Dose = (volum ÷ 10) × dose per 10 liter. Et kar på 100 liter med 1 ml per 10 liter gir 10 ml.' },
  { question: 'Skal jeg bruke bruttovolum eller nettovolum?', answer: 'Bruk gjerne nettovolum, siden substrat og dekor tar plass. Er du usikker, bruk netto vannvolum fra akvarievolum-kalkulatoren.' },
  { question: 'Må jeg ta ut filterkull?', answer: 'Ja, aktivt kull fjerner medisin fra vannet og må tas ut under behandlingen.' },
  { question: 'Kan jeg stole på kalkulatoren?', answer: 'Bruk den som hjelp, men følg alltid produsentens anvisning og spør veterinær eller akvariebutikk ved tvil.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/water-change-calculator', title: 'Vannskifte', description: 'Regn ut hvordan vannskifte påvirker nitrat og andre verdier' },
];

export default function MedicineDosageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="medicine-dosage-calculator"
          title="Medisindosering i akvarium"
          description="Regn ut hvor mange milliliter medisin du trenger til akvariet ut fra volum og produkt. Gratis og uten registrering."
        />

        <section aria-label="Medisindosering i akvarium">
          <MedicineDosageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
