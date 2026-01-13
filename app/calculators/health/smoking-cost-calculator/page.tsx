import { Metadata } from 'next';
import { SmokingCostCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Smoking Cost Calculator - How Much Does Smoking Cost?',
  description: 'Calculate how much smoking costs you over time. Free smoking cost calculator with health benefits timeline for quitting.',
  keywords: ['smoking cost calculator', 'cigarette cost calculator', 'cost of smoking', 'quit smoking savings', 'smoking expense calculator'],
  alternates: { canonical: '/calculators/health/smoking-cost-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Smoking Cost Calculator',
  description: 'Calculate how much smoking costs you over time',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter cigarettes per day', text: 'Input how many cigarettes you smoke daily.' },
  { name: 'Enter pack price', text: 'Input the price of a pack of cigarettes in your area.' },
  { name: 'Enter cigarettes per pack', text: 'Input how many cigarettes are in your pack (usually 20).' },
  { name: 'Enter years smoked (optional)', text: 'See how much you\'ve already spent on smoking.' },
  { name: 'View your costs', text: 'See daily, weekly, monthly, yearly, and lifetime costs plus what you could buy instead.' },
];

const faqs = [
  { question: 'How much does the average smoker spend?', answer: 'At $8/pack and 1 pack/day, a smoker spends about $2,920/year or $87,600 over 30 years. Costs vary significantly by location and consumption.' },
  { question: 'What are the health benefits of quitting?', answer: 'Benefits start within 20 minutes (heart rate drops). Within 1 year, heart disease risk is halved. Within 10 years, lung cancer risk is halved. Within 15 years, heart disease risk equals a non-smoker.' },
  { question: 'How can I quit smoking?', answer: 'Effective methods include nicotine replacement therapy (patches, gum), prescription medications, counseling, and support groups. Talk to your doctor about the best approach for you.' },
];

export default function SmokingCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="smoking-cost-calculator"
          title="Smoking Cost Calculator"
          description="Calculate how much smoking costs you over time. See what you could buy instead and the health benefits of quitting."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Smoking Cost Calculator"><SmokingCostCalculator /></section>
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
