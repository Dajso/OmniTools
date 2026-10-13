import { Metadata } from 'next';
import { MinecraftCircleGenerator } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Minecraft-sirkelgenerator – gratis kalkulator på nett',
  description: 'Lag nøyaktige sirkler og ovaler for bygging og pikselkunst i Minecraft. Gratis og uten registrering.',
  keywords: ['minecraft', 'sirkel', 'pikselsirkel', 'bygging', 'pikselkunst'],
  alternates: { canonical: '/calculators/gaming/minecraft-circle-generator' },
  openGraph: {
    title: 'Minecraft-sirkelgenerator',
    description: 'Lag nøyaktige sirkler og ovaler for bygging og pikselkunst i Minecraft',
    url: '/calculators/gaming/minecraft-circle-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Minecraft-sirkelgenerator',
  description: 'Lag nøyaktige sirkler og ovaler for bygging og pikselkunst i Minecraft',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg form', text: 'Sirkel, oval eller kule.' },
  { name: 'Oppgi størrelse', text: 'Diameter eller bredde og høyde i blokker.' },
  { name: 'Se malen', text: 'Grønne blokker viser hvor du skal bygge.' },
  { name: 'Bygg lag for lag', text: 'For kuler: bruk glidebryteren for å se hvert lag.' },
];

const faqs = [
  { question: 'Hvor stor kan sirkelen være?', answer: 'Opptil 128 blokker for sirkler og ovaler, og 64 for kuler i verktøyet.' },
  { question: 'Hva betyr «fyll formen»?', answer: 'Da får du en helt fylt flate i stedet for bare omrisset.' },
  { question: 'Hvorfor ser små sirkler kantete ut?', answer: 'Fordi Minecraft består av blokker. Små sirkler får trappetrinn, og store ser jevnere ut.' },
  { question: 'Hvordan bygger jeg en kule?', answer: 'Bygg ett lag om gangen fra bunnen, i tråd med malen for hvert Y-nivå.' },
];

const relatedTools = [
  { href: '/calculators/gaming/pokemon-type-calculator', title: 'Pokémon-typekalkulator', description: 'Se styrker, svakheter og motstand mellom Pokémon-typer' },
];

export default function MinecraftCircleGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="minecraft-circle-generator"
          title="Minecraft-sirkelgenerator"
          description="Lag pikselperfekte sirkler, ovaler og kuler til Minecraft, med mal for hvert lag. Gratis og uten registrering."
        />

        <section aria-label="Minecraft-sirkelgenerator">
          <MinecraftCircleGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
