import { Metadata } from 'next';
import { BiorhythmCalculator } from '@/components/calculators/fun/biorhythm-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Biorytme – gratis kalkulator på nett',
  description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato. Gratis og uten registrering.',
  keywords: ['biorytme', 'syklus', 'fysisk', 'emosjonell', 'intellektuell'],
  alternates: { canonical: '/calculators/fun/biorhythm' },
  openGraph: {
    title: 'Biorytme',
    description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato',
    url: '/calculators/fun/biorhythm',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Biorytme',
  description: 'Se de fysiske, emosjonelle og intellektuelle syklusene dine ut fra fødselsdato',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn fødselsdato', text: 'Datoen rytmene regnes fra.' },
  { name: 'Velg dato å se på', text: 'Standard er i dag.' },
  { name: 'Les av rytmene', text: 'Se verdiene og grafen for perioden rundt datoen.' },
];

const faqs = [
  { question: 'Hva er biorytme?', answer: 'En gammel teori om at kroppen følger sykluser på 23, 28 og 33 dager (fysisk, emosjonell og intellektuell) fra fødselen.' },
  { question: 'Stemmer teorien?', answer: 'Nei. Studier har ikke funnet støtte for biorytmer, så bruk dette som underholdning.' },
  { question: 'Hva betyr kritiske dager?', answer: 'Dager da en kurve krysser nullinjen. Teorien sier at du da er mer ustø, men det er ikke dokumentert.' },
  { question: 'Hvorfor viser grafen en måned?', answer: 'For å gi et overblikk over hvordan kurvene beveger seg før og etter valgt dato.' },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Stjernetegn', description: 'Finn stjernetegnet ditt ut fra fødselsdato, med egenskaper og kompatible tegn' },
  { href: '/calculators/fun/moon-phase-calculator', title: 'Månefase', description: 'Se månefasen for en hvilken som helst dato, med synlig andel og kommende hendelser' },
  { href: '/calculators/fun/numerology', title: 'Numerologi', description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato' },
];

export default function BiorhythmPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="biorhythm"
          title="Biorytme"
          description="Se de fysiske, emosjonelle og intellektuelle biorytmene dine ut fra fødselsdato, med graf over en måned. Bare for moro skyld. Gratis og uten registrering."
          colorClass="bg-gradient-to-r from-red-100 via-green-100 to-blue-100 text-gray-700"
        />

        <section aria-label="Biorytme">
          <BiorhythmCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">De tre biorytmene</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💪</span>
                <h3 className="font-semibold text-red-700">Fysisk rytme</h3>
              </div>
              <p className="text-sm text-red-600 mb-2">23 dagers syklus</p>
              <p className="text-sm text-muted-foreground">
                Skal ifølge teorien påvirke styrke, utholdenhet, koordinasjon og energinivå. Topper regnes som gode perioder for fysisk aktivitet.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💚</span>
                <h3 className="font-semibold text-green-700">Emosjonell rytme</h3>
              </div>
              <p className="text-sm text-green-600 mb-2">28 dagers syklus</p>
              <p className="text-sm text-muted-foreground">
                Skal ifølge teorien påvirke humør, kreativitet, følsomhet og følelsesmessig stabilitet. Topper regnes som gode perioder for sosialt samvær og kreativt arbeid.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <h3 className="font-semibold text-blue-700">Intellektuell rytme</h3>
              </div>
              <p className="text-sm text-blue-600 mb-2">33 dagers syklus</p>
              <p className="text-sm text-muted-foreground">
                Skal ifølge teorien påvirke våkenhet, hukommelse, analytisk tenkning og læreevne. Topper regnes som gode perioder for krevende tankearbeid.
              </p>
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
