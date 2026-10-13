import { Metadata } from 'next';
import { VegetableYieldCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Grønnsakavling – gratis kalkulator på nett',
  description: 'Anslå avling av grønnsaker ut fra antall planter og sort. Gratis og uten registrering.',
  keywords: ['avling', 'grønnsaker', 'høsting', 'kjøkkenhage'],
  alternates: { canonical: '/calculators/garden/vegetable-yield-calculator' },
  openGraph: {
    title: 'Grønnsakavling',
    description: 'Anslå avling av grønnsaker ut fra antall planter og sort',
    url: '/calculators/garden/vegetable-yield-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Grønnsakavling',
  description: 'Anslå avling av grønnsaker ut fra antall planter og sort',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg grønnsak', text: 'Velg plantene du skal dyrke.' },
  { name: 'Oppgi areal eller antall planter', text: 'Størrelsen på bedet i m² eller radmeter, eller antall planter.' },
  { name: 'Velg dyrkingsforhold', text: 'Fra dårlig til svært god jord, vanning og sol.' },
  { name: 'Les av avlingen', text: 'Se forventet avling i kg totalt, per plante og per m².' },
];

const faqs = [
  { question: 'Hvor nøyaktige er anslagene?', answer: 'De er gjennomsnittsverdier for vanlige dyrkingsforhold, bygget på internasjonale tall. I Norge med kort og lys sommer kan avlingen avvike, særlig for varmekrevende vekster utendørs. Bruk dem som en planleggingshjelp.' },
  { question: 'Hva påvirker avlingen?', answer: 'Jordkvalitet, jevn vanning, sol (minst 6 timer), riktig plantavstand, gjødsling og skadedyr og sykdom.' },
  { question: 'Hvor mange tomatplanter trenger en familie?', answer: 'Til ferskt forbruk 2–4 planter per person. Skal du sylte eller fryse, 6–10 planter per person. Hver plante gir omtrent 4–7 kg i godt drivhus.' },
  { question: 'Hva betyr høstinger per sesong?', answer: 'Noen vekster som salat og reddik kan sås flere ganger. Avlingen som vises er samlet for alle såingene.' },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/seed-germination-tracker', title: 'Spiringslogg', description: 'Følg spiring og spiringsprosent for frøene dine' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Gjødsel (N-P-K)', description: 'Regn ut gjødselmengde ut fra N-P-K-forhold til plen eller hage' },
];

export default function VegetableYieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="vegetable-yield-calculator"
          title="Grønnsakavling"
          description="Anslå hvor mye du kan høste av grønnsakene i hagen, i kg, ut fra areal, antall planter og dyrkingsforhold. Gratis og uten registrering."
        />

        <section aria-label="Grønnsakavling">
          <VegetableYieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
