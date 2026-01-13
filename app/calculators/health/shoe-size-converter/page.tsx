import { Metadata } from 'next';
import { ShoeSizeConverter } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Shoe Size Converter - US UK EU Size Chart',
  description: 'Convert shoe sizes between US, UK, EU, and centimeters. Free shoe size converter for men\'s and women\'s sizes.',
  keywords: ['shoe size converter', 'shoe size chart', 'US to UK shoe size', 'EU shoe size', 'shoe size calculator', 'foot size converter'],
  alternates: { canonical: '/calculators/health/shoe-size-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Shoe Size Converter',
  description: 'Convert shoe sizes between international systems',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select your size system', text: 'Choose US Men\'s, US Women\'s, UK, EU, or foot length in cm.' },
  { name: 'Enter your shoe size', text: 'Input your known shoe size in the selected system.' },
  { name: 'View conversions', text: 'See your shoe size in all systems plus foot length in centimeters.' },
];

const faqs = [
  { question: 'What\'s the difference between US Men\'s and Women\'s sizes?', answer: 'US Women\'s sizes are typically 1.5 sizes larger than Men\'s. For example, a Men\'s 8 equals a Women\'s 9.5.' },
  { question: 'How do I measure my foot?', answer: 'Stand on paper, trace your foot, and measure from heel to longest toe. Measure in the afternoon when feet are largest. Add about 1cm for toe room.' },
  { question: 'Why do shoe sizes vary by brand?', answer: 'Sizing isn\'t standardized. Use this converter as a guide, but always try shoes on when possible. Width also varies - some brands run narrow or wide.' },
];

export default function ShoeSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="shoe-size-converter"
          title="Shoe Size Converter"
          description="Convert shoe sizes between US, UK, EU, and centimeters. Works for both men's and women's sizes."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Shoe Size Converter"><ShoeSizeConverter /></section>
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
