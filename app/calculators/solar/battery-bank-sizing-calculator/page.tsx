import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { BatteryBankSizingCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Battery Bank Sizing Calculator - Off-Grid Battery Storage',
    description: 'Size your off-grid battery bank based on daily energy needs, autonomy days, and battery type. Supports lithium and lead-acid.',
    keywords: ['battery bank sizing', 'off-grid battery calculator', 'solar battery size', 'battery capacity calculator', 'Ah calculator'],
    alternates: { canonical: '/calculators/solar/battery-bank-sizing-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Battery Bank Sizing Calculator', description: 'Size your off-grid battery bank.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Calculate daily usage', text: 'Add up the watt-hours (Wh) of all appliances you use per day.' },
    { name: 'Set autonomy days', text: 'Choose how many days of backup you need (typically 2-3 for solar).' },
    { name: 'Select battery type', text: 'Choose between lithium (LiFePO4) or lead-acid batteries.' },
    { name: 'Get bank size', text: 'See the total Ah capacity and number of batteries recommended.' },
];

const faqs = [
    { question: 'How do I calculate battery bank size?', answer: 'Daily Wh ÷ system voltage × autonomy days ÷ depth of discharge = required Ah. Our calculator handles this automatically.' },
    { question: 'Lithium vs lead-acid for solar?', answer: 'Lithium (LiFePO4) has 80-90% usable capacity, lasts 3000+ cycles, and is lighter. Lead-acid is cheaper upfront but only 50% usable and lasts 500-800 cycles.' },
    { question: 'What is depth of discharge (DoD)?', answer: 'DoD is how much of the battery you use before recharging. Lead-acid should not exceed 50% DoD; lithium can safely go to 80-90%.' },
    { question: 'How many days of autonomy do I need?', answer: '2-3 days is standard for solar. More for locations with frequent cloudy periods. Less if you have a backup generator.' },
];

const relatedTools = [
    { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Solar Panel Tilt', description: 'Optimize your panel angle.' },
    { href: '/calculators/solar/inverter-size-calculator', title: 'Inverter Size Calculator', description: 'Size your inverter correctly.' },
    { href: '/calculators/solar/dc-wire-gauge-calculator', title: 'DC Wire Gauge', description: 'Choose the right wire gauge.' },
];

export default function BatteryBankSizingPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="battery-bank-sizing-calculator" title="Battery Bank Sizing Calculator"
                    description="Size your off-grid battery bank." category="Solar & Off-Grid" />
                <section aria-label="Battery Bank Sizing Calculator"><BatteryBankSizingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
