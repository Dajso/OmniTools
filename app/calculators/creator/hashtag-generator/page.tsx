import { Metadata } from 'next';
import { HashtagGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Emneknagg-generator – gratis kalkulator på nett',
  description: 'Lag relevante emneknagger (hashtags) for Instagram, TikTok, X og LinkedIn. Gratis og uten registrering.',
  keywords: ['hashtag', 'emneknagg', 'instagram', 'tiktok', 'sosiale medier'],
  alternates: { canonical: '/calculators/creator/hashtag-generator' },
  openGraph: {
    title: 'Emneknagg-generator',
    description: 'Lag relevante emneknagger (hashtags) for Instagram, TikTok, X og LinkedIn',
    url: '/calculators/creator/hashtag-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Emneknagg-generator',
  description: 'Lag relevante emneknagger (hashtags) for Instagram, TikTok, X og LinkedIn',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn emnet', text: 'For eksempel reisefoto, matblogg eller trening.' },
  { name: 'Velg plattform', text: 'Instagram, TikTok, X eller LinkedIn.' },
  { name: 'Velg stil og antall', text: 'Populære, nisje eller blandet.' },
  { name: 'Kopier emneknaggene', text: 'Lim dem inn i innlegget ditt.' },
];

const faqs = [
  { question: 'Hvor mange hashtags bør jeg bruke?', answer: 'Instagram tillater opptil 30, men mange bruker bare noen få. På TikTok, X og LinkedIn holder det med omtrent fem.' },
  { question: 'Hva er forskjellen på populære og nisje-hashtags?', answer: 'Populære når mange, men innlegget drukner fort. Nisje-hashtags når færre, men mer interesserte.' },
  { question: 'Kan jeg bruke norske hashtags?', answer: 'Ja, norske hashtags treffer norske brukere. Bland gjerne med noen engelske for bredere rekkevidde.' },
  { question: 'Hjelper hashtags alltid?', answer: 'Ikke alltid. De bør være relevante for innholdet.' },
];

const relatedTools = [
  { href: '/calculators/creator/utm-builder', title: 'UTM-bygger', description: 'Bygg UTM-lenker for sporing av kampanjer i markedsføring og analyse' },
];

export default function HashtagGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hashtag-generator"
          title="Emneknagg-generator"
          description="Lag relevante emneknagger (hashtags) til Instagram, TikTok, X og LinkedIn ut fra emnet ditt. Gratis og uten registrering."
        />

        <section aria-label="Emneknagg-generator">
          <HashtagGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
