import { Metadata } from 'next';
import { OvenTemperatureConverter } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Oven Temperature Converter - Fahrenheit to Celsius',
  description: 'Convert oven temperatures between Fahrenheit, Celsius, and Gas Mark. Free temperature converter with common cooking temperatures.',
  keywords: ['oven temperature converter', 'fahrenheit to celsius', 'celsius to fahrenheit', 'gas mark converter', 'cooking temperature', 'baking temperature'],
  alternates: { canonical: '/calculators/health/oven-temperature-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Oven Temperature Converter',
  description: 'Convert between Fahrenheit, Celsius, and Gas Mark',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select temperature unit', text: 'Choose Fahrenheit, Celsius, or Gas Mark.' },
  { name: 'Enter temperature', text: 'Input the temperature you want to convert.' },
  { name: 'View conversions', text: 'See the temperature in all units plus a description of the heat level.' },
  { name: 'Use quick reference', text: 'Click common temperatures to quickly convert them.' },
];

const faqs = [
  { question: 'What is Gas Mark?', answer: 'Gas Mark is a temperature scale used on gas ovens in the UK and some Commonwealth countries. Gas Mark 4 equals 350°F/175°C, a common baking temperature.' },
  { question: 'What temperature should I bake at?', answer: 'Common temperatures: 325-350°F (165-175°C) for cakes and cookies, 375-400°F (190-200°C) for bread and pastries, 400-450°F (200-230°C) for roasting vegetables and pizza.' },
  { question: 'How do I convert Fahrenheit to Celsius?', answer: 'The formula is: °C = (°F - 32) × 5/9. For quick estimates, subtract 30 and divide by 2. Our converter does this automatically.' },
];

export default function OvenTemperatureConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="oven-temperature-converter"
          title="Oven Temperature Converter"
          description="Convert oven temperatures between Fahrenheit, Celsius, and Gas Mark. Includes common cooking temperatures."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Oven Temperature Converter"><OvenTemperatureConverter /></section>
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
