import { Metadata } from 'next';
import { OneRepMaxCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'One Rep Max Calculator - Free 1RM Calculator',
  description: 'Calculate your one rep max (1RM) for any lift using multiple formulas. Get training percentages and rep ranges for strength training.',
  keywords: ['one rep max calculator', '1RM calculator', 'max lift calculator', 'strength calculator', 'weightlifting calculator', 'bench press max'],
  alternates: { canonical: '/calculators/health/one-rep-max-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'One Rep Max Calculator',
  description: 'Estimate your one rep max for any lift',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select your unit', text: 'Choose between pounds (lbs) or kilograms (kg).' },
  { name: 'Enter the weight lifted', text: 'Input the weight you lifted for multiple reps.' },
  { name: 'Enter your reps', text: 'Input how many repetitions you completed (1-30 reps).' },
  { name: 'View your estimated 1RM', text: 'See your estimated one rep max using multiple formulas and training percentages.' },
];

const faqs = [
  { question: 'What is a one rep max (1RM)?', answer: 'Your one rep max is the maximum weight you can lift for a single repetition with proper form. It\'s used to measure strength and calculate training weights.' },
  { question: 'How accurate are 1RM calculators?', answer: 'Calculators are most accurate with 1-10 reps. Higher rep ranges (10+) become less accurate. We use multiple formulas (Brzycki, Epley, Lander) and average them for better accuracy.' },
  { question: 'How do I use training percentages?', answer: 'Training percentages help program your workouts. For strength: 85-95% for 1-5 reps. For hypertrophy: 65-80% for 6-12 reps. For endurance: 50-65% for 15+ reps.' },
];

export default function OneRepMaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="one-rep-max-calculator"
          title="One Rep Max Calculator"
          description="Estimate your one rep max (1RM) for any lift. Uses multiple formulas for accuracy and provides training percentages."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="One Rep Max Calculator"><OneRepMaxCalculator /></section>
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
