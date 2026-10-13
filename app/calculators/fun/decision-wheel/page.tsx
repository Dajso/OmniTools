import { Metadata } from 'next';
import { DecisionWheel } from '@/components/calculators/fun/decision-wheel';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Decision Maker Wheel - Spin to Decide | Random Picker',
  description: 'Can\'t decide? Spin the wheel and let fate choose! Our free decision maker wheel helps you make random choices with a fun spinning animation.',
  keywords: ['decision wheel', 'random picker', 'spin wheel', 'decision maker', 'random choice', 'wheel spinner'],
  alternates: { canonical: '/calculators/fun/decision-wheel' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Decision Maker Wheel',
  description: 'Spin the wheel to make random decisions with a fun animation',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add your options', text: 'Enter the choices you\'re deciding between, or use a preset.' },
  { name: 'Spin the wheel', text: 'Click the "Spin the Wheel" button to start the animation.' },
  { name: 'Wait for the result', text: 'Watch the wheel spin and slow down to reveal your choice.' },
  { name: 'Accept your fate', text: 'The wheel has spoken! Follow through with the decision.' },
];

const faqs = [
  { 
    question: 'Is the wheel truly random?', 
    answer: 'Yes! The wheel uses JavaScript\'s random number generator to determine where it lands. Each option has an equal chance of being selected.' 
  },
  { 
    question: 'How many options can I add?', 
    answer: 'You can add up to 15 options to the wheel. For best visibility, we recommend 2-10 options.' 
  },
  { 
    question: 'Can I save my wheel?', 
    answer: 'Currently, the wheel resets when you refresh the page. You can quickly recreate your options or use one of the preset configurations.' 
  },
  { 
    question: 'Why use a decision wheel?', 
    answer: 'Decision wheels are great for breaking decision paralysis, making fair random selections, adding fun to group decisions, or when you genuinely don\'t have a preference.' 
  },
  { 
    question: 'Can I use this for giveaways?', 
    answer: 'Absolutely! The wheel is perfect for random selections in giveaways, raffles, or choosing winners. Each option has an equal probability.' 
  },
];

const relatedTools = [
  { href: '/calculators/productivity/random-number-generator', title: 'Random Number Generator', description: 'Generate random numbers in any range.' },
  { href: '/calculators/fun/love-compatibility', title: 'Love Compatibility Test', description: 'Test your compatibility with someone.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll virtual dice for games.' },
];

export default function DecisionWheelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="decision-wheel"
          title="Decision Maker Wheel"
          description="Can't decide? Let the wheel choose for you! Add your options, spin the wheel, and let fate make the decision."
          colorClass="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600"
        />

        <section aria-label="Decision Maker Wheel" className="bg-card rounded-lg border p-6">
          <DecisionWheel />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">When to Use a Decision Wheel</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🍕</span> Food Decisions
              </h3>
              <p className="text-sm text-muted-foreground">
                Can't decide what to eat? Add your favorite restaurants or cuisines and let the wheel pick tonight's dinner.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🎮</span> Game Night
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose which game to play, who goes first, or settle any dispute with a fair spin.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🎁</span> Giveaways
              </h3>
              <p className="text-sm text-muted-foreground">
                Perfect for random selections in contests, raffles, or choosing winners fairly.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span>🤔</span> Breaking Ties
              </h3>
              <p className="text-sm text-muted-foreground">
                When you're stuck between options and can't decide, let randomness break the deadlock.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Pro Tips</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>If you're not happy with the result, that tells you something about what you really want!</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Use "best 2 out of 3" for important decisions to feel more confident.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>Add a "wildcard" option for spontaneous adventures!</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💡</span>
                <span>The wheel works great for classroom activities and team building.</span>
              </li>
            </ul>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
