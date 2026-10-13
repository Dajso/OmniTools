import { Metadata } from 'next';
import { SongStructureBuilder } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Song Structure Builder - Plan Your Song Arrangement',
  description: 'Plan and visualize your song structure with this drag-and-drop builder. Add verses, choruses, bridges, and more. Calculate song duration based on BPM.',
  keywords: ['song structure', 'song arrangement', 'music composition', 'verse chorus', 'song builder', 'music production', 'arrangement tool'],
  alternates: { canonical: '/calculators/audio/song-structure-builder' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Song Structure Builder',
  description: 'Plan and visualize your song structure',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set tempo', text: 'Enter your song BPM and beats per bar (time signature).' },
  { name: 'Add sections', text: 'Click section buttons to add intro, verse, chorus, bridge, etc.' },
  { name: 'Adjust length', text: 'Use +4/-4 buttons to change the number of bars in each section.' },
  { name: 'Reorder sections', text: 'Drag and drop sections to rearrange your song structure.' },
  { name: 'Review duration', text: 'Check the total duration and section summary to plan your song.' },
];

const faqs = [
  {
    question: 'What is a typical song structure?',
    answer: 'The most common pop structure is Verse-Chorus-Verse-Chorus-Bridge-Chorus. Many songs also include an intro and outro. EDM often uses Intro-Build-Drop-Breakdown-Build-Drop-Outro.',
  },
  {
    question: 'How many bars should each section be?',
    answer: 'Typically: Intro (4-8 bars), Verse (8-16 bars), Pre-Chorus (4-8 bars), Chorus (8-16 bars), Bridge (8 bars), Outro (4-8 bars). These are guidelines - feel free to experiment!',
  },
  {
    question: 'How long should a song be?',
    answer: 'Pop songs are typically 3-4 minutes. Radio edits are often under 3:30. EDM tracks can be 5-7 minutes. For streaming, 2:30-3:30 is often ideal for playlist placement.',
  },
  {
    question: 'What is a pre-chorus?',
    answer: 'A pre-chorus is a short section between the verse and chorus that builds tension and leads into the chorus. It often has different chords or melody than both verse and chorus.',
  },
  {
    question: 'What is the difference between a bridge and a breakdown?',
    answer: 'A bridge is a contrasting section that provides variety, often with different chords or melody. A breakdown (common in EDM) strips away elements to create tension before a drop.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of a song.' },
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay Calculator', description: 'Calculate tempo-synced delays.' },
  { href: '/calculators/audio/key-scale-finder', title: 'Key/Scale Finder', description: 'Find the key of your song.' },
];

export default function SongStructureBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="song-structure-builder"
          title="Song Structure Builder"
          description="Plan and visualize your song arrangement. Add sections, adjust lengths, and calculate total duration based on your tempo."
          colorClass="bg-emerald-100 text-emerald-600"
        />

        <section aria-label="Song Structure Builder">
          <SongStructureBuilder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
