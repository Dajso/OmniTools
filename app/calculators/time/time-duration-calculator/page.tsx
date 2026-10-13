import { Metadata } from 'next';
import { TimeDurationCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Time Duration Calculator - Add & Subtract Time',
  description: 'Add or subtract time durations easily. Calculate the difference between two times or combine multiple time periods.',
  keywords: ['time duration calculator', 'add time', 'subtract time', 'time calculator', 'duration calculator'],
  alternates: { canonical: '/calculators/time/time-duration-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Time Duration Calculator',
  description: 'Add or subtract time durations, calculate time between two times',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select mode', text: 'Choose to add durations, subtract durations, or calculate time between two times.' },
  { name: 'Enter first duration', text: 'Input the first time duration in days, hours, minutes, and seconds.' },
  { name: 'Enter second duration', text: 'Input the second time duration or end time.' },
  { name: 'View results', text: 'See the calculated result in multiple formats.' },
];

const faqs = [
  {
    question: 'How do I add time durations?',
    answer: 'Select "Add durations" mode, enter the first duration (e.g., 2 hours 30 minutes), then enter the second duration (e.g., 1 hour 45 minutes). The calculator will show the total (4 hours 15 minutes).',
  },
  {
    question: 'Can I calculate work hours?',
    answer: 'Yes! Use the "Time between two times" mode to calculate hours worked. Enter your start time (e.g., 9:00 AM) and end time (e.g., 5:30 PM) to get the duration.',
  },
  {
    question: 'What if the result is negative?',
    answer: 'When subtracting, if the second duration is larger than the first, the result will be negative. This is shown with a minus sign in the result.',
  },
  {
    question: 'How are the totals calculated?',
    answer: 'The calculator converts all time units to seconds, performs the calculation, then converts back. Total hours, minutes, and days are shown as decimal values for precision.',
  },
];

const relatedTools = [
  { href: '/calculators/time/business-days-calculator', title: 'Business Days Calculator', description: 'Calculate business days between dates.' },
  { href: '/calculators/productivity/date-difference', title: 'Date Difference', description: 'Calculate the difference between two dates.' },
  { href: '/calculators/time/precise-age-calculator', title: 'Precise Age Calculator', description: 'Calculate exact age in multiple units.' },
];

export default function TimeDurationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="time-duration-calculator"
          title="Time Duration Calculator"
          description="Add or subtract time durations, or calculate the time between two times. Perfect for tracking work hours, project time, or any time-based calculations."
          colorClass="bg-blue-100 text-blue-600"
        />

        <section aria-label="Time Duration Calculator">
          <TimeDurationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Time Conversion Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Unit</th>
                  <th className="text-right py-2 px-3">Seconds</th>
                  <th className="text-right py-2 px-3">Minutes</th>
                  <th className="text-right py-2 px-3">Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">1 Minute</td><td className="text-right py-2 px-3">60</td><td className="text-right py-2 px-3">1</td><td className="text-right py-2 px-3">0.0167</td></tr>
                <tr className="border-b"><td className="py-2 px-3">1 Hour</td><td className="text-right py-2 px-3">3,600</td><td className="text-right py-2 px-3">60</td><td className="text-right py-2 px-3">1</td></tr>
                <tr className="border-b"><td className="py-2 px-3">1 Day</td><td className="text-right py-2 px-3">86,400</td><td className="text-right py-2 px-3">1,440</td><td className="text-right py-2 px-3">24</td></tr>
                <tr className="border-b"><td className="py-2 px-3">1 Week</td><td className="text-right py-2 px-3">604,800</td><td className="text-right py-2 px-3">10,080</td><td className="text-right py-2 px-3">168</td></tr>
                <tr><td className="py-2 px-3">1 Year (365 days)</td><td className="text-right py-2 px-3">31,536,000</td><td className="text-right py-2 px-3">525,600</td><td className="text-right py-2 px-3">8,760</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
