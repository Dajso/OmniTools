import { Metadata } from 'next';
import { CorrelationCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Correlation Coefficient Calculator - Pearson R & Regression',
  description: 'Calculate Pearson correlation coefficient (r), R-squared, and linear regression. Visualize relationships with scatter plots.',
  keywords: ['correlation calculator', 'Pearson correlation', 'r-squared', 'linear regression', 'scatter plot', 'statistics'],
  alternates: { canonical: '/calculators/stats/correlation-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Correlation Coefficient Calculator',
  description: 'Calculate Pearson correlation coefficient and linear regression',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter data pairs', text: 'Input your X,Y data pairs, one pair per line.' },
  { name: 'Calculate', text: 'Click Calculate to compute correlation and regression.' },
  { name: 'View scatter plot', text: 'See your data visualized with the regression line.' },
  { name: 'Interpret results', text: 'Review correlation strength, significance, and R-squared.' },
];

const faqs = [
  {
    question: 'What is Pearson correlation coefficient?',
    answer: 'Pearson\'s r measures the strength and direction of the linear relationship between two variables. It ranges from -1 (perfect negative correlation) to +1 (perfect positive correlation), with 0 indicating no linear relationship.',
  },
  {
    question: 'What does R-squared (R²) mean?',
    answer: 'R-squared represents the proportion of variance in the dependent variable (Y) that is predictable from the independent variable (X). An R² of 0.80 means 80% of the variance in Y can be explained by X.',
  },
  {
    question: 'How do I interpret correlation strength?',
    answer: '|r| < 0.3 is weak, 0.3-0.5 is moderate, 0.5-0.7 is strong, and > 0.7 is very strong. The sign indicates direction: positive means both variables increase together, negative means one increases as the other decreases.',
  },
  {
    question: 'What is the regression equation used for?',
    answer: 'The regression equation (y = mx + b) allows you to predict Y values from X values. The slope (m) shows how much Y changes for each unit change in X, and the intercept (b) is the Y value when X is zero.',
  },
  {
    question: 'Does correlation imply causation?',
    answer: 'No! Correlation only shows that two variables are related, not that one causes the other. There could be confounding variables, reverse causation, or coincidental relationships.',
  },
];

const relatedTools = [
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standard Deviation', description: 'Calculate descriptive statistics.' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B Test Calculator', description: 'Analyze experiment results.' },
  { href: '/calculators/stats/p-value-calculator', title: 'P-Value Calculator', description: 'Calculate statistical significance.' },
];

export default function CorrelationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="correlation-calculator"
          title="Correlation Coefficient Calculator"
          description="Calculate Pearson correlation coefficient (r), R-squared, and linear regression. Visualize relationships with interactive scatter plots."
          colorClass="bg-purple-100 text-purple-600"
          category="Statistics"
        />

        <section aria-label="Correlation Calculator">
          <CorrelationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Correlation Strength Guide</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <p className="font-bold text-green-700">±0.9 to ±1.0</p>
              <p className="text-xs text-green-600">Very Strong</p>
            </div>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
              <p className="font-bold text-blue-700">±0.7 to ±0.9</p>
              <p className="text-xs text-blue-600">Strong</p>
            </div>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
              <p className="font-bold text-yellow-700">±0.5 to ±0.7</p>
              <p className="text-xs text-yellow-600">Moderate</p>
            </div>
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center">
              <p className="font-bold text-orange-700">±0.3 to ±0.5</p>
              <p className="text-xs text-orange-600">Weak</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
              <p className="font-bold text-gray-700">0 to ±0.3</p>
              <p className="text-xs text-gray-600">None/Negligible</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Correlation vs Causation</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Important:</strong> Correlation does not imply causation. Just because two variables 
              are correlated doesn&apos;t mean one causes the other. Always consider:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
              <li>Confounding variables that might affect both</li>
              <li>Reverse causation (Y might cause X)</li>
              <li>Coincidental relationships</li>
              <li>Selection bias in your data</li>
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
