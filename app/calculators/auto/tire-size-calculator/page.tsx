import { Metadata } from 'next';
import { TireSizeCalculator } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dekkstørrelse – gratis kalkulator på nett',
  description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer. Gratis og uten registrering.',
  keywords: ['dekkstørrelse', 'dekkomkrets', 'speedometeravvik', 'felgstørrelse', 'dekkdimensjon'],
  alternates: { canonical: '/calculators/auto/tire-size-calculator' },
  openGraph: {
    title: 'Dekkstørrelse',
    description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer',
    url: '/calculators/auto/tire-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dekkstørrelse',
  description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dagens dekk', text: 'Velg en vanlig størrelse eller skriv inn bredde, profil og felgdiameter. Du finner målene på dekkets side, for eksempel 225/45 R17.' },
  { name: 'Velg nytt dekk', text: 'Gjør det samme for dekkene du vurderer.' },
  { name: 'Les avviket', text: 'Se endring i diameter, omkrets og speedometerfeil.' },
];

const faqs = [
  { question: 'Hva betyr 225/45 R17?', answer: '225 er bredden i mm, 45 er flankehøyden i prosent av bredden, og R17 betyr radialdekk på 17 tommers felg.' },
  { question: 'Hvor mye avvik tillater Statens vegvesen?', answer: 'Dekk og felg skal ha samme eller nesten samme ytterdiameter som originalutstyret. Sjekk vognkortet og reglene fra Statens vegvesen før du bytter til en annen størrelse.' },
  { question: 'Hvorfor viser speedometeret feil med andre dekk?', answer: 'Speedometeret måler hjulets omdreininger. Med større diameter rekker hjulet lenger per omdreining, så du kjører raskere enn det viser.' },
  { question: 'Må jeg tenke på noe annet enn diameteren?', answer: 'Ja. Dekkets lastindeks, hastighetsindeks og at det passer under skjermene. Sjekk også at det er tillatt for bilen din.' },
];

const relatedTools = [
  { href: '/calculators/auto/wheel-offset-calculator', title: 'Felg-ET (offset)', description: 'Regn ut felgens ET-verdi og se om nye felger passer på bilen' },
  { href: '/calculators/auto/fuel-consumption-converter', title: 'Drivstofforbruk (l/100 km)', description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)' },
  { href: '/calculators/auto/ev-charging-calculator', title: 'Ladetid og ladekostnad for elbil', description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris' },
];

export default function TireSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tire-size-calculator"
          title="Dekkstørrelse"
          description="Sammenlign dekkstørrelser og se hvor mye speedometeret avviker, og hvor mye diameteren og bakkeklaringen endres. Gratis og uten registrering."
        />

        <section aria-label="Dekkstørrelse">
          <TireSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
