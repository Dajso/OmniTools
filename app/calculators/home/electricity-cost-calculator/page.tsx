import { Metadata } from 'next';
import { ElectricityCostCalculator } from '@/components/calculators/home';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Electricity Cost Calculator - Calculate Power Usage Cost',
  description: 'Calculate how much electricity your appliances use and cost. Free electricity cost calculator with daily, monthly, and yearly estimates.',
  keywords: ['electricity cost calculator', 'power usage calculator', 'energy cost calculator', 'appliance cost calculator'],
  alternates: { canonical: '/calculators/home/electricity-cost-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Electricity Cost Calculator',
  description: 'Calculate electricity costs for your appliances',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter wattage', text: 'Find the wattage on your appliance label or manual.' },
  { name: 'Set usage hours', text: 'Enter how many hours per day you use the appliance.' },
  { name: 'Enter electricity rate', text: 'Check your utility bill for your rate per kWh.' },
  { name: 'View costs', text: 'See daily, monthly, and yearly electricity costs.' },
];

const faqs = [
  { question: 'How do I find my appliance wattage?', answer: 'Check the label on the appliance, the manual, or search online for your model. Common examples: LED bulb (10W), refrigerator (150W), AC unit (1500W).' },
  { question: 'What is kWh?', answer: 'Kilowatt-hour (kWh) is the unit of energy used by utilities. 1 kWh = using 1000 watts for 1 hour.' },
  { question: 'How do I find my electricity rate?', answer: 'Check your utility bill. The average US rate is about $0.12-0.15 per kWh, but varies by location.' },
  { question: 'How can I reduce electricity costs?', answer: 'Use energy-efficient appliances, unplug devices when not in use, and run high-wattage appliances during off-peak hours.' },
];

const relatedTools = [
  { href: '/calculators/home/solar-panel-calculator', title: 'Solar Panel Calculator', description: 'Calculate solar panel savings.' },
  { href: '/calculators/home/btu-calculator', title: 'BTU Calculator', description: 'Calculate AC/heating needs.' },
];

export default function ElectricityCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="electricity-cost-calculator"
          title="Electricity Cost Calculator"
          description="Calculate how much electricity your appliances use and cost. Get daily, monthly, and yearly estimates."
          colorClass="bg-amber-100 text-amber-600"
          category="Home"
        />

        <section aria-label="Electricity Cost Calculator">
          <ElectricityCostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
