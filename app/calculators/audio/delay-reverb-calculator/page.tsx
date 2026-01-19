import { Metadata } from 'next';
import { DelayReverbCalculator } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Delay & Reverb Time Calculator - Tempo-Synced Effects',
  description: 'Calculate tempo-synced delay and reverb times from BPM. Get precise millisecond values for quarter, eighth, sixteenth notes, dotted and triplet delays.',
  keywords: ['delay calculator', 'reverb time calculator', 'tempo sync', 'bpm to ms', 'music production', 'delay time'],
  alternates: { canonical: '/calculators/audio/delay-reverb-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Delay & Reverb Time Calculator',
  description: 'Calculate tempo-synced delay and reverb times for music production',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter BPM', text: 'Input your song tempo in BPM or select a genre preset.' },
  { name: 'Set reverb decay', text: 'Choose how many beats you want your reverb tail to last.' },
  { name: 'Copy delay times', text: 'Click the copy button next to any delay time to copy it.' },
  { name: 'Apply in DAW', text: 'Paste the millisecond values into your delay or reverb plugin.' },
  { name: 'Experiment', text: 'Try different note values - dotted and triplet delays create unique rhythmic effects.' },
];

const faqs = [
  {
    question: 'Why should I sync my delays to the tempo?',
    answer: 'Tempo-synced delays create a more musical and cohesive sound. The delay repeats align with the beat, making them feel like part of the music rather than random echoes.',
  },
  {
    question: 'What is pre-delay in reverb?',
    answer: 'Pre-delay is the time between the original sound and when the reverb starts. A small pre-delay (10-30ms) helps maintain clarity by separating the dry signal from the reverb tail.',
  },
  {
    question: 'When should I use dotted delays?',
    answer: 'Dotted delays (1.5× the note length) create a bouncing, rhythmic effect. They are popular in dub, reggae, and U2-style guitar sounds. The dotted eighth note delay is especially common.',
  },
  {
    question: 'What are triplet delays good for?',
    answer: 'Triplet delays divide the beat into three, creating a swinging or shuffle feel. They work well in jazz, blues, and electronic music where you want a less rigid rhythmic feel.',
  },
  {
    question: 'How do I choose the right reverb decay time?',
    answer: 'Shorter decays (1-2 beats) work well for fast, busy mixes. Longer decays (3-4 beats) suit slower, spacious music. Match the decay to your tempo so the reverb clears before the next phrase.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Tap to detect the tempo of any song.' },
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert musical notes to frequencies.' },
  { href: '/calculators/audio/metronome', title: 'Visual Metronome', description: 'Keep time with a visual metronome.' },
];

export default function DelayReverbCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="delay-reverb-calculator"
          title="Delay & Reverb Time Calculator"
          description="Calculate tempo-synced delay and reverb times for your music production. Get precise millisecond values for all note divisions."
          colorClass="bg-indigo-100 text-indigo-600"
          category="Audio"
        />

        <section aria-label="Delay & Reverb Time Calculator">
          <DelayReverbCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
