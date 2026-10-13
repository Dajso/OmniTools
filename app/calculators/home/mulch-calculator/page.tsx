import { Metadata } from 'next';
import { MulchCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Barkflis- og jordkalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye barkflis eller dekkemateriale du trenger i hagen. Gratis og uten registrering.',
  keywords: ['barkflis', 'hage', 'dekkemateriale', 'bed', 'kubikkmeter'],
  alternates: { canonical: '/calculators/home/mulch-calculator' },
  openGraph: {
    title: 'Barkflis- og jordkalkulator',
    description: 'Beregn hvor mye barkflis eller dekkemateriale du trenger i hagen',
    url: '/calculators/home/mulch-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Barkflis- og jordkalkulator',
  description: 'Beregn hvor mye barkflis eller dekkemateriale du trenger i hagen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål bedet', text: 'Lengde og bredde i meter.' },
  { name: 'Velg tykkelse', text: 'Oppgi hvor tykt lag du vil ha, i centimeter.' },
  { name: 'Les resultatet', text: 'Se volum i liter og m³, og hvor mange sekker det blir.' },
];

const faqs = [
  { question: 'Hvor tykt lag barkflis bør jeg ha?', answer: '5–8 cm hindrer ugress og holder på fuktigheten uten å kvele røttene.' },
  { question: 'Hvor mye er en kubikkmeter?', answer: '1 m³ er 1 000 liter. Sekker selges vanligvis på 50 eller 80 liter.' },
  { question: 'Hvor mye jord trenger jeg til et nytt bed?', answer: 'Til blomster og stauder holder gjerne 20–30 cm. Til grønnsaker bør du regne 25–40 cm.' },
  { question: 'Bør jeg bestille løs vare?', answer: 'Til store flater er det billigere å kjøpe i storsekk eller løs lass.' },
];

const relatedTools = [
  { href: '/calculators/home/grass-seed-calculator', title: 'Gressfrø-kalkulator', description: 'Beregn hvor mye gressfrø du trenger til plenen' },
  { href: '/calculators/home/gravel-calculator', title: 'Grus- og pukkalkulator', description: 'Beregn hvor mye grus eller pukk du trenger i m³ og tonn' },
];

export default function MulchCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mulch-calculator"
          title="Barkflis- og jordkalkulator"
          description="Regn ut hvor mange liter barkflis, jord eller kompost du trenger til bedet. Gratis og uten registrering."
        />

        <section aria-label="Barkflis- og jordkalkulator">
          <MulchCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
