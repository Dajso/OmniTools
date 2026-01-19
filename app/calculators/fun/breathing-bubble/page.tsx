import { Metadata } from 'next';
import { BreathingBubble } from '@/components/calculators/fun/breathing-bubble';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Breathing Exercise - Visual Breathing Bubble for Relaxation',
  description: 'Reduce stress and anxiety with our visual breathing exercise. Follow the calming bubble animation through various breathing patterns like 4-7-8 and box breathing.',
  keywords: ['breathing exercise', 'breathing bubble', 'anxiety relief', 'stress relief', '4-7-8 breathing', 'box breathing', 'meditation'],
  alternates: { canonical: '/calculators/fun/breathing-bubble' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Visual Breathing Bubble',
  description: 'A calming breathing exercise tool with visual animation for stress relief',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose a pattern', text: 'Select a breathing pattern that suits your needs - relaxing, energizing, or balanced.' },
  { name: 'Start the session', text: 'Click "Start Breathing" to begin the guided exercise.' },
  { name: 'Follow the bubble', text: 'Breathe in as the bubble expands, hold when it pauses, and exhale as it shrinks.' },
  { name: 'Continue for 5+ minutes', text: 'For best results, practice for at least 5 minutes or several cycles.' },
];

const faqs = [
  { 
    question: 'What is the 4-7-8 breathing technique?', 
    answer: 'The 4-7-8 technique involves breathing in for 4 seconds, holding for 7 seconds, and exhaling for 8 seconds. It was developed by Dr. Andrew Weil and is known for its calming effects on the nervous system.' 
  },
  { 
    question: 'What is box breathing?', 
    answer: 'Box breathing (4-4-4-4) involves equal parts inhale, hold, exhale, and hold. It\'s used by Navy SEALs and first responders to stay calm under pressure and improve focus.' 
  },
  { 
    question: 'How long should I practice?', 
    answer: 'Even 1-2 minutes can help reduce immediate stress. For lasting benefits, aim for 5-10 minutes daily. Many people find it helpful before bed or during stressful moments.' 
  },
  { 
    question: 'Can breathing exercises help with anxiety?', 
    answer: 'Yes! Deep breathing activates the parasympathetic nervous system, which counteracts the stress response. Regular practice can help reduce overall anxiety levels.' 
  },
  { 
    question: 'Should I breathe through my nose or mouth?', 
    answer: 'For most breathing exercises, breathe in through your nose and out through your mouth. Nose breathing filters and warms the air, while mouth exhaling allows for a more complete release.' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/pomodoro-timer', title: 'Pomodoro Timer', description: 'Focus timer with breaks.' },
  { href: '/calculators/health/sleep-cycle-calculator', title: 'Sleep Cycle Calculator', description: 'Optimize your sleep schedule.' },
  { href: '/calculators/fun/biorhythm', title: 'Biorhythm Calculator', description: 'Track your emotional cycles.' },
];

export default function BreathingBubblePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="breathing-bubble"
          title="Visual Breathing Bubble"
          description="Take a moment to breathe. Follow the calming bubble animation to reduce stress, lower anxiety, and find your center."
          colorClass="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-600"
          category="Fun"
        />

        <section aria-label="Breathing Exercise" className="bg-card rounded-lg border p-6">
          <BreathingBubble />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">The Science of Breathing</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Deep breathing exercises work by activating your parasympathetic nervous system - the "rest and digest" response that counteracts stress. Here's what happens in your body:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>❤️</span> Heart Rate
                </h3>
                <p className="text-sm text-muted-foreground">
                  Slow, deep breaths lower your heart rate and blood pressure.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>🧠</span> Brain Activity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Focused breathing increases alpha brain waves associated with calm alertness.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>💪</span> Muscle Tension
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deep exhales help release physical tension held in the body.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">When to Use Breathing Exercises</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">🌅 Morning Routine</h3>
              <p className="text-sm text-blue-600">
                Start your day with energizing breaths to wake up your body and mind.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700 mb-2">😰 Stressful Moments</h3>
              <p className="text-sm text-purple-600">
                Use calming breaths before presentations, interviews, or difficult conversations.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">🌙 Before Sleep</h3>
              <p className="text-sm text-green-600">
                The 4-7-8 technique is especially effective for falling asleep faster.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h3 className="font-medium text-orange-700 mb-2">💼 Work Breaks</h3>
              <p className="text-sm text-orange-600">
                Take breathing breaks to reset focus and prevent burnout.
              </p>
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
