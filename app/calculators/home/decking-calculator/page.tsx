import { Metadata } from 'next';
import { DeckingCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Terrassekalkulator – gratis kalkulator på nett',
  description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer. Gratis og uten registrering.',
  keywords: ['terrasse', 'terrassebord', 'terrassemateriell', 'uteplass', 'dekke'],
  alternates: { canonical: '/calculators/home/decking-calculator' },
  openGraph: {
    title: 'Terrassekalkulator',
    description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer',
    url: '/calculators/home/decking-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Terrassekalkulator',
  description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål terrassen', text: 'Oppgi lengde og bredde i meter.' },
  { name: 'Velg bord', text: 'Oppgi bordbredde i mm, bordlengde og mellomrom mellom bordene.' },
  { name: 'Sett bjelkeavstand', text: '60 cm c/c er vanlig for terrassebord i impregnert eller kledd treverk.' },
  { name: 'Les resultatet', text: 'Se antall bord, bordrader, bjelker og skruer.' },
];

const faqs = [
  { question: 'Hvor stort mellomrom bør det være mellom terrassebord?', answer: '3–8 mm er vanlig. Treverk jobber med fukt, og mellomrommet sørger for at vann renner av.' },
  { question: 'Hva er c/c?', answer: 'Senteravstand fra midten av én bjelke til midten av neste.' },
  { question: 'Må jeg søke om å bygge terrasse?', answer: 'Det kommer an på størrelse og høyde. Terrasser høyere enn cirka 0,5 m over bakken krever ofte byggemelding. Sjekk reglene hos kommunen. Rekkverk kreves ved fallhøyde over 0,5 m.' },
  { question: 'Hvorfor er det 10 % ekstra bord?', answer: 'For å dekke kapp og feil. Bordlengdene tilpasses sjelden akkurat.' },
];

const relatedTools = [
  { href: '/calculators/home/lumber-calculator', title: 'Trelastkalkulator', description: 'Beregn mengde trelast i løpemeter og m³' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function DeckingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="decking-calculator"
          title="Terrassekalkulator"
          description="Regn ut hvor mange terrassebord, bjelker og skruer du trenger til en terrasse. Gratis og uten registrering."
        />

        <section aria-label="Terrassekalkulator">
          <DeckingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
