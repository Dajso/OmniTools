import { Metadata } from 'next';
import { WaterIntakeCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Water Intake Calculator - Daily Hydration Calculator',
  description: 'Calculate your recommended daily water intake based on body weight and activity level. Free hydration calculator with personalized recommendations.',
  keywords: ['water intake calculator', 'hydration calculator', 'daily water calculator', 'how much water to drink', 'water consumption calculator'],
  alternates: { canonical: '/calculators/health/water-intake-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Water Intake Calculator',
  description: 'Calculate your recommended daily water intake',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your weight', text: 'Input your body weight in pounds or kilograms.' },
  { name: 'Select activity level', text: 'Choose your typical daily activity level from sedentary to very active.' },
  { name: 'Select climate', text: 'Choose normal or hot climate (hot climates require more water).' },
  { name: 'View recommendations', text: 'See your daily water intake in liters, ounces, and glasses.' },
];

const faqs = [
  { question: 'How much water should I drink daily?', answer: 'A general guideline is about 30-35ml per kg of body weight, adjusted for activity and climate. Our calculator provides personalized recommendations based on your specific factors.' },
  { question: 'Does coffee count toward water intake?', answer: 'While coffee and tea do contribute to hydration, they have mild diuretic effects. It\'s best to count them as partial hydration and prioritize plain water.' },
  { question: 'What are signs of dehydration?', answer: 'Common signs include dark urine, thirst, dry mouth, fatigue, headache, and dizziness. Aim for pale yellow urine as an indicator of good hydration.' },
];

export default function WaterIntakeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="water-intake-calculator"
          title="Water Intake Calculator"
          description="Calculate your recommended daily water intake based on your weight, activity level, and climate."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Water Intake Calculator"><WaterIntakeCalculator /></section>
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
