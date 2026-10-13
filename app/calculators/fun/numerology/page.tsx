import { Metadata } from 'next';
import { NumerologyCalculator } from '@/components/calculators/fun/numerology-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Numerologi – gratis kalkulator på nett',
  description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato. Gratis og uten registrering.',
  keywords: ['numerologi', 'livsveitall', 'uttrykkstall', 'sjelstall'],
  alternates: { canonical: '/calculators/fun/numerology' },
  openGraph: {
    title: 'Numerologi',
    description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato',
    url: '/calculators/fun/numerology',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Numerologi',
  description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn fullt navn', text: 'Bruk navnet slik det står i dokumenter.' },
  { name: 'Velg fødselsdato', text: 'Brukes til livsveitallet.' },
  { name: 'Se tallene', text: 'Du får livsveitall, uttrykkstall og sjelstall.' },
  { name: 'Les tolkningen', text: 'Hver tall har en tradisjonell beskrivelse.' },
];

const faqs = [
  { question: 'Hvordan regnes livsveitallet ut?', answer: 'Sifrene i fødselsdatoen summeres til du står igjen med ett siffer. Mestertallene 11, 22 og 33 reduseres ikke videre.' },
  { question: 'Hva er uttrykkstall og sjelstall?', answer: 'Uttrykkstallet kommer fra alle bokstavene i navnet, og sjelstallet fra vokalene.' },
  { question: 'Hva betyr mestertall?', answer: '11, 22 og 33 regnes som særlige tall i numerologi og reduseres ikke videre.' },
  { question: 'Har numerologi vitenskapelig støtte?', answer: 'Nei, det er underholdning.' },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Stjernetegn', description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn' },
  { href: '/calculators/fun/love-compatibility', title: 'Kjærlighetstest', description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi' },
  { href: '/calculators/fun/biorhythm', title: 'Biorytme', description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato' },
];

export default function NumerologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="numerology"
          title="Numerologi"
          description="Regn ut livsveitall, uttrykkstall og sjelstall fra navn og fødselsdato. Bare for moro skyld. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Numerologi">
          <NumerologyCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tallene i numerologi</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>🛤️</span> Livsveitall
                </h3>
                <p className="text-sm text-muted-foreground">
                  Det viktigste tallet, som skal si noe om livsoppgaven din og veien du er ment å gå.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>✨</span> Uttrykkstall
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kalles også skjebnetall. Skal si noe om talentene dine og hvordan du uttrykker deg.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>💖</span> Sjelstall
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kalles også hjertets ønske. Skal si noe om indre motivasjon og hva som driver deg.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>🎭</span> Personlighetstall
                </h3>
                <p className="text-sm text-muted-foreground">
                  Skal vise hvordan andre oppfatter deg og hvilket inntrykk du gir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hva tallene står for</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { num: 1, trait: 'Lederskap' },
              { num: 2, trait: 'Samarbeid' },
              { num: 3, trait: 'Kreativitet' },
              { num: 4, trait: 'Stabilitet' },
              { num: 5, trait: 'Frihet' },
              { num: 6, trait: 'Omsorg' },
              { num: 7, trait: 'Visdom' },
              { num: 8, trait: 'Overflod' },
              { num: 9, trait: 'Medfølelse' },
              { num: 11, trait: 'Intuisjon' },
            ].map(({ num, trait }) => (
              <div key={num} className="text-center p-3 bg-muted/50 rounded-lg">
                <span className="text-2xl font-bold block">{num}</span>
                <span className="text-xs text-muted-foreground">{trait}</span>
              </div>
            ))}
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
