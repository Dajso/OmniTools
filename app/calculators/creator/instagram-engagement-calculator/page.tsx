import { Metadata } from 'next';
import { InstagramEngagementCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Instagram-engasjement – gratis kalkulator på nett',
  description: 'Regn ut engasjementsraten på Instagram. Gratis og uten registrering.',
  keywords: ['instagram', 'engasjement', 'engasjementsrate', 'sosiale medier'],
  alternates: { canonical: '/calculators/creator/instagram-engagement-calculator' },
  openGraph: {
    title: 'Instagram-engasjement',
    description: 'Regn ut engasjementsraten på Instagram',
    url: '/calculators/creator/instagram-engagement-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Instagram-engasjement',
  description: 'Regn ut engasjementsraten på Instagram',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall følgere', text: 'Antall følgere på kontoen.' },
  { name: 'Skriv inn engasjement', text: 'Likerklikk, kommentarer, delinger og lagringer.' },
  { name: 'Angi antall innlegg', text: 'Antall innlegg tallene gjelder.' },
  { name: 'Les av raten', text: 'Se vurderingen og sammenligningen.' },
];

const faqs = [
  { question: 'Hvordan regnes engasjementsraten ut?', answer: '(Likerklikk + kommentarer + delinger + lagringer) ÷ følgere × 100.' },
  { question: 'Hva er en god engasjementsrate?', answer: 'Det avhenger av kontoens størrelse. Mindre kontoer har gjerne høyere rate enn store.' },
  { question: 'Hvorfor synker raten når kontoen vokser?', answer: 'Fordi en mindre andel av følgerne ser og reagerer på hvert innlegg.' },
  { question: 'Hva betyr lagringer og delinger?', answer: 'De veier tungt i Instagram-algoritmen og viser at innholdet oppleves som nyttig.' },
];

const relatedTools = [
  { href: '/calculators/creator/youtube-money-calculator', title: 'YouTube-inntektskalkulator', description: 'Anslå YouTube-inntekter ut fra visninger og engasjement' },
  { href: '/calculators/creator/cpm-calculator', title: 'CPM-kalkulator', description: 'Regn ut kostnad per tusen visninger (CPM) i annonsekampanjer' },
];

export default function InstagramEngagementCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="instagram-engagement-calculator"
          title="Instagram-engasjement"
          description="Regn ut engasjementsraten din på Instagram og sammenlign med normaltall for kontoer av samme størrelse. Gratis og uten registrering."
        />

        <section aria-label="Instagram-engasjement">
          <InstagramEngagementCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
