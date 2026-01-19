import { Metadata } from 'next';
import { GuitarTuner } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Guitar Tuner - Free Online Chromatic Tuner',
  description: 'Free online guitar tuner using your microphone. Supports standard tuning, drop D, half step down, open G, DADGAD, and more. Works with any instrument.',
  keywords: ['guitar tuner', 'online tuner', 'chromatic tuner', 'drop d tuning', 'standard tuning', 'instrument tuner', 'free tuner'],
  alternates: { canonical: '/calculators/audio/guitar-tuner' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Guitar Tuner',
  description: 'Free online guitar tuner using your microphone',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Allow microphone', text: 'Click "Start Tuning" and allow microphone access when prompted.' },
  { name: 'Select tuning', text: 'Choose your desired tuning (standard, drop D, etc.) from the dropdown.' },
  { name: 'Select string', text: 'Click on the string you want to tune to see its target frequency.' },
  { name: 'Play the string', text: 'Pluck the string and watch the tuner detect the pitch.' },
  { name: 'Adjust tuning', text: 'Turn the tuning peg until the indicator shows green (in tune).' },
];

const faqs = [
  {
    question: 'How accurate is this tuner?',
    answer: 'This tuner uses autocorrelation pitch detection and is accurate to within a few cents. For best results, tune in a quiet environment and let each string ring clearly.',
  },
  {
    question: 'What is standard guitar tuning?',
    answer: 'Standard tuning from low to high is E-A-D-G-B-E (strings 6 to 1). The frequencies are E2 (82.4 Hz), A2 (110 Hz), D3 (146.8 Hz), G3 (196 Hz), B3 (246.9 Hz), E4 (329.6 Hz).',
  },
  {
    question: 'What is Drop D tuning?',
    answer: 'Drop D tuning lowers the 6th string from E to D. This allows power chords to be played with one finger and is popular in rock and metal music.',
  },
  {
    question: 'Why should I tune up to pitch?',
    answer: 'Tuning up (tightening) to pitch rather than down helps the string settle into position and stay in tune longer. If you overshoot, tune down below the note and then back up.',
  },
  {
    question: 'Can I use this for other instruments?',
    answer: 'Yes! This is a chromatic tuner that detects any pitch. It works for bass, ukulele, violin, and any other instrument. Just ignore the string labels and tune to the detected note.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert notes to frequencies.' },
  { href: '/calculators/audio/metronome', title: 'Visual Metronome', description: 'Keep time while practicing.' },
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of a song.' },
];

export default function GuitarTunerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="guitar-tuner"
          title="Guitar Tuner"
          description="Free online guitar tuner using your microphone. Supports multiple tunings including standard, drop D, half step down, and more."
          colorClass="bg-orange-100 text-orange-600"
          category="Audio"
        />

        <section aria-label="Guitar Tuner">
          <GuitarTuner />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
