import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SolarROICalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Solar ROI Calculator - Solar Panel Payback Period',
    description: 'Calculate your solar panel return on investment. See payback period, lifetime savings, and whether solar is worth it for your home.',
    keywords: ['solar ROI calculator', 'solar payback period', 'solar panel savings', 'solar investment return', 'solar worth it'],
    alternates: { canonical: '/calculators/solar/solar-roi-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Solar ROI Calculator', description: 'Calculate your solar panel return on investment.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter system cost', text: 'Input the total cost of your solar system after incentives.' },
    { name: 'Enter electricity cost', text: 'Input your current electricity rate ($/kWh from your bill).' },
    { name: 'Set production estimate', text: 'Enter estimated annual kWh production from your solar installer.' },
    { name: 'View ROI analysis', text: 'See payback period, 25-year savings, and annual return on investment.' },
];

const faqs = [
    { question: 'What is a good payback period for solar?', answer: '5-10 years is considered a good payback period. With the 30% federal tax credit, many systems pay back in 6-8 years.' },
    { question: 'How much do solar panels save per month?', answer: 'Savings vary widely but a typical 6kW system saves $100-$150/month. Actual savings depend on electricity rates and sun exposure.' },
    { question: 'Do solar panels increase home value?', answer: 'Yes, studies show solar panels increase home value by approximately $15,000-$25,000 on average. Buyers pay a premium for lower energy bills.' },
    { question: 'What is the 30% solar tax credit?', answer: 'The federal Investment Tax Credit (ITC) allows you to deduct 30% of solar system costs from federal taxes. This significantly improves ROI.' },
];

const relatedTools = [
    { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Panel Tilt Calculator', description: 'Maximize production with optimal angle.' },
    { href: '/calculators/solar/sun-peak-hours-calculator', title: 'Sun Peak Hours', description: 'Estimate solar hours at your location.' },
    { href: '/calculators/solar/inverter-size-calculator', title: 'Inverter Size Calculator', description: 'Size your inverter correctly.' },
];

export default function SolarROICalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="solar-roi-calculator" title="Solar ROI Calculator"
                    description="Will solar panels pay for themselves?" category="Solar & Off-Grid" />
                <section aria-label="Solar ROI Calculator"><SolarROICalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
