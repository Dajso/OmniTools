import { Metadata } from 'next';
import { TimestampConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Timestamp Converter - Unix Timestamp to Date',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Shows multiple formats.',
  keywords: ['timestamp converter', 'Unix timestamp', 'epoch converter', 'date converter'],
  alternates: { canonical: '/calculators/productivity/timestamp-converter' },
};

const faqs = [
  { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds since January 1, 1970 (UTC), also called the Unix epoch.' },
  { question: 'Seconds vs milliseconds?', answer: 'Unix timestamps are typically in seconds, but JavaScript uses milliseconds. We detect and handle both.' },
];

export default function TimestampConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="timestamp-converter"
          title="Timestamp Converter"
          description="Convert Unix timestamps to dates and dates to timestamps."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Timestamp Converter"><TimestampConverter /></section>
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
