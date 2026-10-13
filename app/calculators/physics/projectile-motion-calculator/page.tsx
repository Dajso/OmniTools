import { Metadata } from 'next';
import { ProjectileMotionCalculator } from '@/components/calculators/physics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Skrått kast – gratis kalkulator på nett',
  description: 'Regn ut bane, maksimal høyde, rekkevidde og flytid for et skrått kast. Gratis og uten registrering.',
  keywords: ['skrått kast', 'kastebane', 'rekkevidde', 'fysikk', 'parabel'],
  alternates: { canonical: '/calculators/physics/projectile-motion-calculator' },
  openGraph: {
    title: 'Skrått kast',
    description: 'Regn ut bane, maksimal høyde, rekkevidde og flytid for et skrått kast',
    url: '/calculators/physics/projectile-motion-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Skrått kast',
  description: 'Regn ut bane, maksimal høyde, rekkevidde og flytid for et skrått kast',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi starthastighet og vinkel', text: 'Skriv inn starthastigheten i m/s og utkastvinkelen i grader.' },
  { name: 'Velg starthøyde og tyngdekraft', text: 'Starthøyden er valgfri. Velg jorda, månen, Mars eller egendefinert tyngdeakselerasjon.' },
  { name: 'Les resultatet', text: 'Se kastelengde, høyde, flytid og banen i diagrammet.' },
];

const faqs = [
  { question: 'Hvilken vinkel gir lengst kast?', answer: 'Uten luftmotstand og fra bakkenivå gir 45° lengst kast. Starter du høyere opp, er den beste vinkelen litt lavere.' },
  { question: 'Tar kalkulatoren hensyn til luftmotstand?', answer: 'Nei. Beregningen forutsetter vakuum, så virkelige kast blir kortere, særlig for lette og raske gjenstander.' },
  { question: 'Hva er tyngdeakselerasjonen på jorda?', answer: '9,81 m/s². På månen er den 1,62 m/s² og på Mars 3,71 m/s².' },
  { question: 'Hva er formelen for kastelengde?', answer: 'R = v₀² · sin(2θ) / g for kast fra bakkenivå.' },
];

const relatedTools = [
  { href: '/calculators/physics/kinetic-energy-calculator', title: 'Bevegelsesenergi', description: 'Regn ut bevegelsesenergi med E = ½mv²' },
  { href: '/calculators/physics/sound-speed-calculator', title: 'Lydhastighet', description: 'Regn ut lydhastigheten i luft ut fra temperatur' },
];

export default function ProjectileMotionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="projectile-motion-calculator"
          title="Skrått kast"
          description="Regn ut bane, kastelengde, maksimal høyde og flytid for et skrått kast, med tyngdekraft fra jorda, månen, Mars eller egen verdi. Gratis og uten registrering."
        />

        <section aria-label="Skrått kast">
          <ProjectileMotionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
