import { Metadata } from 'next';
import { RingSizeConverter } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ring Size Converter - International Ring Size Chart',
  description: 'Convert ring sizes between US, UK, EU, and Japanese systems. Free ring size converter with diameter and circumference measurements.',
  keywords: ['ring size converter', 'ring size chart', 'ring size calculator', 'US to UK ring size', 'EU ring size', 'ring measurement'],
  alternates: { canonical: '/calculators/health/ring-size-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ring Size Converter',
  description: 'Convert ring sizes between international systems',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select your size system', text: 'Choose US/Canada, UK/Australia, Europe, or Japan.' },
  { name: 'Enter your ring size', text: 'Input your known ring size in the selected system.' },
  { name: 'View conversions', text: 'See your ring size in all international systems plus diameter and circumference.' },
];

const faqs = [
  { question: 'How do I measure my ring size?', answer: 'Wrap a string around your finger at the base, mark where it meets, and measure the length in mm (circumference). Or measure the inner diameter of a ring that fits well.' },
  { question: 'What if I\'m between sizes?', answer: 'If between sizes, choose the larger size. Fingers swell throughout the day and in warm weather, so a slightly larger ring is usually more comfortable.' },
  { question: 'Do ring sizes differ by country?', answer: 'Yes, each country uses different sizing systems. US uses numbers (3-13), UK uses letters (A-Z), EU uses circumference in mm (40-70), and Japan uses numbers (1-27).' },
];

export default function RingSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ring-size-converter"
          title="Ring Size Converter"
          description="Convert ring sizes between US, UK, EU, and Japanese sizing systems. Get diameter and circumference measurements."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Ring Size Converter"><RingSizeConverter /></section>
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
