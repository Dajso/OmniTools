import { Metadata } from 'next';
import { AirbnbProfitCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Utleie på Airbnb: overskudd – gratis kalkulator på nett',
  description: 'Anslå månedlig overskudd ved korttidsutleie ut fra belegg, pris og kostnader. Gratis og uten registrering.',
  keywords: ['Airbnb', 'korttidsutleie', 'feriebolig', 'belegg', 'overskudd'],
  alternates: { canonical: '/calculators/realestate/airbnb-profit-estimator' },
  openGraph: {
    title: 'Utleie på Airbnb: overskudd',
    description: 'Anslå månedlig overskudd ved korttidsutleie ut fra belegg, pris og kostnader',
    url: '/calculators/realestate/airbnb-profit-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Utleie på Airbnb: overskudd',
  description: 'Anslå månedlig overskudd ved korttidsutleie ut fra belegg, pris og kostnader',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Sett pris og belegg', text: 'Oppgi pris per natt, rengjøringsgebyr og hvor stor del av måneden boligen er utleid.' },
  { name: 'Legg inn kostnader', text: 'Lån, strøm, forsikring, vedlikehold og felleskostnader per måned.' },
  { name: 'Sett gebyr og skatt', text: 'Plattformgebyret avhenger av hvordan du er satt opp hos Airbnb. Skatten er 22 % av overskuddet.' },
  { name: 'Les resultatet', text: 'Se overskudd per måned og år, før og etter skatt.' },
];

const faqs = [
  { question: 'Hva er et realistisk belegg?', answer: 'Det varierer mye med sted og sesong. 50–70 % er et rimelig utgangspunkt i populære områder, lavere utenfor sesong.' },
  { question: 'Må jeg betale skatt på Airbnb-inntekter?', answer: 'Ja, utleieinntekter er skattepliktige, med fradrag for kostnader. Det finnes egne regler, blant annet for utleie av egen bolig. Se skatteetaten.no for detaljer.' },
  { question: 'Hva er plattformgebyr?', answer: 'Airbnb tar et gebyr av hver booking. Størrelsen avhenger av oppsettet ditt, så sjekk din egen kontoinnstilling.' },
  { question: 'Er det lov å leie ut hele boligen?', answer: 'I borettslag og sameier kan vedtekter eller husordensregler begrense korttidsutleie. Sjekk også kommunens regler.' },
];

const relatedTools = [
  { href: '/calculators/realestate/cap-rate-calculator', title: 'Yield-kalkulator (direkteavkastning)', description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig' },
  { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Egenkapitalavkastning', description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig' },
];

export default function AirbnbProfitEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="airbnb-profit-estimator"
          title="Utleie på Airbnb: overskudd"
          description="Anslå månedlig og årlig overskudd ved korttidsutleie på Airbnb, med kostnader og skatt. Gratis og uten registrering."
        />

        <section aria-label="Utleie på Airbnb: overskudd">
          <AirbnbProfitCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
