import { Metadata } from 'next';
import { KeyScaleFinder } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Key/Scale Finder - Identify Musical Keys from Notes',
  description: 'Find the key and scale of a song by selecting notes. Identifies major, minor, pentatonic, blues, and modal scales with match percentages.',
  keywords: ['key finder', 'scale finder', 'music theory', 'identify key', 'find scale', 'chord progression', 'music analysis'],
  alternates: { canonical: '/calculators/audio/key-scale-finder' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Key/Scale Finder',
  description: 'Identify musical keys and scales from selected notes',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select notes', text: 'Click on the notes you hear in the song or want to analyze (at least 3).' },
  { name: 'View matches', text: 'The finder will show scales that contain your selected notes, ranked by match percentage.' },
  { name: 'Check the key', text: 'The "Most Likely Key" shows the best major or minor key match.' },
  { name: 'Explore scales', text: 'Browse other matching scales like pentatonic, blues, or modes.' },
  { name: 'Use presets', text: 'Try the quick presets to see how common scales look.' },
];

const faqs = [
  {
    question: 'How do I find the key of a song?',
    answer: 'Listen to the song and identify the notes being played (especially in the melody and bass). Select those notes in the finder. The scale with the highest match percentage that feels like "home" is likely the key.',
  },
  {
    question: 'What is a relative minor/major?',
    answer: 'Relative keys share the same notes but have different root notes. C Major and A Minor are relatives - they use the same 7 notes (C D E F G A B) but C Major resolves to C while A Minor resolves to A.',
  },
  {
    question: 'What are modes?',
    answer: 'Modes are scales derived from the major scale by starting on different degrees. Dorian, Phrygian, Lydian, Mixolydian, Aeolian (natural minor), and Locrian each have a unique sound character.',
  },
  {
    question: 'When should I use pentatonic scales?',
    answer: 'Pentatonic scales (5 notes) are great for improvisation because they avoid dissonant intervals. The minor pentatonic is especially popular in rock, blues, and pop music.',
  },
  {
    question: 'What if multiple scales match 100%?',
    answer: 'This is common! For example, C Major and A Minor share all the same notes. The actual key depends on which note feels like "home" or the tonal center of the music.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert notes to frequencies.' },
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of a song.' },
  { href: '/calculators/audio/guitar-tuner', title: 'Guitar Tuner', description: 'Tune your instrument.' },
];

export default function KeyScaleFinderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="key-scale-finder"
          title="Key/Scale Finder"
          description="Identify the key and scale of a song by selecting notes. Find matching major, minor, pentatonic, blues, and modal scales."
          colorClass="bg-amber-100 text-amber-600"
          category="Audio"
        />

        <section aria-label="Key/Scale Finder">
          <KeyScaleFinder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
