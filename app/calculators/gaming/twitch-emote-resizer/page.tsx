import { Metadata } from 'next';
import { TwitchEmoteResizer } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Twitch-emote-størrelse – gratis kalkulator på nett',
  description: 'Endre størrelsen på bilder til Twitch-emote-formater (28x28, 56x56, 112x112). Gratis og uten registrering.',
  keywords: ['twitch emote', 'emote', 'emote-størrelse', 'streaming'],
  alternates: { canonical: '/calculators/gaming/twitch-emote-resizer' },
  openGraph: {
    title: 'Twitch-emote-størrelse',
    description: 'Endre størrelsen på bilder til Twitch-emote-formater (28x28, 56x56, 112x112)',
    url: '/calculators/gaming/twitch-emote-resizer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Twitch-emote-størrelse',
  description: 'Endre størrelsen på bilder til Twitch-emote-formater (28x28, 56x56, 112x112)',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Last opp bildet', text: 'PNG, JPG eller GIF på opptil 1 MB.' },
  { name: 'Velg plattform', text: 'Twitch, BTTV eller FFZ.' },
  { name: 'Se forhåndsvisningen', text: 'Bildet blir endret til alle nødvendige størrelser.' },
  { name: 'Last ned', text: 'Last ned én størrelse eller alle samtidig.' },
];

const faqs = [
  { question: 'Hvilke størrelser trenger Twitch-emotes?', answer: 'Twitch bruker 28 × 28, 56 × 56 og 112 × 112 piksler.' },
  { question: 'Lastes bildet opp til en server?', answer: 'Nei. Alt skjer i nettleseren din, og bildet forlater ikke maskinen.' },
  { question: 'Hvilket format fungerer best?', answer: 'PNG med gjennomsiktig bakgrunn. Bruk kvadratiske bilder med høy oppløsning.' },
  { question: 'Hvorfor blir emoten uklar når den er liten?', answer: 'Detaljene forsvinner i små størrelser. Hold designet enkelt og med tydelige konturer.' },
];

const relatedTools = [
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'K/D-kalkulator', description: 'Regn ut kill/death-forhold og følg statistikken din' },
];

export default function TwitchEmoteResizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="twitch-emote-resizer"
          title="Twitch-emote-størrelse"
          description="Endre størrelsen på bildet til riktige emote-størrelser for Twitch, BTTV og FFZ, direkte i nettleseren. Gratis og uten registrering."
        />

        <section aria-label="Twitch-emote-størrelse">
          <TwitchEmoteResizer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
