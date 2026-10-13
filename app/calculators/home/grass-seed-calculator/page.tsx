import { Metadata } from 'next';
import { GrassSeedCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gressfrø-kalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mye gressfrø du trenger til plenen. Gratis og uten registrering.',
  keywords: ['gressfrø', 'plen', 'så plen', 'plenareal'],
  alternates: { canonical: '/calculators/home/grass-seed-calculator' },
  openGraph: {
    title: 'Gressfrø-kalkulator',
    description: 'Beregn hvor mye gressfrø du trenger til plenen',
    url: '/calculators/home/grass-seed-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gressfrø-kalkulator',
  description: 'Beregn hvor mye gressfrø du trenger til plenen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål plenen', text: 'Oppgi lengde og bredde i meter.' },
  { name: 'Velg formål', text: 'Ny plen krever mest frø. Ettersåing og fortetting bruker mindre.' },
  { name: 'Velg plentype', text: 'Sportsplen, skyggeplen og vanlig plen har litt ulik såmengde.' },
  { name: 'Les resultatet', text: 'Se hvor mange kilo frø du trenger, og hvor mange poser det blir.' },
];

const faqs = [
  { question: 'Hvor mye gressfrø trenger jeg per m²?', answer: 'Til ny plen vanligvis 25–40 gram per m². Ved ettersåing holder omtrent halvparten.' },
  { question: 'Når bør jeg så gress?', answer: 'I Norge gir tidlig i mai og august–september best forhold. Jorda skal være fuktig og temperaturen ikke for lav.' },
  { question: 'Hva er forskjellen på plentyper?', answer: 'Sportsplen tåler mye slitasje, skyggeplen vokser med lite sol, og prydplen er finere men mer krevende å stelle.' },
  { question: 'Hvilken pose bør jeg kjøpe?', answer: 'Velg den som passer mengden best. Store poser er billigere per kilo, men frø som blir liggende mister spireevne.' },
];

const relatedTools = [
  { href: '/calculators/home/mulch-calculator', title: 'Barkflis- og jordkalkulator', description: 'Beregn hvor mye barkflis eller dekkemateriale du trenger i hagen' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function GrassSeedCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="grass-seed-calculator"
          title="Gressfrø-kalkulator"
          description="Regn ut hvor mye gressfrø du trenger til ny plen eller ettersåing, i kilo og antall poser. Gratis og uten registrering."
        />

        <section aria-label="Gressfrø-kalkulator">
          <GrassSeedCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
