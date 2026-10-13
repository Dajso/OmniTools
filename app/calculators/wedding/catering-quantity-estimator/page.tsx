import { Metadata } from 'next';
import { CateringCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Matmengde til selskap – gratis kalkulator på nett',
  description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert. Gratis og uten registrering.',
  keywords: ['matmengde', 'buffet', 'mat per person', 'selskap', 'catering'],
  alternates: { canonical: '/calculators/wedding/catering-quantity-estimator' },
  openGraph: {
    title: 'Matmengde til selskap',
    description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert',
    url: '/calculators/wedding/catering-quantity-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Matmengde til selskap',
  description: 'Regn ut hvor mye mat du trenger til buffet: kjøtt, tilbehør, salat og dessert',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall gjester', text: 'Totalt antall gjester som skal spise.' },
  { name: 'Velg antall småretter', text: 'Hvor mange småretter eller snitter per person.' },
  { name: 'Les av mengdene', text: 'Se kilo og antall stykker.' },
  { name: 'Legg på litt ekstra', text: 'Buffet trenger gjerne 10 % buffer.' },
];

const faqs = [
  { question: 'Hvor mye mat trenger jeg per gjest?', answer: 'Veiledende ca. 200 g kjøtt eller fisk, 150 g tilbehør og 70 g salat per gjest. Til buffet kan du legge på litt.' },
  { question: 'Hvor mange småretter per person?', answer: '4–6 biter per person er vanlig hvis det kommer middag etterpå, og flere hvis dette er hele måltidet.' },
  { question: 'Hvor mange rundstykker trenger jeg?', answer: 'Omtrent 1,5 per gjest.' },
  { question: 'Må jeg ta hensyn til allergier?', answer: 'Ja. Spør gjestene om allergier og kostholdsønsker i invitasjonen, og lag alternativer for vegetarianere.' },
];

const relatedTools = [
  { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Drikke til bryllupet', description: 'Regn ut hvor mye vin, øl og sprit du trenger til bryllupsfesten' },
  { href: '/calculators/wedding/wedding-cake-calculator', title: 'Bryllupskake', description: 'Regn ut størrelse og antall etasjer på kaken ut fra antall gjester' },
];

export default function CateringQuantityEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="catering-quantity-estimator"
          title="Matmengde til selskap"
          description="Regn ut hvor mye kjøtt eller fisk, tilbehør, salat, brød og dessert du trenger til bryllupsmiddag eller buffet. Gratis og uten registrering."
        />

        <section aria-label="Matmengde til selskap">
          <CateringCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
