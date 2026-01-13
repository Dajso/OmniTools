import { Metadata } from 'next';
import { PaceCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pace Calculator - Running Pace Calculator',
  description: 'Calculate your running or walking pace, time, or distance. Free pace calculator with split times in min/mile and min/km.',
  keywords: ['pace calculator', 'running pace calculator', 'running time calculator', 'marathon pace calculator', 'speed calculator', 'split time calculator'],
  alternates: { canonical: '/calculators/health/pace-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pace Calculator',
  description: 'Calculate running or walking pace, time, or distance',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose what to calculate', text: 'Select whether you want to calculate pace, time, or distance.' },
  { name: 'Enter known values', text: 'Input the values you know (distance and time for pace, etc.).' },
  { name: 'Select units', text: 'Choose miles, kilometers, or meters for distance.' },
  { name: 'View results', text: 'See your pace in min/mile and min/km, plus split times.' },
];

const faqs = [
  { question: 'What is a good running pace?', answer: 'Pace varies by fitness level. Beginners often run 10-12 min/mile, recreational runners 8-10 min/mile, and competitive runners under 7 min/mile. Focus on your own progress.' },
  { question: 'How do I calculate marathon pace?', answer: 'Enter 26.2 miles (or 42.195 km) as distance and your target finish time. The calculator will show your required pace per mile/km.' },
  { question: 'What are negative splits?', answer: 'Negative splits mean running the second half faster than the first. Many coaches recommend this strategy for races to avoid early fatigue.' },
];

export default function PaceCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pace-calculator"
          title="Pace Calculator"
          description="Calculate your running or walking pace, time, or distance. Get split times and speed in multiple units."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Pace Calculator"><PaceCalculator /></section>
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
