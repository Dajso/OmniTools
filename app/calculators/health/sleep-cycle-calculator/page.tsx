import { Metadata } from 'next';
import { SleepCycleCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sleep Cycle Calculator - Best Time to Sleep & Wake Up',
  description: 'Calculate the best times to sleep or wake up based on 90-minute sleep cycles. Free sleep calculator for better rest and energy.',
  keywords: ['sleep cycle calculator', 'sleep calculator', 'bedtime calculator', 'wake up time calculator', 'sleep schedule calculator', 'REM sleep calculator'],
  alternates: { canonical: '/calculators/health/sleep-cycle-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sleep Cycle Calculator',
  description: 'Find the best times to sleep or wake up based on sleep cycles',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose your mode', text: 'Select whether you need to wake up at a specific time or want to go to bed at a specific time.' },
  { name: 'Enter your time', text: 'Input your target wake-up time or bedtime.' },
  { name: 'Adjust fall asleep time', text: 'Enter how long it typically takes you to fall asleep (default 15 minutes).' },
  { name: 'View recommended times', text: 'See optimal sleep/wake times based on complete 90-minute cycles.' },
];

const faqs = [
  { question: 'What is a sleep cycle?', answer: 'A sleep cycle lasts about 90 minutes and includes light sleep, deep sleep, and REM sleep. Waking at the end of a cycle (rather than mid-cycle) helps you feel more refreshed.' },
  { question: 'How many sleep cycles do I need?', answer: 'Most adults need 4-6 complete cycles (6-9 hours) per night. 5-6 cycles is optimal for most people. Quality matters as much as quantity.' },
  { question: 'Why do I feel tired after 8 hours of sleep?', answer: 'You may be waking mid-cycle. Try adjusting your sleep time by 15-30 minutes to align with cycle completion. Sleep quality, consistency, and sleep disorders also affect how rested you feel.' },
];

export default function SleepCycleCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sleep-cycle-calculator"
          title="Sleep Cycle Calculator"
          description="Find the best times to sleep or wake up based on 90-minute sleep cycles. Wake up feeling refreshed by completing full cycles."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Sleep Cycle Calculator"><SleepCycleCalculator /></section>
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
