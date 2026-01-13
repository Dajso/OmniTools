import { Metadata } from 'next';
import { OvulationCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ovulation Calculator - Free Fertility Calendar',
  description: 'Calculate your ovulation date and fertile window. Free ovulation calendar to help track your cycle and plan for pregnancy.',
  keywords: ['ovulation calculator', 'fertility calculator', 'ovulation calendar', 'fertile window calculator', 'conception calculator', 'period tracker'],
  alternates: { canonical: '/calculators/health/ovulation-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ovulation Calculator',
  description: 'Calculate your fertile window and ovulation date',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter last period date', text: 'Input the first day of your last menstrual period.' },
  { name: 'Enter cycle length', text: 'Input your average menstrual cycle length (typically 21-40 days).' },
  { name: 'Enter period length', text: 'Input how many days your period typically lasts.' },
  { name: 'View your fertile window', text: 'See your ovulation date, fertile window, and cycle calendar.' },
];

const faqs = [
  { question: 'When do I ovulate?', answer: 'Ovulation typically occurs 14 days before your next period. For a 28-day cycle, this is around day 14. Our calculator adjusts for your specific cycle length.' },
  { question: 'What is the fertile window?', answer: 'The fertile window is typically 5 days before ovulation and 1 day after. Sperm can survive up to 5 days, while an egg is viable for 12-24 hours after release.' },
  { question: 'How accurate is this calculator?', answer: 'This calculator provides estimates based on average cycle patterns. For more accuracy, consider tracking basal body temperature, cervical mucus, or using ovulation predictor kits.' },
];

export default function OvulationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ovulation-calculator"
          title="Ovulation Calculator"
          description="Calculate your ovulation date and fertile window to help plan for pregnancy or understand your cycle."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Ovulation Calculator"><OvulationCalculator /></section>
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
