import { Metadata } from 'next';
import { NoteFrequencyConverter } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Note to Frequency Converter - Musical Note Hz Calculator',
  description: 'Convert musical notes to frequencies in Hz and vice versa. Supports all octaves, different concert pitches, and shows cents deviation.',
  keywords: ['note to frequency', 'frequency to note', 'hz calculator', 'musical notes', 'A440', 'equal temperament', 'pitch converter'],
  alternates: { canonical: '/calculators/audio/note-frequency' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Note to Frequency Converter',
  description: 'Convert musical notes to frequencies and frequencies to notes',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose mode', text: 'Select whether you want to convert a note to frequency or frequency to note.' },
  { name: 'Set reference pitch', text: 'Choose your reference pitch (A4 = 440 Hz is standard, but other tunings are available).' },
  { name: 'Enter your value', text: 'Select a note and octave, or enter a frequency in Hz.' },
  { name: 'View result', text: 'See the calculated frequency or the closest note with cents deviation.' },
  { name: 'Copy if needed', text: 'Click the copy button to copy the result to your clipboard.' },
];

const faqs = [
  {
    question: 'What is A440?',
    answer: 'A440 (also known as Stuttgart pitch) is the standard concert pitch where the note A above middle C (A4) is tuned to 440 Hz. This is the most common tuning standard used worldwide.',
  },
  {
    question: 'What are cents in music?',
    answer: 'A cent is a unit of measurement for musical intervals. There are 100 cents in a semitone. If a note is 50 cents sharp, it is exactly halfway between two semitones.',
  },
  {
    question: 'What is equal temperament?',
    answer: 'Equal temperament is a tuning system where the octave is divided into 12 equal semitones. Each semitone has a frequency ratio of 2^(1/12) ≈ 1.0595. This allows instruments to play in any key.',
  },
  {
    question: 'Why would I use a different reference pitch?',
    answer: 'Some orchestras tune to A442 or A443 for a brighter sound. Baroque music is often performed at A415. Some musicians prefer A432 for its purported benefits, though this is debated.',
  },
  {
    question: 'What is the frequency range of human hearing?',
    answer: 'Humans can typically hear frequencies from about 20 Hz to 20,000 Hz. Musical instruments generally produce fundamentals between 27.5 Hz (lowest piano note) and 4,186 Hz (highest piano note).',
  },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Tap to detect the tempo of any song.' },
  { href: '/calculators/audio/key-scale-finder', title: 'Key/Scale Finder', description: 'Find the key and scale from notes.' },
  { href: '/calculators/audio/guitar-tuner', title: 'Guitar Tuner', description: 'Tune your guitar using your microphone.' },
];

export default function NoteFrequencyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="note-frequency"
          title="Note to Frequency Converter"
          description="Convert musical notes to frequencies in Hz and vice versa. Supports all octaves and different concert pitches."
          colorClass="bg-cyan-100 text-cyan-600"
        />

        <section aria-label="Note to Frequency Converter">
          <NoteFrequencyConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
