import { Metadata } from 'next';
import { WallpaperCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tapetkalkulator – gratis kalkulator på nett',
  description: 'Beregn hvor mange tapetruller du trenger. Gratis og uten registrering.',
  keywords: ['tapet', 'tapetruller', 'vegg', 'rom', 'tapetsering'],
  alternates: { canonical: '/calculators/home/wallpaper-calculator' },
  openGraph: {
    title: 'Tapetkalkulator',
    description: 'Beregn hvor mange tapetruller du trenger',
    url: '/calculators/home/wallpaper-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tapetkalkulator',
  description: 'Beregn hvor mange tapetruller du trenger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rommet', text: 'Oppgi lengde, bredde og takhøyde i meter.' },
  { name: 'Legg inn dører og vinduer', text: 'Dører trekkes fra omkretsen. Vinduer regnes ikke bort, siden du trenger tapet over og under dem.' },
  { name: 'Velg rull og mønster', text: 'Standard norsk rull er 53 cm bred og 10,05 m lang. Oppgi mønsterrapport hvis tapeten har mønster som skal passes.' },
  { name: 'Les resultatet', text: 'Se antall baner, baner per rull og totalt antall ruller.' },
];

const faqs = [
  { question: 'Hva er mønsterrapport?', answer: 'Det er avstanden før mønsteret gjentar seg. Den står på rullen. Jo større rapport, jo mer går til spille når banene skal passe sammen.' },
  { question: 'Hvor mange baner får jeg ut av en rull?', answer: 'En rull på 10,05 m gir normalt fire baner på 2,5 m. Med stor mønsterrapport kan det bli færre.' },
  { question: 'Hvorfor trekkes ikke vinduer fra?', answer: 'Du må tapetsere over og under vinduet, og banene kappes ut fra samme rull. Resultatet er derfor på den sikre siden.' },
  { question: 'Bør jeg kjøpe en ekstra rull?', answer: 'Ja, spesielt hvis tapeten er mønstret. Tapet fra ulike produksjonsserier kan ha små fargeforskjeller.' },
];

const relatedTools = [
  { href: '/calculators/home/paint-calculator', title: 'Malingskalkulator', description: 'Beregn hvor mye maling du trenger til vegger og tak i liter' },
  { href: '/calculators/home/square-footage-calculator', title: 'Arealkalkulator', description: 'Regn ut areal i kvadratmeter for rom og flater' },
];

export default function WallpaperCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="wallpaper-calculator"
          title="Tapetkalkulator"
          description="Regn ut hvor mange tapetruller du trenger til et rom, med hensyn til dører og mønsterrapport. Gratis og uten registrering."
        />

        <section aria-label="Tapetkalkulator">
          <WallpaperCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
