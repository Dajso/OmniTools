import { Metadata } from 'next';
import { SampleSizeCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sample Size Calculator - Survey Planning Tool',
  description: 'Calculate the required sample size for surveys and statistical studies. Determine how many responses you need for reliable results.',
  keywords: ['sample size calculator', 'survey sample size', 'statistical sample', 'margin of error', 'confidence level'],
  alternates: { canonical: '/calculators/stats/sample-size-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sample Size Calculator',
  description: 'Calculate required sample size for surveys and statistical studies',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select confidence level', text: 'Choose your desired confidence level (90%, 95%, or 99%).' },
  { name: 'Set margin of error', text: 'Select the acceptable margin of error for your survey results.' },
  { name: 'Enter expected proportion', text: 'Estimate the expected response proportion (use 50% if unknown).' },
  { name: 'Add population size', text: 'Optionally enter your total population size for finite population correction.' },
  { name: 'View results', text: 'See the required sample size for your survey.' },
];

const faqs = [
  {
    question: 'What is sample size?',
    answer: 'Sample size is the number of observations or responses needed in a survey or study to achieve statistically reliable results. A larger sample size generally provides more accurate estimates.',
  },
  {
    question: 'What is margin of error?',
    answer: 'Margin of error indicates the range within which the true population value is likely to fall. A ±5% margin of error means your results could be 5 percentage points higher or lower than the true value.',
  },
  {
    question: 'What confidence level should I use?',
    answer: '95% is the most commonly used confidence level in research. Use 99% for critical decisions requiring higher certainty, or 90% when resources are limited and some uncertainty is acceptable.',
  },
  {
    question: 'Why does population size matter?',
    answer: 'For small populations, you can survey a smaller percentage and still get reliable results. The finite population correction reduces the required sample size when your population is known and limited.',
  },
  {
    question: 'What if I don\'t know the expected proportion?',
    answer: 'Use 50% as the expected proportion. This gives the maximum (most conservative) sample size, ensuring your results will be reliable regardless of the actual proportion.',
  },
];

const relatedTools = [
  { href: '/calculators/stats/p-value-calculator', title: 'P-Value Calculator', description: 'Calculate p-values for hypothesis testing.' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B Test Calculator', description: 'Analyze A/B test results for significance.' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standard Deviation', description: 'Calculate standard deviation and variance.' },
];

export default function SampleSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sample-size-calculator"
          title="Sample Size Calculator"
          description="Calculate the required sample size for surveys and statistical studies. Determine how many responses you need for statistically reliable results."
          colorClass="bg-purple-100 text-purple-600"
          category="Statistics"
        />

        <section aria-label="Sample Size Calculator">
          <SampleSizeCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Sample Size Guidelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Population Size</th>
                  <th className="text-center py-2 px-3">±3% Error</th>
                  <th className="text-center py-2 px-3">±5% Error</th>
                  <th className="text-center py-2 px-3">±10% Error</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3">100</td>
                  <td className="text-center py-2 px-3">92</td>
                  <td className="text-center py-2 px-3">80</td>
                  <td className="text-center py-2 px-3">49</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">500</td>
                  <td className="text-center py-2 px-3">341</td>
                  <td className="text-center py-2 px-3">217</td>
                  <td className="text-center py-2 px-3">81</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">1,000</td>
                  <td className="text-center py-2 px-3">516</td>
                  <td className="text-center py-2 px-3">278</td>
                  <td className="text-center py-2 px-3">88</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">10,000</td>
                  <td className="text-center py-2 px-3">964</td>
                  <td className="text-center py-2 px-3">370</td>
                  <td className="text-center py-2 px-3">95</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">100,000+</td>
                  <td className="text-center py-2 px-3">1,067</td>
                  <td className="text-center py-2 px-3">383</td>
                  <td className="text-center py-2 px-3">96</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              * Based on 95% confidence level and 50% expected proportion
            </p>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
