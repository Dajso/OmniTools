import { Metadata } from 'next';
import { MacroCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Macro Calculator - Free Macronutrient Calculator',
  description: 'Calculate your daily macro nutrient targets (protein, carbs, fat) based on your goals. Free macro calculator for weight loss, muscle gain, keto, and more.',
  keywords: ['macro calculator', 'macronutrient calculator', 'protein calculator', 'carb calculator', 'fat calculator', 'diet calculator', 'keto macros'],
  alternates: { canonical: '/calculators/health/macro-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Macro Calculator',
  description: 'Calculate your daily macro nutrient targets based on your goals',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your daily calories', text: 'Input your target daily calorie intake (use a TDEE calculator if unsure).' },
  { name: 'Select your goal', text: 'Choose from weight loss, maintenance, muscle gain, keto, or low carb.' },
  { name: 'Enter your weight', text: 'Input your body weight for fiber recommendations.' },
  { name: 'View your macros', text: 'See your personalized protein, carb, and fat targets in grams.' },
];

const faqs = [
  { question: 'What are macros?', answer: 'Macros (macronutrients) are the three main nutrients your body needs in large amounts: protein, carbohydrates, and fat. Each provides calories and serves different functions in your body.' },
  { question: 'How do I know my daily calories?', answer: 'Use a TDEE (Total Daily Energy Expenditure) calculator to estimate your maintenance calories, then adjust based on your goals: subtract 500 for weight loss or add 300-500 for muscle gain.' },
  { question: 'What macro ratio is best for weight loss?', answer: 'A higher protein ratio (30-40%) helps preserve muscle during weight loss. Our weight loss preset uses 40% protein, 30% carbs, and 30% fat.' },
];

export default function MacroCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="macro-calculator"
          title="Macro Calculator"
          description="Calculate your daily macronutrient targets based on your fitness goals. Get personalized protein, carb, and fat recommendations."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Macro Calculator"><MacroCalculator /></section>
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
