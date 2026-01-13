import { Metadata } from 'next';
import { CookingConverter } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Cooking Unit Converter - Cups to Grams Calculator',
  description: 'Convert cooking measurements between cups, tablespoons, teaspoons, grams, ounces, and milliliters. Free cooking converter with ingredient support.',
  keywords: ['cooking converter', 'cups to grams', 'tablespoon to ml', 'cooking measurement converter', 'recipe converter', 'baking converter'],
  alternates: { canonical: '/calculators/health/cooking-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cooking Unit Converter',
  description: 'Convert between cooking measurements',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter the amount', text: 'Input the quantity you want to convert.' },
  { name: 'Select units', text: 'Choose your source and target units (cups, tbsp, tsp, ml, grams, oz, etc.).' },
  { name: 'Select ingredient (if needed)', text: 'For volume-to-weight conversions, select the ingredient for accurate results.' },
  { name: 'View conversion', text: 'See your converted measurement instantly.' },
];

const faqs = [
  { question: 'Why do I need to select an ingredient?', answer: 'Different ingredients have different densities. A cup of flour weighs less than a cup of sugar. Selecting the ingredient ensures accurate volume-to-weight conversions.' },
  { question: 'What\'s the difference between fluid oz and weight oz?', answer: 'Fluid ounces measure volume (like water), while ounces measure weight. They\'re only equal for water. Our converter handles both correctly.' },
  { question: 'How many tablespoons in a cup?', answer: 'There are 16 tablespoons in 1 cup, 48 teaspoons in 1 cup, and 3 teaspoons in 1 tablespoon.' },
];

export default function CookingConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cooking-unit-converter"
          title="Cooking Unit Converter"
          description="Convert between cooking measurements like cups, tablespoons, grams, and more. Perfect for scaling recipes."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Cooking Converter"><CookingConverter /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Converter</h2>
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
