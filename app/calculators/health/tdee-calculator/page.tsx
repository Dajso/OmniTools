import { Metadata } from 'next';
import { TDEECalculator } from '@/components/calculators/health';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'TDEE Calculator - Total Daily Energy Expenditure Calculator',
  description: 'Calculate your Total Daily Energy Expenditure (TDEE) with our free calculator. Get your BMR, daily calorie needs, and macro breakdown.',
  keywords: ['TDEE calculator', 'total daily energy expenditure', 'BMR calculator', 'calorie calculator'],
  alternates: { canonical: '/calculators/health/tdee-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TDEE Calculator',
  description: 'Calculate your Total Daily Energy Expenditure to understand your daily calorie needs',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your age', text: 'Input your current age in years.' },
  { name: 'Select biological sex', text: 'Choose male or female for accurate BMR calculation.' },
  { name: 'Enter weight and height', text: 'Input your measurements in Imperial or Metric units.' },
  { name: 'Select activity level', text: 'Choose the level that best describes your typical week.' },
  { name: 'Review results', text: 'See your BMR, TDEE, and recommended macros.' },
];

const faqs = [
  { question: 'What is TDEE?', answer: 'TDEE (Total Daily Energy Expenditure) is the total calories you burn daily, including BMR plus activity. It helps set calorie goals for weight management.' },
  { question: 'What is BMR vs TDEE?', answer: 'BMR is calories burned at rest for basic functions. TDEE includes BMR plus activity calories. TDEE is always higher than BMR.' },
  { question: 'How accurate is this calculation?', answer: 'We use the Mifflin-St Jeor equation, one of the most accurate formulas. Individual metabolism can vary 10-15%, so adjust based on results.' },
  { question: 'How many calories to lose weight?', answer: 'Aim for 500 calories below TDEE for ~1 lb/week loss. Never go below 1,200 (women) or 1,500 (men) without medical supervision.' },
];

const relatedTools = [
  { href: '/calculators/health/bmi-calculator', title: 'BMI Calculator', description: 'Calculate your Body Mass Index.' },
  { href: '/calculators/health/macro-calculator', title: 'Macro Calculator', description: 'Get detailed macro recommendations.' },
];

const activityLevels = [
  { level: 'Sedentary', description: 'Little or no exercise, desk job', multiplier: '1.2' },
  { level: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: '1.375' },
  { level: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', multiplier: '1.55' },
  { level: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: '1.725' },
  { level: 'Extra Active', description: 'Very hard exercise, physical job', multiplier: '1.9' },
];

export default function TDEECalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tdee-calculator"
          title="TDEE Calculator"
          description="Calculate your Total Daily Energy Expenditure to understand your daily calorie needs. Get personalized goals for weight loss, maintenance, or muscle gain."
          colorClass="bg-red-100 text-red-600"
          category="Health"
        />

        <section aria-label="TDEE Calculator">
          <TDEECalculator />
        </section>

        {/* Activity Level Guide */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Activity Level Guide</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Level</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-left py-3 px-4 font-medium">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLevels.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.level}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{item.description}</td>
                        <td className="py-3 px-4 font-mono text-sm">BMR × {item.multiplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
