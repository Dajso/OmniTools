import { Metadata } from 'next';
import { SaveTheDateCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidslinje for bryllupsplanlegging – gratis kalkulator på nett',
  description: 'Lag en tidslinje med datoer for «lagre datoen», invitasjoner og svarfrist. Gratis og uten registrering.',
  keywords: ['lagre datoen', 'bryllupsplan', 'invitasjon', 'svarfrist', 'planlegging'],
  alternates: { canonical: '/calculators/wedding/save-the-date-timeline' },
  openGraph: {
    title: 'Tidslinje for bryllupsplanlegging',
    description: 'Lag en tidslinje med datoer for «lagre datoen», invitasjoner og svarfrist',
    url: '/calculators/wedding/save-the-date-timeline',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidslinje for bryllupsplanlegging',
  description: 'Lag en tidslinje med datoer for «lagre datoen», invitasjoner og svarfrist',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg bryllupsdato', text: 'Datoen dere skal gifte dere.' },
  { name: 'Se tidslinjen', text: 'Alle milepæler regnes ut bakover fra bryllupsdagen.' },
  { name: 'Følg fargene', text: 'Rødt betyr snart, gult nærmer seg og grått er passert.' },
  { name: 'Legg inn i kalenderen', text: 'Noter datoene i din egen kalender.' },
];

const faqs = [
  { question: 'Når bør jeg sende save the date?', answer: 'Rundt åtte måneder før bryllupet, og tidligere hvis mange gjester skal reise langt.' },
  { question: 'Når bør invitasjonene sendes?', answer: 'Omtrent to måneder før, med svarfrist rundt fire uker før bryllupet.' },
  { question: 'Hva er prøving av ekteskapsvilkår?', answer: 'Før dere kan gifte dere, må Skatteetaten prøve at vilkårene for å gifte seg er oppfylt. Sjekk Skatteetaten sine sider for gjeldende frister og krav.' },
  { question: 'Er tidslinjen en fasit?', answer: 'Nei, den er et utgangspunkt. Populære lokaler og leverandører kan være booket mer enn ett år i forveien.' },
];

const relatedTools = [
  { href: '/calculators/wedding/budget-allocator', title: 'Bryllupsbudsjett', description: 'Fordel bryllupsbudsjettet på lokale, mat, foto, kjole og mer' },
  { href: '/calculators/wedding/sunset-wedding-calculator', title: 'Solnedgang til bryllupet', description: 'Slå opp omtrentlig solnedgang og gylden time for dato og sted' },
];

export default function SaveTheDateTimelinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="save-the-date-timeline"
          title="Tidslinje for bryllupsplanlegging"
          description="Få en tidslinje for bryllupsplanleggingen med datoer for «save the date», invitasjoner, svarfrist og mer. Gratis og uten registrering."
        />

        <section aria-label="Tidslinje for bryllupsplanlegging">
          <SaveTheDateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
