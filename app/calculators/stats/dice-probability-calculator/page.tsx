import { Metadata } from 'next';
import { DiceProbabilityCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dice Probability Calculator - Roll Odds & Distribution',
  description: 'Calculate the probability of rolling specific sums with multiple dice. Visualize dice roll distributions for D4, D6, D8, D10, D12, D20, and D100.',
  keywords: ['dice probability', 'dice calculator', 'roll probability', 'd20', 'd6', 'dice odds', 'RPG dice'],
  alternates: { canonical: '/calculators/stats/dice-probability-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dice Probability Calculator',
  description: 'Calculate dice roll probabilities and visualize distributions',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select dice', text: 'Choose the number of dice and type (d4, d6, d8, d10, d12, d20, or d100).' },
  { name: 'Set comparison', text: 'Choose whether you want exactly, at least, or at most the target sum.' },
  { name: 'Enter target', text: 'Input the target sum you want to calculate probability for.' },
  { name: 'View results', text: 'See the probability, odds, and distribution chart.' },
];

const faqs = [
  {
    question: 'What is the most likely roll with 2d6?',
    answer: 'With 2d6 (two six-sided dice), the most likely sum is 7, which has a probability of about 16.67% (1 in 6). This is because there are 6 ways to roll a 7 out of 36 total combinations.',
  },
  {
    question: 'How do I calculate dice probability?',
    answer: 'Dice probability is calculated by dividing the number of favorable outcomes by the total number of possible outcomes. For n dice with s sides, total outcomes = s^n.',
  },
  {
    question: 'What does "at least" mean for dice rolls?',
    answer: '"At least" means the target sum or higher. For example, "at least 10" on 2d6 includes rolling 10, 11, or 12.',
  },
  {
    question: 'Why is the distribution bell-shaped?',
    answer: 'When rolling multiple dice, middle values have more combinations that produce them than extreme values. This creates a bell curve (normal distribution) centered around the mean.',
  },
  {
    question: 'What is the probability of rolling a natural 20?',
    answer: 'On a single d20, the probability of rolling any specific number (including 20) is 1/20 = 5%. This is the famous "critical hit" probability in many RPGs.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll virtual dice with animations.' },
  { href: '/calculators/stats/coin-flip-simulator', title: 'Coin Flip Simulator', description: 'Simulate coin flips.' },
  { href: '/calculators/stats/random-number-generator', title: 'Random Number Generator', description: 'Generate random numbers.' },
];

export default function DiceProbabilityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dice-probability-calculator"
          title="Dice Probability Calculator"
          description="Calculate the probability of rolling specific sums with multiple dice. Perfect for RPG players, board gamers, and probability students."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="Dice Probability Calculator">
          <DiceProbabilityCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Common Dice Probabilities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Dice</th>
                  <th className="text-center py-2 px-3">Min</th>
                  <th className="text-center py-2 px-3">Max</th>
                  <th className="text-center py-2 px-3">Mean</th>
                  <th className="text-center py-2 px-3">Most Likely</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3">1d6</td>
                  <td className="text-center py-2 px-3">1</td>
                  <td className="text-center py-2 px-3">6</td>
                  <td className="text-center py-2 px-3">3.5</td>
                  <td className="text-center py-2 px-3">All equal (16.7%)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">2d6</td>
                  <td className="text-center py-2 px-3">2</td>
                  <td className="text-center py-2 px-3">12</td>
                  <td className="text-center py-2 px-3">7</td>
                  <td className="text-center py-2 px-3">7 (16.7%)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">3d6</td>
                  <td className="text-center py-2 px-3">3</td>
                  <td className="text-center py-2 px-3">18</td>
                  <td className="text-center py-2 px-3">10.5</td>
                  <td className="text-center py-2 px-3">10, 11 (12.5%)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">1d20</td>
                  <td className="text-center py-2 px-3">1</td>
                  <td className="text-center py-2 px-3">20</td>
                  <td className="text-center py-2 px-3">10.5</td>
                  <td className="text-center py-2 px-3">All equal (5%)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">4d6 (drop lowest)</td>
                  <td className="text-center py-2 px-3">3</td>
                  <td className="text-center py-2 px-3">18</td>
                  <td className="text-center py-2 px-3">12.24</td>
                  <td className="text-center py-2 px-3">13 (13.3%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
