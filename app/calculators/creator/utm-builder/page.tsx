import { Metadata } from 'next';
import { UTMBuilder } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'UTM-bygger – gratis kalkulator på nett',
  description: 'Bygg UTM-lenker for sporing av kampanjer i markedsføring og analyse. Gratis og uten registrering.',
  keywords: ['UTM', 'UTM-generator', 'kampanjesporing', 'analyse', 'markedsføring'],
  alternates: { canonical: '/calculators/creator/utm-builder' },
  openGraph: {
    title: 'UTM-bygger',
    description: 'Bygg UTM-lenker for sporing av kampanjer i markedsføring og analyse',
    url: '/calculators/creator/utm-builder',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UTM-bygger',
  description: 'Bygg UTM-lenker for sporing av kampanjer i markedsføring og analyse',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn nettadressen', text: 'Siden kampanjen skal lede til.' },
  { name: 'Fyll ut kilde og medium', text: 'For eksempel «google» og «cpc».' },
  { name: 'Gi kampanjen et navn', text: 'For eksempel «sommersalg».' },
  { name: 'Kopier URL-en', text: 'Bruk den i annonser, e-poster og innlegg.' },
];

const faqs = [
  { question: 'Hva er UTM-parametere?', answer: 'Tillegg i URL-en som forteller analyseverktøyet hvor besøket kom fra: kilde, medium, kampanje, og eventuelt ord og innhold.' },
  { question: 'Hvilke felt er obligatoriske?', answer: 'Kilde, medium og kampanjenavn.' },
  { question: 'Bør jeg bruke store eller små bokstaver?', answer: 'Bruk små bokstaver konsekvent, siden UTM-verdier skiller mellom store og små bokstaver.' },
  { question: 'Skal UTM-lenker brukes på egne sider?', answer: 'Nei, ikke internt på nettstedet ditt, da kan de ødelegge sporingen av hvor besøkende kom fra.' },
];

const relatedTools = [
  { href: '/calculators/creator/schema-markup-generator', title: 'Schema markup-generator', description: 'Lag JSON-LD strukturerte data for SEO, som FAQ, artikkel og produkt' },
];

export default function UTMBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="utm-builder"
          title="UTM-bygger"
          description="Bygg UTM-lenker for å spore kampanjer i Google Analytics og andre verktøy. Gratis og uten registrering."
        />

        <section aria-label="UTM-bygger">
          <UTMBuilder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
