import { Metadata } from 'next';
import { BPMTapper } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BPM Tapper - Tap Tempo & Delay Time Calculator',
  description: 'Free BPM tapper tool. Tap to the beat to detect tempo, calculate delay times for various note values. Perfect for music production and DJ work.',
  keywords: ['bpm tapper', 'tap tempo', 'bpm calculator', 'delay time calculator', 'music production', 'tempo detector'],
  alternates: { canonical: '/calculators/audio/bpm-tapper' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BPM Tapper',
  description: 'Tap to the beat to detect BPM and calculate delay times for music production',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Start tapping', text: 'Click the tap button or press Spacebar in rhythm with your music.' },
  { name: 'Keep the beat', text: 'Continue tapping for at least 4-8 beats for accurate BPM detection.' },
  { name: 'View BPM', text: 'The calculated BPM will update in real-time as you tap.' },
  { name: 'Use delay times', text: 'Copy the delay times for 1/4, 1/8, 1/16 notes to use in your DAW.' },
  { name: 'Manual entry', text: 'Switch to Manual mode to enter a specific BPM and calculate delay times.' },
];

const faqs = [
  {
    question: 'How accurate is the BPM detection?',
    answer: 'The BPM tapper calculates the average interval between your last 8 taps, providing accuracy within 0.1 BPM. For best results, tap consistently and in time with the music.',
  },
  {
    question: 'What are delay times used for?',
    answer: 'Delay times are used to sync delay and reverb effects with your music tempo. Using tempo-synced delays creates a more musical and cohesive sound in your mix.',
  },
  {
    question: 'What is a dotted note delay?',
    answer: 'A dotted note is 1.5 times the length of a regular note. Dotted delays create a bouncing, rhythmic effect commonly used in dub, reggae, and electronic music.',
  },
  {
    question: 'What is a triplet delay?',
    answer: 'Triplet delays divide the beat into three equal parts instead of two. They create a swinging, shuffle-like rhythm often used in jazz, blues, and electronic music.',
  },
  {
    question: 'How do I use these delay times in my DAW?',
    answer: 'Most DAWs allow you to set delay time in milliseconds. Copy the calculated delay time and paste it into your delay plugin settings. Some DAWs also have tempo-sync options that do this automatically.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay & Reverb Calculator', description: 'Calculate delay and reverb times from BPM.' },
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert musical notes to frequencies.' },
  { href: '/calculators/audio/metronome', title: 'Visual Metronome', description: 'Keep time with a visual metronome.' },
];

export default function BPMTapperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bpm-tapper"
          title="BPM Tapper"
          description="Tap to the beat to detect tempo and calculate delay times for music production. Perfect for syncing effects with your music."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="BPM Tapper">
          <BPMTapper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
