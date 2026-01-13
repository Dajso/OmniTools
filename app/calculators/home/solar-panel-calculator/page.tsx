import { Metadata } from 'next';
import { SolarPanelCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Solar Panel Calculator - How Many Solar Panels Do I Need?',
  description: 'Calculate solar panel requirements, costs, and savings. Free solar calculator with payback period estimation.',
  keywords: ['solar panel calculator', 'solar calculator', 'how many solar panels', 'solar savings calculator'],
  alternates: { canonical: '/calculators/home/solar-panel-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Solar Panel Calculator', description: 'Calculate solar panel requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Enter usage', text: 'Enter your monthly electricity usage from your utility bill.' },
  { name: 'Set location factors', text: 'Enter average peak sun hours for your location.' },
  { name: 'Review costs', text: 'See system size, cost, and payback period.' },
];

const faqs = [
  { question: 'How many solar panels do I need?', answer: 'A typical home needs 20-25 panels (8-10 kW system) to offset 100% of electricity usage.' },
  { question: 'What is the payback period for solar?', answer: 'Most solar systems pay for themselves in 6-10 years, depending on electricity rates and incentives.' },
  { question: 'How many peak sun hours do I get?', answer: 'The US averages 4-6 peak sun hours. Southwest states get 6+, while northern states get 3-4.' },
];

export default function SolarPanelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="solar-panel-calculator"
          title="Solar Panel Calculator"
          description="Calculate how many solar panels you need and estimate your savings."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Solar Panel Calculator"><SolarPanelCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
