import { Metadata } from 'next';
import { StandardDeviationCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Standard Deviation Calculator - Variance, Mean, Median',
  description: 'Calculate standard deviation, variance, mean, median, mode, and other descriptive statistics from your dataset.',
  keywords: ['standard deviation calculator', 'variance calculator', 'mean calculator', 'median', 'mode', 'statistics'],
  alternates: { canonical: '/calculators/stats/standard-deviation-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Standard Deviation Calculator',
  description: 'Calculate standard deviation, variance, and other descriptive statistics',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your data', text: 'Input your numbers separated by commas, spaces, or new lines.' },
  { name: 'Calculate', text: 'Click Calculate to compute all statistics.' },
  { name: 'View results', text: 'See standard deviation, variance, mean, median, mode, and more.' },
  { name: 'Choose the right measure', text: 'Use sample statistics for samples, population statistics for complete datasets.' },
];

const faqs = [
  {
    question: 'What is standard deviation?',
    answer: 'Standard deviation measures how spread out numbers are from the mean (average). A low standard deviation means data points are close to the mean, while a high standard deviation means they are spread out.',
  },
  {
    question: 'What is the difference between sample and population standard deviation?',
    answer: 'Sample standard deviation (s) uses n-1 in the denominator (Bessel\'s correction) and is used when your data is a sample from a larger population. Population standard deviation (σ) uses n and is used when you have data for the entire population.',
  },
  {
    question: 'What is variance?',
    answer: 'Variance is the square of the standard deviation. It measures the average squared deviation from the mean. Standard deviation is often preferred because it\'s in the same units as the original data.',
  },
  {
    question: 'What is the difference between mean, median, and mode?',
    answer: 'Mean is the arithmetic average. Median is the middle value when data is sorted. Mode is the most frequently occurring value. Each measures central tendency differently and is useful in different situations.',
  },
  {
    question: 'When should I use median instead of mean?',
    answer: 'Use median when your data has outliers or is skewed. The median is more robust to extreme values. For example, median income is often more representative than mean income because a few very high incomes can skew the mean.',
  },
];

const relatedTools = [
  { href: '/calculators/stats/p-value-calculator', title: 'P-Value Calculator', description: 'Calculate p-values for hypothesis testing.' },
  { href: '/calculators/stats/sample-size-calculator', title: 'Sample Size Calculator', description: 'Determine required sample size.' },
  { href: '/calculators/stats/correlation-calculator', title: 'Correlation Calculator', description: 'Calculate correlation coefficient.' },
];

export default function StandardDeviationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="standard-deviation-calculator"
          title="Standard Deviation Calculator"
          description="Calculate standard deviation, variance, mean, median, mode, and other descriptive statistics from your dataset."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Standard Deviation Calculator">
          <StandardDeviationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Standard Deviation</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">Low Standard Deviation</h3>
              <p className="text-sm text-muted-foreground">
                Data points are clustered close to the mean. The values are consistent and predictable.
              </p>
              <p className="text-xs text-blue-600 mt-2">Example: Test scores of 88, 90, 91, 89, 92</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-700 mb-2">Medium Standard Deviation</h3>
              <p className="text-sm text-muted-foreground">
                Data points show moderate spread around the mean. Some variation is present.
              </p>
              <p className="text-xs text-yellow-600 mt-2">Example: Test scores of 75, 85, 90, 95, 80</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-2">High Standard Deviation</h3>
              <p className="text-sm text-muted-foreground">
                Data points are spread far from the mean. High variability in the dataset.
              </p>
              <p className="text-xs text-red-600 mt-2">Example: Test scores of 50, 70, 90, 100, 65</p>
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
