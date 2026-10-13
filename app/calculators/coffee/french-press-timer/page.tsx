import { Metadata } from 'next';
import { FrenchPressTimer } from '@/components/calculators/coffee';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Presskanne-timer – gratis kalkulator på nett',
  description: 'Timer med påminnelser for presskannekaffe, med bryggeforhold. Gratis og uten registrering.',
  keywords: ['presskanne', 'french press', 'kaffetimer', 'bryggeforhold'],
  alternates: { canonical: '/calculators/coffee/french-press-timer' },
  openGraph: {
    title: 'Presskanne-timer',
    description: 'Timer med påminnelser for presskannekaffe, med bryggeforhold',
    url: '/calculators/coffee/french-press-timer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Presskanne-timer',
  description: 'Timer med påminnelser for presskannekaffe, med bryggeforhold',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi kaffe og vann', text: 'Skriv inn kaffemengden og vannmengden i gram.' },
  { name: 'Velg trekketid', text: 'Vanlig er 4 minutter.' },
  { name: 'Start timeren', text: 'Følg påminnelsene om forbløting og røring.' },
  { name: 'Press og server', text: 'Press stempelet sakte ned og server med en gang.' },
];

const faqs = [
  { question: 'Hvor lenge skal kaffen trekke i presskanne?', answer: 'Vanligvis rundt 4 minutter. Lengre tid gir sterkere og mer bitter kaffe.' },
  { question: 'Hvilken kverning passer til presskanne?', answer: 'Grov, omtrent som havsalt.' },
  { question: 'Hvor varmt skal vannet være?', answer: '90–96 °C, altså rett etter at det har sluttet å koke.' },
  { question: 'Hvilket forhold passer?', answer: '1:15 til 1:17. 30 g kaffe til 500 g vann gir omtrent 1:16,7.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/pour-over-timer', title: 'Pour over-timer', description: 'Flertrinns timer med 4:6-metoden og egne helleplaner' },
  { href: '/calculators/coffee/grind-size-converter', title: 'Kvernstørrelse', description: 'Regn om kverninnstillinger mellom ulike kaffekverner' },
];

export default function FrenchPressTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="french-press-timer"
          title="Presskanne-timer"
          description="Timer for presskanne med påminnelser om forbløting og røring, med beregning av bryggeforhold og steg-for-steg-instruksjoner. Gratis og uten registrering."
        />

        <section aria-label="Presskanne-timer">
          <FrenchPressTimer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
