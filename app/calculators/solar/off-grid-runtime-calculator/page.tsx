import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { OffGridRuntimeCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Off-Grid Runtime Calculator - Battery Backup Duration',
    description: 'Calculate how long your off-grid battery system will power your loads. Plan backup power for outages and off-grid living.',
    keywords: ['off-grid runtime calculator', 'battery backup duration', 'how long will batteries last', 'UPS runtime', 'off-grid power'],
    alternates: { canonical: '/calculators/solar/off-grid-runtime-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Off-Grid Runtime Calculator', description: 'How long will your backup power last?',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter battery capacity', text: 'Input your total battery bank capacity in Ah or kWh.' },
    { name: 'Enter total load', text: 'Sum the wattage of all devices running on your batteries.' },
    { name: 'Set depth of discharge', text: 'Choose your max DoD (50% for lead-acid, 80% for lithium).' },
    { name: 'Get runtime', text: 'See how many hours your system will last at the given load.' },
];

const faqs = [
    { question: 'How long will a 100Ah battery last?', answer: 'A 12V 100Ah battery has 1,200Wh. At 200W load with 50% DoD: about 3 hours. With 80% DoD (lithium): about 4.8 hours.' },
    { question: 'Does temperature affect battery runtime?', answer: 'Yes. Cold temperatures reduce lead-acid capacity by 10-20%. Lithium batteries perform better in cold but should not be charged below freezing.' },
    { question: 'Should I include inverter losses?', answer: 'Yes. Inverters are 85-95% efficient. Add ~10% to your AC load to account for conversion losses from DC batteries.' },
    { question: 'How do I extend my runtime?', answer: 'Reduce load (turn off non-essentials), add more battery capacity, or supplement with a generator or solar panels during the day.' },
];

const relatedTools = [
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery bank properly.' },
    { href: '/calculators/solar/inverter-size-calculator', title: 'Inverter Size Calculator', description: 'Size your inverter.' },
    { href: '/calculators/solar/generator-fuel-calculator', title: 'Generator Fuel Calculator', description: 'Plan backup generator runtime.' },
];

export default function OffGridRuntimeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="off-grid-runtime-calculator" title="Off-Grid Runtime Calculator"
                    description="How long will your backup power last?" category="Solar & Off-Grid" />
                <section aria-label="Off-Grid Runtime Calculator"><OffGridRuntimeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
