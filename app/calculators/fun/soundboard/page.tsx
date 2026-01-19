import { Metadata } from 'next';
import { Soundboard } from '@/components/calculators/fun/soundboard';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Soundboard - Free Online Sound Effects | Meme Sounds',
  description: 'Play fun sound effects instantly with our free online soundboard. Perfect for reactions, streaming, video calls, and entertainment.',
  keywords: ['soundboard', 'sound effects', 'meme sounds', 'reaction sounds', 'online soundboard', 'free sounds'],
  alternates: { canonical: '/calculators/fun/soundboard' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Online Soundboard',
  description: 'Play fun sound effects instantly with our free online soundboard',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Browse sounds', text: 'Look through the available sound effects organized by category.' },
  { name: 'Filter by category', text: 'Use the category buttons to filter sounds by type (reaction, music, nature, funny).' },
  { name: 'Click to play', text: 'Click any sound button to play it instantly.' },
  { name: 'Use in your content', text: 'Perfect for video calls, streaming, presentations, or just for fun!' },
];

const faqs = [
  { 
    question: 'How do the sounds work?', 
    answer: 'Our soundboard uses the Web Audio API to generate sounds programmatically in your browser. This means no audio files need to be downloaded - sounds are created instantly!' 
  },
  { 
    question: 'Can I use these sounds in my videos?', 
    answer: 'Yes! The sounds are generated using mathematical formulas and are free to use. They\'re perfect for YouTube videos, TikToks, streams, and other content.' 
  },
  { 
    question: 'Why is there no sound?', 
    answer: 'Make sure your device volume is turned up and not muted. Some browsers require user interaction before playing audio, so try clicking a sound button directly.' 
  },
  { 
    question: 'Can I add my own sounds?', 
    answer: 'Currently, the soundboard uses pre-programmed sounds generated with Web Audio API. Custom sound uploads may be added in a future update.' 
  },
  { 
    question: 'Does this work on mobile?', 
    answer: 'Yes! The soundboard works on most modern mobile browsers. Just tap the sound buttons to play.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/decision-wheel', title: 'Decision Wheel', description: 'Spin to make random decisions.' },
  { href: '/calculators/audio/metronome', title: 'Metronome', description: 'Keep time with a visual metronome.' },
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of any song.' },
];

export default function SoundboardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="soundboard"
          title="Soundboard"
          description="Play fun sound effects instantly! Perfect for reactions, streaming, video calls, and entertainment. Click any button to play."
          colorClass="bg-gradient-to-r from-orange-100 to-red-100 text-orange-600"
          category="Fun"
        />

        <section aria-label="Soundboard" className="bg-card rounded-lg border p-6">
          <Soundboard />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Sound Categories</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">✅ Reaction Sounds</h3>
              <p className="text-sm text-green-600">
                Success, fail, ding, alarm - perfect for reacting to moments in games, streams, or conversations.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h3 className="font-medium text-orange-700 mb-2">🎵 Music Sounds</h3>
              <p className="text-sm text-orange-600">
                Drums, bells, and musical tones for adding rhythm and melody to your content.
              </p>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
              <h3 className="font-medium text-cyan-700 mb-2">🌿 Nature Sounds</h3>
              <p className="text-sm text-cyan-600">
                Whoosh and ambient sounds for transitions and atmospheric effects.
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg">
              <h3 className="font-medium text-pink-700 mb-2">😄 Funny Sounds</h3>
              <p className="text-sm text-pink-600">
                Coins, lasers, pops, and boops - classic sound effects for comedy and fun.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <span className="text-3xl block mb-2">🎮</span>
                <span className="text-sm font-medium">Gaming</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📺</span>
                <span className="text-sm font-medium">Streaming</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">💼</span>
                <span className="text-sm font-medium">Presentations</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📹</span>
                <span className="text-sm font-medium">Video Calls</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">🎬</span>
                <span className="text-sm font-medium">Content Creation</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">🎉</span>
                <span className="text-sm font-medium">Parties</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">📚</span>
                <span className="text-sm font-medium">Teaching</span>
              </div>
              <div className="p-3">
                <span className="text-3xl block mb-2">😂</span>
                <span className="text-sm font-medium">Just for Fun</span>
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
