import { Metadata } from 'next';
import { InvoiceGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fakturagenerator – gratis kalkulator på nett',
  description: 'Lag profesjonelle fakturaer med MVA og KID. Gratis og uten registrering.',
  keywords: ['faktura', 'fakturamal', 'MVA', 'KID', 'fakturering'],
  alternates: { canonical: '/calculators/creator/invoice-generator' },
  openGraph: {
    title: 'Fakturagenerator',
    description: 'Lag profesjonelle fakturaer med MVA og KID',
    url: '/calculators/creator/invoice-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fakturagenerator',
  description: 'Lag profesjonelle fakturaer med MVA og KID',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll ut avsender og kunde', text: 'Firmanavn, adresse og organisasjonsnummer for begge parter.' },
  { name: 'Legg til fakturalinjer', text: 'Beskrivelse, antall og pris eks. MVA per linje.' },
  { name: 'Velg MVA-sats', text: '25 %, 15 %, 12 % eller 0 % ut fra hva du selger.' },
  { name: 'Legg inn kontonummer og KID', text: 'Lag KID automatisk ut fra fakturanummeret.' },
  { name: 'Last ned PDF', text: 'Send fakturaen til kunden.' },
];

const faqs = [
  { question: 'Hva må en faktura inneholde i Norge?', answer: 'Blant annet fakturanummer, dato, navn og adresse på selger og kjøper, beskrivelse av varen eller tjenesten, beløp og MVA. MVA-registrerte virksomheter må oppgi organisasjonsnummer med «MVA». Sjekk gjeldende krav hos Skatteetaten.' },
  { question: 'Hvilke MVA-satser finnes?', answer: '25 % er alminnelig sats, 15 % gjelder matvarer, og 12 % gjelder blant annet persontransport, overnatting og kino. Noen tjenester er fritatt.' },
  { question: 'Hva er KID?', answer: 'Et kundeidentifikasjonsnummer som gjør at betalingen kan kobles automatisk til fakturaen. Kalkulatoren lager KID med kontrollsiffer (modulus 10).' },
  { question: 'Lagres dataene mine?', answer: 'Nei. Alt skjer lokalt i nettleseren, og ingenting lagres eller sendes videre.' },
  { question: 'Er dette et regnskapsprogram?', answer: 'Nei. Verktøyet lager bare en PDF. Du må selv sørge for fortløpende fakturanumre og føre regnskap.' },
];

const relatedTools = [
  { href: '/calculators/creator/signature-generator', title: 'Signaturgenerator', description: 'Lag signaturer i håndskriftstil til dokumenter og e-post' },
];

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="invoice-generator"
          title="Fakturagenerator"
          description="Lag en faktura med MVA, kontonummer og KID og last den ned som PDF. Alt skjer i nettleseren din, og ingenting sendes til en server. Gratis og uten registrering."
        />

        <section aria-label="Fakturagenerator">
          <InvoiceGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
