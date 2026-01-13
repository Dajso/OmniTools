import { Metadata } from 'next';
import { BodyFatCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Body Fat Calculator - Navy Method Body Fat Percentage',
  description: 'Calculate your body fat percentage using the US Navy method. Free body fat calculator with measurements for men and women.',
  keywords: ['body fat calculator', 'body fat percentage calculator', 'navy body fat calculator', 'body composition calculator', 'fat percentage calculator'],
  alternates: { canonical: '/calculators/health/body-fat-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Body Fat Calculator',
  description: 'Estimate your body fat percentage using the US Navy method',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select biological sex', text: 'Choose male or female (different formulas and measurements required).' },
  { name: 'Enter your height', text: 'Input your height in inches or centimeters.' },
  { name: 'Measure and enter waist', text: 'Measure at navel level for men, narrowest point for women.' },
  { name: 'Measure and enter neck', text: 'Measure around the narrowest part of your neck.' },
  { name: 'For women: measure hips', text: 'Measure at the widest point of your hips.' },
  { name: 'View your results', text: 'See your body fat percentage and fitness category.' },
];

const faqs = [
  { question: 'How accurate is the Navy method?', answer: 'The Navy method is reasonably accurate (within 3-4% of more precise methods like DEXA) and is used by the US military. It\'s more accurate than BMI for assessing body composition.' },
  { question: 'What is a healthy body fat percentage?', answer: 'For men: 10-20% is fitness range, 18-25% is average. For women: 18-28% is fitness range, 25-32% is average. Athletes may be lower, but essential fat (2-5% men, 10-13% women) is necessary for health.' },
  { question: 'How do I measure correctly?', answer: 'Use a flexible tape measure. Keep it level and snug but not tight. Measure in the morning before eating. Take multiple measurements and average them for accuracy.' },
];

export default function BodyFatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="body-fat-calculator"
          title="Body Fat Calculator"
          description="Estimate your body fat percentage using the US Navy method. More accurate than BMI for assessing body composition."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Body Fat Calculator"><BodyFatCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
          <ol className="space-y-4">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span>
                <div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
