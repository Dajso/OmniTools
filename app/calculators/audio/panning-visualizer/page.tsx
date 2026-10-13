import { Metadata } from 'next';
import { AudioPanningVisualizer } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Audio Panning Visualizer - Stereo Pan Test Tool',
  description: 'Visualize and test stereo panning with this interactive tool. Hear how sound moves between left and right channels. Perfect for testing speakers and headphones.',
  keywords: ['audio panning', 'stereo test', 'pan visualizer', 'speaker test', 'headphone test', 'stereo balance', 'audio test'],
  alternates: { canonical: '/calculators/audio/panning-visualizer' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Audio Panning Visualizer',
  description: 'Visualize and test stereo panning',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Start playback', text: 'Click "Play Sound" to start the test tone.' },
  { name: 'Adjust panning', text: 'Use the slider or quick buttons to move the sound left or right.' },
  { name: 'Test auto-pan', text: 'Enable Auto-Pan to hear the sound sweep between speakers.' },
  { name: 'Change frequency', text: 'Try different frequencies to test how your speakers handle various ranges.' },
  { name: 'Use headphones', text: 'For the best stereo experience, use headphones.' },
];

const faqs = [
  {
    question: 'What is audio panning?',
    answer: 'Panning is the distribution of a sound signal between the left and right channels of a stereo field. Center pan (0) means equal volume in both channels. Hard left (-1) means sound only in the left channel.',
  },
  {
    question: 'Why test stereo panning?',
    answer: 'Testing panning helps verify that your speakers or headphones are working correctly and that the stereo image is balanced. It is also useful for understanding how panning affects the perceived position of sounds.',
  },
  {
    question: 'What is the difference between wave types?',
    answer: 'Sine waves are smooth and pure. Square waves are harsh and buzzy. Sawtooth waves are bright and edgy. Triangle waves are softer than square but brighter than sine. Each has different harmonic content.',
  },
  {
    question: 'Why does panning sound different at different frequencies?',
    answer: 'Low frequencies are harder to localize than high frequencies. This is why subwoofers can be placed anywhere in a room. Higher frequencies are more directional and easier to pan effectively.',
  },
  {
    question: 'What is auto-pan used for in music production?',
    answer: 'Auto-pan creates movement in a mix by automatically sweeping sounds between left and right. It is used for psychedelic effects, creating width, and adding interest to static sounds.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/sample-rate-calculator', title: 'Sample Rate Calculator', description: 'Calculate audio file specifications.' },
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert notes to frequencies.' },
  { href: '/calculators/audio/guitar-tuner', title: 'Guitar Tuner', description: 'Tune your instrument.' },
];

export default function PanningVisualizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="panning-visualizer"
          title="Audio Panning Visualizer"
          description="Visualize and test stereo panning. Hear how sound moves between left and right channels. Perfect for testing speakers and headphones."
          colorClass="bg-violet-100 text-violet-600"
        />

        <section aria-label="Audio Panning Visualizer">
          <AudioPanningVisualizer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
