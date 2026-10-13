import { Metadata } from 'next';
import { LoveCompatibilityCalculator } from '@/components/calculators/fun';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kjærlighetstest – gratis kalkulator på nett',
  description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi. Gratis og uten registrering.',
  keywords: ['kjærlighetstest', 'FLAMES', 'navnekompatibilitet', 'forhold'],
  alternates: { canonical: '/calculators/fun/love-compatibility' },
  openGraph: {
    title: 'Kjærlighetstest',
    description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi',
    url: '/calculators/fun/love-compatibility',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kjærlighetstest',
  description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn første navn', text: 'Bruk fornavn eller hele navnet.' },
  { name: 'Skriv inn andre navn', text: 'Navnet til den du vil teste mot.' },
  { name: 'Trykk på regn ut', text: 'Du får FLAMES-resultat og en prosentandel.' },
  { name: 'Les tolkningen', text: 'Resultatet er for underholdning, ikke en sannhet.' },
];

const faqs = [
  { question: 'Hvordan fungerer FLAMES?', answer: 'Bokstaver som går igjen i begge navnene strykes bort. Antallet som er igjen, brukes til å telle seg frem til et av utfallene i FLAMES: venner, kjærlighet, hengivenhet, ekteskap, fiender eller søsken.' },
  { question: 'Er resultatet pålitelig?', answer: 'Nei. Det er en lek og har ingen vitenskapelig verdi.' },
  { question: 'Blir resultatet likt hver gang?', answer: 'Ja, de samme to navnene gir alltid samme resultat.' },
  { question: 'Lagres navnene?', answer: 'Navnene sendes ikke til noen server. Alt regnes ut i nettleseren din.' },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Stjernetegn', description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn' },
  { href: '/calculators/fun/numerology', title: 'Numerologi', description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato' },
  { href: '/calculators/fun/biorhythm', title: 'Biorytme', description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato' },
];

export default function LoveCompatibilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="love-compatibility"
          title="Kjærlighetstest"
          description="Skriv inn to navn og se «kjærlighetsprosenten» med FLAMES-metoden og numerologi. Bare for moro skyld. Gratis og uten registrering."
          colorClass="bg-pink-100 text-pink-600"
        />

        <section aria-label="Kjærlighetstest">
          <LoveCompatibilityCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Om FLAMES</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              FLAMES er en gammel leken metode for å «spå» forholdet mellom to personer. Hver bokstav står for en type forhold (på engelsk: Friends, Lovers, Affection, Marriage, Enemies, Siblings):
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">F</span>
                <span>Venner</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">L</span>
                <span>Elskere</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">A</span>
                <span>Hengivenhet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">M</span>
                <span>Ekteskap</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">E</span>
                <span>Fiender</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">S</span>
                <span>Søsken</span>
              </li>
            </ul>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
