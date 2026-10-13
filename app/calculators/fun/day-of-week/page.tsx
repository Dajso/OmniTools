import { Metadata } from 'next';
import { DayOfWeekCalculator } from '@/components/calculators/fun/day-of-week-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ukedag for en dato – gratis kalkulator på nett',
  description: 'Finn ut hvilken ukedag en dato faller på. Gratis og uten registrering.',
  keywords: ['ukedag', 'hvilken dag', 'fødselsdag ukedag', 'dato'],
  alternates: { canonical: '/calculators/fun/day-of-week' },
  openGraph: {
    title: 'Ukedag for en dato',
    description: 'Finn ut hvilken ukedag en dato faller på',
    url: '/calculators/fun/day-of-week',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ukedag for en dato',
  description: 'Finn ut hvilken ukedag en dato faller på',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dato', text: 'Skriv inn dag, måned og år.' },
  { name: 'Se ukedagen', text: 'Dagen vises med norsk navn.' },
  { name: 'Les fakta', text: 'Se hendelser og fakta knyttet til ukedagen.' },
];

const faqs = [
  { question: 'Hvordan regnes ukedagen ut?', answer: 'Med kalenderregler for den gregorianske kalenderen, der skuddår er tatt med.' },
  { question: 'Hvilke år fungerer?', answer: 'Kalkulatoren bruker den gregorianske kalenderen. For svært gamle datoer kan datidens kalender ha vært en annen.' },
  { question: 'Er faktaene verifisert?', answer: 'Hendelsene er håndplukket og ukedagene kontrollert, men sjekk gjerne kilden hvis du skal bruke dem videre.' },
  { question: 'Hvilken dag starter uken?', answer: 'I Norge regnes mandag som første dag i uken.' },
];

const relatedTools = [
  { href: '/calculators/fun/age-in-days', title: 'Alder i dager', description: 'Regn ut din eksakte alder i dager, timer, minutter og sekunder' },
  { href: '/calculators/fun/numerology', title: 'Numerologi', description: 'Regn ut livsvei-, uttrykks- og sjelstall ut fra navn og fødselsdato' },
  { href: '/calculators/productivity/date-difference', title: 'Dager mellom to datoer', description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder' },
];

export default function DayOfWeekPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="day-of-week"
          title="Ukedag for en dato"
          description="Finn ukedagen for en hvilken som helst dato, med historiske hendelser og morsomme fakta for dagen. Gratis og uten registrering."
          colorClass="bg-cyan-100 text-cyan-600"
        />

        <section aria-label="Ukedag for en dato">
          <DayOfWeekCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hvor ukedagene har navnene sine fra</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium">Norrøn opprinnelse</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Tirsdag:</strong> Tyr (krigsgud)</li>
                  <li>• <strong>Onsdag:</strong> Odin (øverste gud)</li>
                  <li>• <strong>Torsdag:</strong> Tor (tordenguden)</li>
                  <li>• <strong>Fredag:</strong> Frigg (gudinne for ekteskap og kjærlighet)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Himmellegemer og andre ord</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Søndag:</strong> sola</li>
                  <li>• <strong>Mandag:</strong> månen</li>
                  <li>• <strong>Lørdag:</strong> fra norrønt «laugardagr», som betyr vaskedag eller badedag</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Fødselsdag og ukedag</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Det engelske barnerimet «Monday's Child» knytter egenskaper til hvilken ukedag man er født på. Her er en norsk gjengivelse:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Mandag</span>
                <span className="text-muted-foreground">Pen å se på</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Tirsdag</span>
                <span className="text-muted-foreground">Full av ynde</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Onsdag</span>
                <span className="text-muted-foreground">Full av sorg</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Torsdag</span>
                <span className="text-muted-foreground">Har langt å gå</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Fredag</span>
                <span className="text-muted-foreground">Kjærlig og gavmild</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Lørdag</span>
                <span className="text-muted-foreground">Hardtarbeidende</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center col-span-2 md:col-span-1">
                <span className="block font-medium">Søndag</span>
                <span className="text-muted-foreground">Vakker og blid</span>
              </div>
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
