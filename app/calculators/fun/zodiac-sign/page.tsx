import { Metadata } from 'next';
import { ZodiacSignCalculator } from '@/components/calculators/fun/zodiac-sign-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Stjernetegn – gratis kalkulator på nett',
  description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn. Gratis og uten registrering.',
  keywords: ['stjernetegn', 'horoskop', 'astrologi', 'tegn'],
  alternates: { canonical: '/calculators/fun/zodiac-sign' },
  openGraph: {
    title: 'Stjernetegn',
    description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn',
    url: '/calculators/fun/zodiac-sign',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Stjernetegn',
  description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg fødselsdato', text: 'Dag og måned avgjør tegnet.' },
  { name: 'Se stjernetegnet', text: 'Du får tegn, element, kvalitet og planet.' },
  { name: 'Les egenskapene', text: 'Egenskaper, styrker og svakheter er tradisjonell tolkning.' },
];

const faqs = [
  { question: 'Hvilke datoer gjelder for hvert tegn?', answer: 'Datogrensene er omtrent og kan variere med én dag fra år til år. Er du født på en grense, kan tegnet være det ved siden av.' },
  { question: 'Er stjernetegn vitenskap?', answer: 'Nei. Astrologi har ikke vitenskapelig støtte, og siden er laget som underholdning.' },
  { question: 'Hva er element og kvalitet?', answer: 'Hvert tegn hører til ett av fire elementer (ild, jord, luft, vann) og én av tre kvaliteter (kardinal, fast, foranderlig).' },
  { question: 'Brukes fødselstidspunktet?', answer: 'Nei. Kalkulatoren bruker bare datoen.' },
];

const relatedTools = [
  { href: '/calculators/fun/love-compatibility', title: 'Kjærlighetstest', description: 'Test kjærlighetskompatibilitet med FLAMES-metoden og navnenumerologi' },
  { href: '/calculators/fun/moon-phase-calculator', title: 'Månefase', description: 'Se månefasen for en hvilken som helst dato, med synlig andel og kommende hendelser' },
  { href: '/calculators/fun/numerology', title: 'Numerologi', description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato' },
];

export default function ZodiacSignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="zodiac-sign"
          title="Stjernetegn"
          description="Finn stjernetegnet ditt ut fra fødselsdato, med element, kvalitet, styrende planet og typiske egenskaper. Bare for moro skyld. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Stjernetegn">
          <ZodiacSignCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">De 12 stjernetegnene</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { sign: 'Væren', symbol: '♈', dates: '21. mars – 19. april' },
                { sign: 'Tyren', symbol: '♉', dates: '20. april – 20. mai' },
                { sign: 'Tvillingene', symbol: '♊', dates: '21. mai – 20. juni' },
                { sign: 'Krepsen', symbol: '♋', dates: '21. juni – 22. juli' },
                { sign: 'Løven', symbol: '♌', dates: '23. juli – 22. august' },
                { sign: 'Jomfruen', symbol: '♍', dates: '23. august – 22. september' },
                { sign: 'Vekten', symbol: '♎', dates: '23. september – 22. oktober' },
                { sign: 'Skorpionen', symbol: '♏', dates: '23. oktober – 21. november' },
                { sign: 'Skytten', symbol: '♐', dates: '22. november – 21. desember' },
                { sign: 'Steinbukken', symbol: '♑', dates: '22. desember – 19. januar' },
                { sign: 'Vannmannen', symbol: '♒', dates: '20. januar – 18. februar' },
                { sign: 'Fiskene', symbol: '♓', dates: '19. februar – 20. mars' },
              ].map(({ sign, symbol, dates }) => (
                <div key={sign} className="text-center p-3 bg-background rounded-lg">
                  <span className="text-2xl block mb-1">{symbol}</span>
                  <span className="font-medium text-sm block">{sign}</span>
                  <span className="text-xs text-muted-foreground">{dates}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
