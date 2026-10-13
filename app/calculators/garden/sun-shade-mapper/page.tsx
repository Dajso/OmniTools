import { Metadata } from 'next';
import { SunShadeMapper } from '@/components/calculators/garden';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sol og skygge i hagen – gratis kalkulator på nett',
  description: 'Kartlegg sol og skygge i hagen gjennom dagen. Gratis og uten registrering.',
  keywords: ['sol og skygge', 'solforhold', 'skyggekart', 'hageplanlegging'],
  alternates: { canonical: '/calculators/garden/sun-shade-mapper' },
  openGraph: {
    title: 'Sol og skygge i hagen',
    description: 'Kartlegg sol og skygge i hagen gjennom dagen',
    url: '/calculators/garden/sun-shade-mapper',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sol og skygge i hagen',
  description: 'Kartlegg sol og skygge i hagen gjennom dagen',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi breddegrad', text: 'Kristiansand ligger på ca. 58 °N, Oslo på 60 °N, Trondheim på 63 °N og Tromsø på 69 °N.' },
  { name: 'Velg måned', text: 'Solhøyden og dagslengden endrer seg mye gjennom året.' },
  { name: 'Legg inn hinderet', text: 'Høyde og avstand i meter, og hvilken retning hinderet ligger.' },
  { name: 'Se resultatet', text: 'Få anslag på soltimer, skyggelengde og passende planter.' },
];

const faqs = [
  { question: 'Hvor mye sol trenger planter?', answer: 'Solkjære planter som tomat og roser trenger over 6 timer. Mange grønnsaker greier seg med 4–6 timer, mens planter som hosta og bregner trives i skygge.' },
  { question: 'Hvorfor er skyggen så lang om vinteren?', answer: 'Sola står lavt på himmelen i Norge, så skyggene blir mange ganger lengre enn om sommeren.' },
  { question: 'Hva med midnattssol og mørketid?', answer: 'Nord for polarsirkelen står sola over horisonten hele døgnet om sommeren og under horisonten om vinteren. Kalkulatoren tar hensyn til dette i dagslengden.' },
  { question: 'Hvor nøyaktig er kartleggingen?', answer: 'Det er et grovt anslag. For nøyaktige målinger bør du observere hagen gjennom en solrik dag.' },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plantavstand', description: 'Regn ut avstand mellom planter og hvor mange som får plass i bedet' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Vanningsplan', description: 'Lag en tilpasset vanningsplan ut fra plante, klima og sesong' },
];

export default function SunShadeMapperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sun-shade-mapper"
          title="Sol og skygge i hagen"
          description="Anslå hvor mange timer sol hagen din får, ut fra breddegrad, måned og hvor høye trær eller bygninger som står i nærheten. Gratis og uten registrering."
        />

        <section aria-label="Sol og skygge i hagen">
          <SunShadeMapper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
