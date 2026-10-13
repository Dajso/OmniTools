import { Metadata } from 'next';
import { SignatureGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Signaturgenerator – gratis kalkulator på nett',
  description: 'Lag signaturer i håndskriftstil til dokumenter og e-post. Gratis og uten registrering.',
  keywords: ['signatur', 'digital signatur', 'håndskrift', 'e-postsignatur', 'svg'],
  alternates: { canonical: '/calculators/creator/signature-generator' },
  openGraph: {
    title: 'Signaturgenerator',
    description: 'Lag signaturer i håndskriftstil til dokumenter og e-post',
    url: '/calculators/creator/signature-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Signaturgenerator',
  description: 'Lag signaturer i håndskriftstil til dokumenter og e-post',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn navnet ditt', text: 'Navnet som skal bli en signatur.' },
  { name: 'Velg stil og farge', text: 'Velg skrift, blekkfarge og tykkelse.' },
  { name: 'Forhåndsvis', text: 'Lag på nytt til du er fornøyd.' },
  { name: 'Last ned', text: 'SVG eller PNG.' },
];

const faqs = [
  { question: 'Er signaturen juridisk gyldig?', answer: 'Den er en bilde-signatur uten sikkerhetsfunksjoner. Til avtaler som krever sikker signering bør du bruke en løsning som BankID.' },
  { question: 'Hvilket format bør jeg velge?', answer: 'SVG for dokumenter og skalering, PNG for e-post og nett.' },
  { question: 'Lagres navnet mitt?', answer: 'Nei. Alt skjer i nettleseren.' },
  { question: 'Kan jeg bruke signaturen i e-post?', answer: 'Ja, last ned som PNG og legg inn som bilde i e-postsignaturen.' },
];

const relatedTools = [
  { href: '/calculators/productivity/lorem-ipsum-generator', title: 'Lorem ipsum-generator', description: 'Lag fylltekst til design og layout' },
  { href: '/calculators/productivity/password-generator', title: 'Passordgenerator', description: 'Lag sterke passord med styrkeindikator' },
];

export default function SignatureGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="signature-generator"
          title="Signaturgenerator"
          description="Lag signaturer i håndskriftstil til dokumenter og e-post, og last dem ned som SVG eller PNG. Gratis og uten registrering."
        />

        <section aria-label="Signaturgenerator">
          <SignatureGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
