import { Metadata } from 'next';
import { PokemonTypeCalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pokémon-typekalkulator – gratis kalkulator på nett',
  description: 'Se styrker, svakheter og motstand mellom Pokémon-typer. Gratis og uten registrering.',
  keywords: ['pokemon', 'typekalkulator', 'typesvakhet', 'typetabell', 'kamp'],
  alternates: { canonical: '/calculators/gaming/pokemon-type-calculator' },
  openGraph: {
    title: 'Pokémon-typekalkulator',
    description: 'Se styrker, svakheter og motstand mellom Pokémon-typer',
    url: '/calculators/gaming/pokemon-type-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pokémon-typekalkulator',
  description: 'Se styrker, svakheter og motstand mellom Pokémon-typer',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg modus', text: 'Forsvar eller angrep.' },
  { name: 'Velg typer', text: 'Velg 1–2 typer for forsvar, eller én for angrep.' },
  { name: 'Les av treffene', text: 'Se svakheter, motstand og immuniteter.' },
  { name: 'Planlegg laget ditt', text: 'Bruk oversikten til å bygge et godt lag.' },
];

const faqs = [
  { question: 'Hva betyr ×2 og ×4?', answer: 'Skaden dobles eller firedobles fordi angrepstypen er veldig effektiv mot én eller begge typene.' },
  { question: 'Hvorfor har noen to typer?', answer: 'Mange Pokémon har to typer, og effektene ganges sammen. Derfor kan noe gi ×4 eller ×0,25.' },
  { question: 'Hva er immunitet?', answer: 'Når en type ikke gjør skade, for eksempel normale angrep mot spøkelsestyper.' },
  { question: 'Hvorfor er typenavnene på engelsk?', answer: 'Pokémon finnes ikke offisielt på norsk, så spillerne bruker vanligvis de engelske typenavnene.' },
];

const relatedTools = [
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'K/D-kalkulator', description: 'Regn ut kill/death-forhold og følg statistikken din' },
];

export default function PokemonTypeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pokemon-type-calculator"
          title="Pokémon-typekalkulator"
          description="Regn ut hvilke typer som er sterke og svake mot hverandre i Pokémon, for både forsvar og angrep. Gratis og uten registrering."
        />

        <section aria-label="Pokémon-typekalkulator">
          <PokemonTypeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
