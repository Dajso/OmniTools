import { Metadata } from 'next';
import { MovingCostCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Moving Cost Calculator - How Much Does It Cost to Move?',
  description: 'Estimate your moving costs based on distance, home size, and services. Free moving cost calculator for local and long distance moves.',
  keywords: ['moving cost calculator', 'moving estimate', 'how much to move', 'relocation cost calculator'],
  alternates: { canonical: '/calculators/home/moving-cost-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Moving Cost Calculator', description: 'Estimate moving costs', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Select home size', text: 'Choose your home size from studio to 5+ bedrooms.' },
  { name: 'Enter move details', text: 'Enter distance and select local or long distance move.' },
  { name: 'Add services', text: 'Include packing service, specialty items, and other factors.' },
];

const faqs = [
  { question: 'How much does a local move cost?', answer: 'Local moves typically cost $300-$1,500 for a 2-bedroom home, charged by the hour.' },
  { question: 'How much does a long distance move cost?', answer: 'Long distance moves cost $2,000-$5,000+ based on weight and distance.' },
  { question: 'When is the cheapest time to move?', answer: 'Move in winter (October-April) and mid-month on weekdays for the best rates.' },
];

export default function MovingCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="moving-cost-estimator"
          title="Moving Cost Estimator"
          description="Estimate how much your move will cost based on distance, home size, and services."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Moving Cost Calculator"><MovingCostCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
