import { Metadata } from 'next';
import { SubstrateCalculator } from '@/components/calculators/aquarium';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bunnsubstrat – gratis kalkulator på nett',
  description: 'Regn ut hvor mye grus, sand eller jord akvariet trenger. Gratis og uten registrering.',
  keywords: ['bunnsubstrat', 'akvariegrus', 'sand', 'bunnlag', 'aquasoil'],
  alternates: { canonical: '/calculators/aquarium/substrate-calculator' },
  openGraph: {
    title: 'Bunnsubstrat',
    description: 'Regn ut hvor mye grus, sand eller jord akvariet trenger',
    url: '/calculators/aquarium/substrate-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bunnsubstrat',
  description: 'Regn ut hvor mye grus, sand eller jord akvariet trenger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi akvariets mål', text: 'Lengde og bredde på bunnen i cm.' },
  { name: 'Velg tykkelse', text: 'Typisk 3–5 cm, og mer for planter med mye rot.' },
  { name: 'Velg type substrat', text: 'Grus, sand, aqua soil eller egen tetthet.' },
  { name: 'Les av vekten', text: 'Se hvor mange kilo du må kjøpe.' },
];

const faqs = [
  { question: 'Hvor tykt bør bunnsubstratet være?', answer: '3–5 cm passer for de fleste kar. Plantekar med krevende rotplanter kan trenge 6–8 cm.' },
  { question: 'Hvor mye substrat trenger jeg per liter?', answer: 'Som tommelfingerregel ca. 1 kg per 4–5 liter vann ved 3 cm tykkelse, men regn det ut med målene dine for et riktig svar.' },
  { question: 'Er det forskjell på grus og sand?', answer: 'Ja. Sand er litt lettere per liter enn grus, og aqua soil er enda lettere. Velg type i kalkulatoren.' },
  { question: 'Skal jeg kjøpe litt ekstra?', answer: 'Ja, ta med 5–10 % ekstra til skråning bakover og svinn.' },
];

const relatedTools = [
  { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Akvarievolum', description: 'Regn ut volum for rektangulære, sylinderformede og buede akvarier i liter' },
  { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Gjødseldosering (EI)', description: 'Regn ut EI-dosering av gjødsel til plantet akvarium' },
];

export default function SubstrateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="substrate-calculator"
          title="Bunnsubstrat"
          description="Regn ut hvor mange kilo grus, sand eller aqua soil akvariet trenger ut fra mål og ønsket tykkelse. Gratis og uten registrering."
        />

        <section aria-label="Bunnsubstrat">
          <SubstrateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
