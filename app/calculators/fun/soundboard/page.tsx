import { Metadata } from 'next';
import { Soundboard } from '@/components/calculators/fun/soundboard';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lydbrett – gratis kalkulator på nett',
  description: 'Spill av morsomme lydeffekter umiddelbart. Gratis og uten registrering.',
  keywords: ['lydbrett', 'lydeffekter', 'meme-lyder', 'soundboard'],
  alternates: { canonical: '/calculators/fun/soundboard' },
  openGraph: {
    title: 'Lydbrett',
    description: 'Spill av morsomme lydeffekter umiddelbart',
    url: '/calculators/fun/soundboard',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lydbrett',
  description: 'Spill av morsomme lydeffekter umiddelbart',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg kategori', text: 'Filtrer lydene på reaksjon, musikk, natur eller morsomt.' },
  { name: 'Trykk på en lyd', text: 'Lyden spilles av med en gang.' },
  { name: 'Trykk flere ganger', text: 'Du kan spille lydene så mange ganger du vil.' },
];

const faqs = [
  { question: 'Hvor kommer lydene fra?', answer: 'De lages av nettleseren din med Web Audio, så ingen lydfiler lastes ned.' },
  { question: 'Hvorfor hører jeg ingenting?', answer: 'Sjekk at lyden på enheten er på, og at nettleseren har tillatt lyd. Noen nettlesere krever et trykk på siden først.' },
  { question: 'Fungerer det på mobil?', answer: 'Ja, i de fleste moderne nettlesere.' },
];

const relatedTools = [
  { href: '/calculators/fun/decision-wheel', title: 'Avgjørelseshjul', description: 'Spinn hjulet og la tilfeldighetene bestemme' },
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
];

export default function SoundboardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="soundboard"
          title="Lydbrett"
          description="Et enkelt lydbrett med korte lydeffekter laget direkte i nettleseren. Gratis og uten registrering."
          colorClass="bg-gradient-to-r from-orange-100 to-red-100 text-orange-600"
        />

        <section aria-label="Lydbrett" className="bg-card rounded-lg border p-6">
          <Soundboard />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Lydkategorier</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">✅ Reaksjonslyder</h3>
              <p className="text-sm text-green-600">
                Suksess, bom, ding og alarm. Passer til å reagere på øyeblikk i spill, strømminger eller samtaler.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h3 className="font-medium text-orange-700 mb-2">🎵 Musikklyder</h3>
              <p className="text-sm text-orange-600">
                Trommer, bjeller og toner som gir rytme og melodi.
              </p>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
              <h3 className="font-medium text-cyan-700 mb-2">🌿 Naturlyder</h3>
              <p className="text-sm text-cyan-600">
                Svisj og lyder til overganger og stemning.
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg">
              <h3 className="font-medium text-pink-700 mb-2">😄 Morsomme lyder</h3>
              <p className="text-sm text-pink-600">
                Mynter, lasere, pop og bopp. Klassiske lydeffekter til humor og moro.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Bruksområder</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <span className="text-3xl block mb-2">🎮</span>
                <span className="text-sm font-medium">Spill</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📺</span>
                <span className="text-sm font-medium">Strømming</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">💼</span>
                <span className="text-sm font-medium">Presentasjoner</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📹</span>
                <span className="text-sm font-medium">Videomøter</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">🎬</span>
                <span className="text-sm font-medium">Innholdsproduksjon</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">🎉</span>
                <span className="text-sm font-medium">Fester</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📚</span>
                <span className="text-sm font-medium">Undervisning</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">😂</span>
                <span className="text-sm font-medium">Bare for moro</span>
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
