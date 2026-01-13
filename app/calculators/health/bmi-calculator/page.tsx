import { Metadata } from 'next';
import { BMICalculator } from '@/components/calculators/health';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'BMI Calculator - Free Body Mass Index Calculator',
  description: 'Calculate your Body Mass Index (BMI) with our free calculator. Supports both Imperial (lbs/ft) and Metric (kg/cm) units.',
  keywords: ['BMI calculator', 'body mass index calculator', 'BMI chart', 'healthy weight calculator'],
  alternates: { canonical: '/calculators/health/bmi-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BMI Calculator',
  description: 'Calculate your Body Mass Index (BMI) to assess if your weight is healthy for your height',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select unit system', text: 'Choose between Imperial (lbs/ft) or Metric (kg/cm) units.' },
  { name: 'Enter your weight', text: 'Input your current weight in pounds or kilograms.' },
  { name: 'Enter your height', text: 'For Imperial, enter feet and inches. For Metric, enter centimeters.' },
  { name: 'View results', text: 'See your BMI value, category, and health recommendations.' },
];

const faqs = [
  { question: 'What is BMI and how is it calculated?', answer: 'BMI (Body Mass Index) measures body fat based on height and weight. Formula: BMI = weight(kg) / height(m)². It provides a simple screening tool for weight categories.' },
  { question: 'What are the BMI categories?', answer: 'Underweight: BMI < 18.5, Normal: 18.5-24.9, Overweight: 25-29.9, Obese: BMI ≥ 30. These help assess potential health risks.' },
  { question: 'Is BMI accurate for everyone?', answer: 'BMI may overestimate body fat in athletes and underestimate it in older adults. It doesn\'t account for muscle mass, bone density, or fat distribution.' },
  { question: 'What is a healthy BMI range?', answer: 'A healthy BMI is generally 18.5-24.9, associated with the lowest risk of weight-related health problems.' },
];

const relatedTools = [
  { href: '/calculators/health/tdee-calculator', title: 'TDEE Calculator', description: 'Calculate your Total Daily Energy Expenditure.' },
  { href: '/calculators/health/body-fat-calculator', title: 'Body Fat Calculator', description: 'Estimate your body fat percentage.' },
];

const bmiCategories = [
  { category: 'Underweight', range: 'Below 18.5', risk: 'Possible nutritional deficiency', color: 'bg-blue-100 text-blue-700' },
  { category: 'Normal', range: '18.5 - 24.9', risk: 'Low risk', color: 'bg-green-100 text-green-700' },
  { category: 'Overweight', range: '25 - 29.9', risk: 'Moderate risk', color: 'bg-yellow-100 text-yellow-700' },
  { category: 'Obese', range: '30 and above', risk: 'High risk', color: 'bg-red-100 text-red-700' },
];

export default function BMICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bmi-calculator"
          title="BMI Calculator"
          description="Calculate your Body Mass Index (BMI) to find out if your weight is healthy. Supports Imperial and Metric units."
          colorClass="bg-red-100 text-red-600"
          category="Health"
        />

        <section aria-label="BMI Calculator">
          <BMICalculator />
        </section>

        {/* BMI Chart */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">BMI Categories</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">BMI Range</th>
                      <th className="text-left py-3 px-4 font-medium">Health Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bmiCategories.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{item.range}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{item.risk}</td>
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
