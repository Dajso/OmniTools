import { Metadata } from 'next';
import { CoinFlipSimulator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Coin Flip Simulator - Probability Distribution Visualization',
  description: 'Simulate coin flips and visualize the distribution of heads and tails. Learn about probability and the law of large numbers.',
  keywords: ['coin flip simulator', 'coin toss', 'probability', 'heads or tails', 'random generator', 'statistics'],
  alternates: { canonical: '/calculators/stats/coin-flip-simulator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Coin Flip Simulator',
  description: 'Simulate coin flips and visualize probability distribution',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set number of flips', text: 'Choose how many coin flips to simulate (1 to 10,000).' },
  { name: 'Click Calculate', text: 'Press the Calculate button to run the simulation.' },
  { name: 'View results', text: 'See the distribution of heads and tails with a visual chart.' },
  { name: 'Analyze the data', text: 'Compare your results to the expected 50/50 distribution.' },
];

const faqs = [
  {
    question: 'Is this a fair coin simulation?',
    answer: 'Yes, this simulator uses a fair coin with exactly 50% probability for heads and 50% for tails. Each flip is independent and random.',
  },
  {
    question: 'Why don\'t I always get exactly 50% heads?',
    answer: 'Random variation is normal. With small sample sizes, you\'ll often see deviations from 50%. As you increase the number of flips, the percentage tends to get closer to 50% - this is the Law of Large Numbers.',
  },
  {
    question: 'What is the Law of Large Numbers?',
    answer: 'The Law of Large Numbers states that as the number of trials increases, the average of the results will get closer to the expected value. For coin flips, this means more flips = closer to 50% heads.',
  },
  {
    question: 'Can I use this for making decisions?',
    answer: 'Yes! You can use a single flip to make random decisions. The simulator provides a truly random result based on cryptographic-quality randomness.',
  },
  {
    question: 'What is the probability of getting all heads?',
    answer: 'The probability of getting all heads in n flips is (1/2)^n. For example, 10 heads in a row has a probability of about 0.1% (1 in 1,024).',
  },
];

const relatedTools = [
  { href: '/calculators/stats/dice-probability-calculator', title: 'Dice Probability', description: 'Calculate dice roll probabilities.' },
  { href: '/calculators/stats/random-number-generator', title: 'Random Number Generator', description: 'Generate random numbers with distributions.' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standard Deviation', description: 'Calculate statistical measures.' },
];

export default function CoinFlipSimulatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="coin-flip-simulator"
          title="Coin Flip Simulator"
          description="Simulate coin flips and visualize the distribution of heads and tails. Perfect for learning about probability and the law of large numbers."
          colorClass="bg-yellow-100 text-yellow-600"
        />

        <section aria-label="Coin Flip Simulator">
          <CoinFlipSimulator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Probability Concepts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">🎲 Independent Events</h3>
              <p className="text-sm text-muted-foreground">
                Each coin flip is independent - previous results don&apos;t affect future flips. 
                Getting 5 heads in a row doesn&apos;t make tails more likely on the next flip.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">📊 Law of Large Numbers</h3>
              <p className="text-sm text-muted-foreground">
                As you flip more coins, the percentage of heads approaches 50%. 
                Try 10 flips vs 10,000 flips to see this in action!
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">🔔 Normal Distribution</h3>
              <p className="text-sm text-muted-foreground">
                With many flips, the number of heads follows a bell curve (normal distribution) 
                centered around 50% of the total flips.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-700 mb-2">⚖️ Expected Value</h3>
              <p className="text-sm text-muted-foreground">
                The expected number of heads is always n/2 where n is the number of flips. 
                For 100 flips, expect around 50 heads on average.
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
