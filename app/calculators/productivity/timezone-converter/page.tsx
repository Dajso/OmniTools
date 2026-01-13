import { Metadata } from 'next';
import { TimezoneConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Time Zone Converter - World Time Converter',
  description: 'Convert times between different time zones. Supports all major world time zones.',
  keywords: ['timezone converter', 'time zone calculator', 'world clock', 'time difference'],
  alternates: { canonical: '/calculators/productivity/timezone-converter' },
};

const faqs = [
  { question: 'What is UTC?', answer: 'UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks.' },
  { question: 'What is DST?', answer: 'Daylight Saving Time is the practice of advancing clocks during warmer months to extend evening daylight.' },
];

export default function TimezoneConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="timezone-converter"
          title="Time Zone Converter"
          description="Convert times between different time zones around the world."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Time Zone Converter"><TimezoneConverter /></section>
      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
        <div className="space-y-6">{faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6 last:border-b-0">
            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}</div>
      </section>
    </main>
  );
}
