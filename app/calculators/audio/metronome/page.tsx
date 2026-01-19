import { Metadata } from 'next';
import { VisualMetronome } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Visual Metronome - Free Online Metronome with Visual Beat',
  description: 'Free online metronome with visual and audio cues. Supports multiple time signatures, accent options, and tempo presets. Perfect for music practice.',
  keywords: ['metronome', 'online metronome', 'visual metronome', 'tempo', 'beat', 'music practice', 'time signature'],
  alternates: { canonical: '/calculators/audio/metronome' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Visual Metronome',
  description: 'Free online metronome with visual and audio cues',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set tempo', text: 'Use the +/- buttons or type directly to set your desired BPM.' },
  { name: 'Choose time signature', text: 'Select 4/4, 3/4, 6/8, or other time signatures from the dropdown.' },
  { name: 'Configure options', text: 'Enable/disable accent on beat 1, sound, and visual flash.' },
  { name: 'Start metronome', text: 'Click Start or press Space to begin. The visual display will flash on each beat.' },
  { name: 'Practice', text: 'Play along with the metronome to improve your timing and rhythm.' },
];

const faqs = [
  {
    question: 'What BPM should I practice at?',
    answer: 'Start slow enough that you can play accurately, then gradually increase tempo. A common approach is to practice at 60-70% of your target tempo until comfortable, then increase by 5-10 BPM.',
  },
  {
    question: 'What is a time signature?',
    answer: '4/4 means 4 beats per measure with quarter notes getting one beat. 3/4 is waltz time (3 beats). 6/8 has 6 eighth notes per measure, often felt as 2 groups of 3.',
  },
  {
    question: 'Why accent the first beat?',
    answer: 'Accenting beat 1 helps you feel the start of each measure, making it easier to keep your place in the music. It is especially helpful for complex time signatures.',
  },
  {
    question: 'How do I improve my timing?',
    answer: 'Practice with a metronome regularly, starting slow. Focus on placing notes exactly on the beat. Try practicing with the metronome on beats 2 and 4 only for a more advanced challenge.',
  },
  {
    question: 'What tempo is Allegro, Andante, etc.?',
    answer: 'Largo: 40-60 BPM, Adagio: 66-76 BPM, Andante: 76-108 BPM, Moderato: 108-120 BPM, Allegro: 120-168 BPM, Presto: 168-200 BPM, Prestissimo: 200+ BPM.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of a song.' },
  { href: '/calculators/audio/guitar-tuner', title: 'Guitar Tuner', description: 'Tune your instrument.' },
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay Calculator', description: 'Calculate tempo-synced delays.' },
];

export default function MetronomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="metronome"
          title="Visual Metronome"
          description="Free online metronome with visual and audio cues. Supports multiple time signatures and tempo presets for music practice."
          colorClass="bg-rose-100 text-rose-600"
          category="Audio"
        />

        <section aria-label="Visual Metronome">
          <VisualMetronome />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
