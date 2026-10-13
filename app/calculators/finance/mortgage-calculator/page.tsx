import { Metadata } from 'next';
import { MortgageCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Boliglånskalkulator – gratis kalkulator på nett',
  description: 'Beregn terminbeløp, renter og gebyrer på boliglånet, med annuitet eller serielån. Gratis og uten registrering.',
  keywords: ['boliglånskalkulator', 'boliglån', 'lånekalkulator', 'terminbeløp', 'annuitetslån', 'serielån'],
  alternates: { canonical: '/calculators/finance/mortgage-calculator' },
  openGraph: {
    title: 'Boliglånskalkulator',
    description: 'Beregn terminbeløp, renter og gebyrer på boliglånet, med annuitet eller serielån',
    url: '/calculators/finance/mortgage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Boliglånskalkulator',
  description: 'Beregn terminbeløp, renter og gebyrer på boliglånet, med annuitet eller serielån',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi boligprisen', text: 'Skriv inn kjøpesummen for boligen. Dokumentavgift og omkostninger kommer i tillegg.' },
  { name: 'Sett egenkapital', text: 'Oppgi egenkapital i kroner eller prosent. Bankene krever normalt minst 15 %.' },
  { name: 'Velg lånetype og nedbetalingstid', text: 'Annuitetslån har like terminbeløp. Serielån har like avdrag og synkende terminbeløp.' },
  { name: 'Fyll inn rente og gebyrer', text: 'Skriv inn nominell rente, etableringsgebyr og termingebyr fra banken.' },
  { name: 'Legg til boutgifter', text: 'Oppgi felleskostnader, eiendomsskatt og forsikring hvis du vil se de samlede boutgiftene.' },
  { name: 'Les resultatet', text: 'Se terminbeløp, effektiv rente, stresstest og full nedbetalingsplan.' },
];

const faqs = [
  { question: 'Hva er forskjellen på annuitetslån og serielån?', answer: 'Ved annuitetslån betaler du det samme beløpet hver termin, og avdraget øker gradvis mens rentene synker. Ved serielån betaler du like store avdrag hver gang, så terminbeløpet er høyest i starten og synker over tid. Serielån gir lavere sum renter, men høyere utgifter de første årene.' },
  { question: 'Hva er effektiv rente?', answer: 'Effektiv rente er den årlige kostnaden ved lånet når etableringsgebyr, termingebyr og renters rente er regnet med. Den er alltid høyere enn den nominelle renten og er det riktige tallet å bruke når du sammenligner tilbud fra ulike banker.' },
  { question: 'Hvor mye egenkapital må jeg ha?', answer: 'Etter utlånsforskriften krever bankene normalt minst 15 % egenkapital når du kjøper bolig. Egenkapitalen må dekke både differansen mellom kjøpesum og lån og omkostningene, som dokumentavgift og tinglysing. Reglene kan endres, så sjekk gjeldende krav hos banken.' },
  { question: 'Hva er stresstesten banken gjør?', answer: 'Banken vurderer om du fortsatt klarer å betjene lånet hvis renten stiger med 3 prosentpoeng. Kalkulatoren viser hvordan terminbeløpet blir i det tilfellet, slik at du kan se om budsjettet tåler det.' },
  { question: 'Hvordan regnes terminbeløpet ut?', answer: 'For annuitetslån brukes formelen T = L × [r(1+r)^n] / [(1+r)^n − 1], der L er lånet, r er månedlig rente og n er antall terminer. Termingebyret legges til hver måned.' },
];

const relatedTools = [
  { href: '/calculators/finance/refinance-calculator', title: 'Refinansieringskalkulator', description: 'Finn ut om det lønner seg å refinansiere boliglånet' },
  { href: '/calculators/finance/compound-interest-calculator', title: 'Rentesrentekalkulator', description: 'Beregn hvordan sparing vokser med renters rente' },
];

export default function MortgageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mortgage-calculator"
          title="Boliglånskalkulator"
          description="Beregn terminbeløp, renter, gebyrer og effektiv rente på boliglånet, med annuitetslån eller serielån. Se også hva som skjer om renten stiger 3 prosentpoeng."
          colorClass="bg-green-100 text-green-600"
          category="Finance"
        />

        <section aria-label="Boliglånskalkulator">
          <MortgageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
