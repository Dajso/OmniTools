import { Metadata } from 'next';
import { IntermittentFastingCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Intermittent Fasting Timer - Free IF Calculator',
  description: 'Track your intermittent fasting window with our free timer. Supports 16:8, 18:6, 20:4, and custom fasting protocols. See fasting phases and progress.',
  keywords: ['intermittent fasting timer', 'IF calculator', '16:8 fasting', '18:6 fasting', 'fasting tracker', 'fasting window calculator'],
  alternates: { canonical: '/calculators/health/intermittent-fasting-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Intermittent Fasting Timer',
  description: 'Track your fasting window and see when you can eat',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose your protocol', text: 'Select from popular fasting protocols like 16:8, 18:6, 20:4, or set a custom duration.' },
  { name: 'Set your start time', text: 'Enter the time of your last meal to begin tracking your fast.' },
  { name: 'Track your progress', text: 'Watch your fasting progress and see which metabolic phases you\'ve reached.' },
  { name: 'Know when to eat', text: 'See exactly when your eating window opens and closes.' },
];

const faqs = [
  { question: 'What is 16:8 intermittent fasting?', answer: 'The 16:8 method involves fasting for 16 hours and eating within an 8-hour window. For example, eating between 12pm-8pm and fasting from 8pm-12pm the next day.' },
  { question: 'What happens during fasting?', answer: 'During fasting, your body depletes glycogen stores (4-8 hours), begins burning fat for fuel (12+ hours), and may enter ketosis (16+ hours). Autophagy (cellular cleanup) increases after 18-24 hours.' },
  { question: 'Can I drink water while fasting?', answer: 'Yes! Water, black coffee, and plain tea are generally allowed during fasting as they don\'t trigger an insulin response. Avoid anything with calories or sweeteners.' },
];

export default function IntermittentFastingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="intermittent-fasting-timer"
          title="Intermittent Fasting Timer"
          description="Track your fasting window with our free timer. Supports popular protocols like 16:8, 18:6, and 20:4 with real-time progress tracking."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Intermittent Fasting Timer"><IntermittentFastingCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Timer</h2>
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
