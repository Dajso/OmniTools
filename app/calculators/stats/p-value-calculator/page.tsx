import { Metadata } from 'next';
import { PValueCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'P-Value Calculator - Z-Test, T-Test, Chi-Square',
  description: 'Calculate p-values for hypothesis testing. Supports Z-test, T-test, and Chi-square test with one-tailed and two-tailed options.',
  keywords: ['p-value calculator', 'hypothesis testing', 'z-test', 't-test', 'chi-square test', 'statistical significance'],
  alternates: { canonical: '/calculators/stats/p-value-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'P-Value Calculator',
  description: 'Calculate p-values for hypothesis testing using Z-test, T-test, or Chi-square test',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select test type', text: 'Choose the statistical test you want to use (Z-test, T-test, or Chi-square).' },
  { name: 'Choose tail type', text: 'Select one-tailed (left or right) or two-tailed test based on your hypothesis.' },
  { name: 'Enter test statistic', text: 'Input your calculated test statistic (z-score, t-statistic, or chi-square value).' },
  { name: 'Enter degrees of freedom', text: 'For T-test and Chi-square, enter the degrees of freedom.' },
  { name: 'View results', text: 'See the p-value and interpretation of statistical significance.' },
];

const faqs = [
  {
    question: 'What is a p-value?',
    answer: 'A p-value is the probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true. It helps determine whether to reject the null hypothesis.',
  },
  {
    question: 'What does statistical significance mean?',
    answer: 'Statistical significance (typically p < 0.05) indicates that the observed results are unlikely to have occurred by chance alone. It suggests there may be a real effect or relationship.',
  },
  {
    question: 'When should I use a one-tailed vs two-tailed test?',
    answer: 'Use a one-tailed test when you have a specific directional hypothesis (e.g., "A is greater than B"). Use a two-tailed test when you want to detect any difference regardless of direction.',
  },
  {
    question: 'What is the difference between Z-test and T-test?',
    answer: 'Z-test is used when the population standard deviation is known or sample size is large (n > 30). T-test is used when the population standard deviation is unknown and sample size is small.',
  },
  {
    question: 'What are degrees of freedom?',
    answer: 'Degrees of freedom represent the number of independent values that can vary in a statistical calculation. For a T-test with one sample, df = n - 1 where n is the sample size.',
  },
];

const relatedTools = [
  { href: '/calculators/stats/sample-size-calculator', title: 'Sample Size Calculator', description: 'Calculate required sample size for surveys.' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B Test Calculator', description: 'Analyze A/B test results for significance.' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standard Deviation', description: 'Calculate standard deviation and variance.' },
];

export default function PValueCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="p-value-calculator"
          title="P-Value Calculator"
          description="Calculate p-values for hypothesis testing. Supports Z-test, T-test, and Chi-square test with interpretation of statistical significance."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="P-Value Calculator">
          <PValueCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding P-Values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">p &lt; 0.05</h3>
              <p className="text-sm text-muted-foreground">
                Statistically significant. Strong evidence against the null hypothesis. 
                The result is unlikely to have occurred by chance.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-700 mb-2">p ≥ 0.05</h3>
              <p className="text-sm text-muted-foreground">
                Not statistically significant. Insufficient evidence to reject the null hypothesis. 
                The result could reasonably have occurred by chance.
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
