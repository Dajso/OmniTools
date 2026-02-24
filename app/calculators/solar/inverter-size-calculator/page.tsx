import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { InverterSizeCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Inverter Size Calculator - Off-Grid & Solar Inverter Sizing',
    description: 'Calculate the right inverter size for your off-grid or solar system based on your total wattage load and surge requirements.',
    keywords: ['inverter size calculator', 'solar inverter sizing', 'off-grid inverter', 'inverter wattage', 'pure sine wave'],
    alternates: { canonical: '/calculators/solar/inverter-size-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Inverter Size Calculator', description: 'Calculate the right inverter size for your system.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'List your appliances', text: 'Note the wattage of each appliance you want to run simultaneously.' },
    { name: 'Add up total watts', text: 'Sum all running wattages for your continuous load.' },
    { name: 'Account for surge', text: 'Note appliances with high startup surges (motors, compressors, pumps).' },
    { name: 'Get inverter size', text: 'The calculator recommends a continuous and surge-rated inverter size.' },
];

const faqs = [
    { question: 'What size inverter do I need?', answer: 'Add up the watts of everything running at once, then add 20-25% headroom. A 3000W continuous inverter suits most small off-grid cabins.' },
    { question: 'Pure sine wave vs modified sine wave?', answer: 'Pure sine wave is best for sensitive electronics, motors, and medical equipment. Modified sine wave is cheaper but can damage some devices.' },
    { question: 'What is surge vs continuous rating?', answer: 'Continuous is the sustained load. Surge (peak) is the brief high-power draw when motors start. Inverters typically handle 2× continuous for short bursts.' },
    { question: 'Can I run a microwave on an inverter?', answer: 'Yes, but note that a 1000W microwave draws about 1500W from the wall. Size your inverter for the input wattage, not the cooking wattage.' },
];

const relatedTools = [
    { href: '/calculators/solar/dc-power-calculator', title: 'DC Power Calculator', description: 'Calculate watts, amps, and volts.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery bank.' },
    { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Off-Grid Runtime', description: 'How long your batteries will last.' },
];

export default function InverterSizeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="inverter-size-calculator" title="Inverter Size Calculator"
                    description="Calculate the right inverter size for your system." category="Solar & Off-Grid" />
                <section aria-label="Inverter Size Calculator"><InverterSizeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
