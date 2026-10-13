import { Metadata } from 'next';
import { KDRatioCalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'K/D-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut kill/death-forhold og følg statistikken din. Gratis og uten registrering.',
  keywords: ['K/D', 'kill death', 'kdr', 'gaming', 'statistikk'],
  alternates: { canonical: '/calculators/gaming/kd-ratio-calculator' },
  openGraph: {
    title: 'K/D-kalkulator',
    description: 'Regn ut kill/death-forhold og følg statistikken din',
    url: '/calculators/gaming/kd-ratio-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'K/D-kalkulator',
  description: 'Regn ut kill/death-forhold og følg statistikken din',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi drap og dødsfall', text: 'Skriv inn totalt antall drap og dødsfall.' },
  { name: 'Legg til assist (valgfritt)', text: 'Åpne avanserte valg for KDA og seiersandel.' },
  { name: 'Les av K/D', text: 'Se forholdet og hvor du ligger på skalaen.' },
  { name: 'Se hva som skal til', text: 'Kalkulatoren viser hvor mange drap du trenger for å nå 1,0 og 2,0.' },
];

const faqs = [
  { question: 'Hva er K/D?', answer: 'Antall drap delt på antall dødsfall. K/D på 1,0 betyr like mange drap som dødsfall.' },
  { question: 'Hva er KDA?', answer: 'Som K/D, men med assist: (drap + assist) ÷ dødsfall.' },
  { question: 'Hva er en bra K/D?', answer: 'Over 1,0 er bra, over 2,0 er utmerket. Men det avhenger mye av spillet og hvem du spiller mot.' },
  { question: 'Er K/D alt som teller?', answer: 'Nei. I lagspill er det ofte viktigere å vinne runder og hjelpe laget enn å ta flest drap.' },
];

const relatedTools = [
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI-kalkulator', description: 'Regn ut effektiv DPI (eDPI) ved å gange mus-DPI med følsomhet i spillet' },
  { href: '/calculators/gaming/aim-trainer', title: 'Siktetrener', description: 'Tren sikte med klikkmål og følg treffsikkerhet og hastighet' },
];

export default function KDRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="kd-ratio-calculator"
          title="K/D-kalkulator"
          description="Regn ut K/D- og KDA-forholdet ditt og se hvordan du ligger an, med klassifisering og tips til forbedring. Gratis og uten registrering."
        />

        <section aria-label="K/D-kalkulator">
          <KDRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
