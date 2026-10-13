import { Metadata } from 'next';
import { RenovationROICalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Verdiøkning ved oppussing – gratis kalkulator på nett',
  description: 'Anslå hvor mye kjøkken, bad og annen oppussing øker boligverdien. Gratis og uten registrering.',
  keywords: ['oppussing', 'verdiøkning', 'kjøkken', 'bad', 'boligverdi'],
  alternates: { canonical: '/calculators/realestate/renovation-roi-estimator' },
  openGraph: {
    title: 'Verdiøkning ved oppussing',
    description: 'Anslå hvor mye kjøkken, bad og annen oppussing øker boligverdien',
    url: '/calculators/realestate/renovation-roi-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Verdiøkning ved oppussing',
  description: 'Anslå hvor mye kjøkken, bad og annen oppussing øker boligverdien',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg type oppussing', text: 'Velg fra listen, for eksempel bad, kjøkken eller terrasse.' },
  { name: 'Oppgi kostnaden', text: 'Skriv inn hva du forventer at jobben koster.' },
  { name: 'Juster prosenten', text: 'Standardprosenten er et grovt anslag. Bytt den ut med eget anslag hvis du har bedre tall.' },
  { name: 'Les resultatet', text: 'Se anslått verdiøkning og netto gevinst eller tap.' },
];

const faqs = [
  { question: 'Hvor nøyaktige er tallene?', answer: 'De er grove anslag basert på amerikanske undersøkelser og passer ikke nødvendigvis det norske markedet. Bruk dem som en pekepinn og spør gjerne en megler.' },
  { question: 'Hvilken oppussing lønner seg mest?', answer: 'Ofte tiltak som gjør at boligen ser vedlikeholdt ut: maling, rene flater og fungerende bad og kjøkken. Større ombygginger gir ofte lavere avkastning på pengene.' },
  { question: 'Kan jeg få fradrag?', answer: 'Utgifter til oppussing av egen bolig gir normalt ikke fradrag, men kostnadene kan øke inngangsverdien og redusere skatt på gevinst ved salg i noen tilfeller. Sjekk skatteetaten.no.' },
  { question: 'Trenger jeg byggetillatelse?', answer: 'Det avhenger av tiltaket. Større endringer kan være søknadspliktige etter plan- og bygningsloven. Spør kommunen.' },
];

const relatedTools = [
  { href: '/calculators/realestate/brrrr-calculator', title: 'BRRRR-kalkulator', description: 'Regn ut avkastning på kjøp–oppussing–utleie–refinansiering–gjenta' },
  { href: '/calculators/realestate/closing-cost-estimator', title: 'Omkostninger ved boligkjøp', description: 'Anslå kjøpsomkostninger: dokumentavgift, tinglysing og andre gebyrer' },
];

export default function RenovationROIEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="renovation-roi-estimator"
          title="Verdiøkning ved oppussing"
          description="Anslå hvor mye en oppussing kan øke boligverdien, og om den lønner seg. Gratis og uten registrering."
        />

        <section aria-label="Verdiøkning ved oppussing">
          <RenovationROICalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
