import { Metadata } from 'next';
import { ABTestCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'A/B Test Significance Calculator - Statistical Analysis',
  description: 'Calculate statistical significance for A/B test results. Determine if your conversion rate improvements are real or due to chance.',
  keywords: ['A/B test calculator', 'statistical significance', 'conversion rate', 'split test', 'hypothesis testing', 'p-value'],
  alternates: { canonical: '/calculators/stats/ab-test-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'A/B Test Significance Calculator',
  description: 'Calculate statistical significance for A/B test results',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter control data', text: 'Input the number of visitors and conversions for your control group (A).' },
  { name: 'Enter treatment data', text: 'Input the number of visitors and conversions for your treatment group (B).' },
  { name: 'Calculate', text: 'Click Calculate to analyze statistical significance.' },
  { name: 'Interpret results', text: 'Review the p-value, confidence level, and lift to make decisions.' },
];

const faqs = [
  {
    question: 'What is statistical significance in A/B testing?',
    answer: 'Statistical significance indicates that the difference between your control and treatment groups is unlikely to be due to random chance. A p-value below 0.05 (95% confidence) is typically considered significant.',
  },
  {
    question: 'What is a good sample size for A/B tests?',
    answer: 'Sample size depends on your baseline conversion rate and the minimum effect you want to detect. Generally, you need thousands of visitors per variation. Use the sample size recommendation in the results for guidance.',
  },
  {
    question: 'What does relative lift mean?',
    answer: 'Relative lift is the percentage improvement of the treatment over the control. For example, if control converts at 5% and treatment at 6%, the relative lift is 20% ((6-5)/5 × 100).',
  },
  {
    question: 'Should I stop my test when it reaches significance?',
    answer: 'No! Stopping early can lead to false positives. Plan your sample size in advance and run the test until you reach it, regardless of interim results. This is called "peeking" and can invalidate your results.',
  },
  {
    question: 'What is the confidence interval?',
    answer: 'The confidence interval shows the range where the true difference likely falls. A 95% CI of [1%, 5%] means we\'re 95% confident the true lift is between 1% and 5%.',
  },
];

const relatedTools = [
  { href: '/calculators/stats/sample-size-calculator', title: 'Sample Size Calculator', description: 'Plan your test sample size.' },
  { href: '/calculators/stats/p-value-calculator', title: 'P-Value Calculator', description: 'Calculate p-values for other tests.' },
  { href: '/calculators/stats/correlation-calculator', title: 'Correlation Calculator', description: 'Analyze variable relationships.' },
];

export default function ABTestCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ab-test-calculator"
          title="A/B Test Significance Calculator"
          description="Determine if your A/B test results are statistically significant. Calculate p-values, confidence intervals, and conversion rate lift."
          colorClass="bg-green-100 text-green-600"
          category="Statistics"
        />

        <section aria-label="A/B Test Calculator">
          <ABTestCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">A/B Testing Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">✓ Do</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Calculate sample size before starting</li>
                <li>• Run tests for full business cycles</li>
                <li>• Test one variable at a time</li>
                <li>• Document your hypothesis</li>
                <li>• Consider practical significance</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-2">✗ Don&apos;t</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stop tests early when significant</li>
                <li>• Run multiple tests simultaneously</li>
                <li>• Ignore segment differences</li>
                <li>• Test during unusual periods</li>
                <li>• Make decisions on small samples</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Understanding Your Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">P-Value</th>
                  <th className="text-left py-2 px-3">Confidence</th>
                  <th className="text-left py-2 px-3">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3">&lt; 0.01</td>
                  <td className="py-2 px-3">&gt; 99%</td>
                  <td className="py-2 px-3 text-green-600">Very strong evidence</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">0.01 - 0.05</td>
                  <td className="py-2 px-3">95% - 99%</td>
                  <td className="py-2 px-3 text-green-600">Strong evidence</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">0.05 - 0.10</td>
                  <td className="py-2 px-3">90% - 95%</td>
                  <td className="py-2 px-3 text-yellow-600">Moderate evidence</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">&gt; 0.10</td>
                  <td className="py-2 px-3">&lt; 90%</td>
                  <td className="py-2 px-3 text-red-600">Weak/no evidence</td>
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
