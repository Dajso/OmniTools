import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { DCPowerCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'DC Power Calculator - Watts, Amps & Volts Converter',
    description: 'Convert between Watts, Amps, and Volts for DC circuits. Essential for solar, RV, and off-grid electrical planning.',
    keywords: ['DC power calculator', 'watts amps volts', 'DC circuit calculator', 'power formula', '12V power calculator'],
    alternates: { canonical: '/calculators/solar/dc-power-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'DC Power Calculator', description: 'Convert between Watts, Amps, and Volts.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter any two values', text: 'Input any two of Watts, Amps, or Volts.' },
    { name: 'Get the third value', text: 'The calculator computes the missing value using P = V × A.' },
    { name: 'Use for planning', text: 'Apply results to wire sizing, fuse selection, and circuit design.' },
];

const faqs = [
    { question: 'What is the formula for DC power?', answer: 'Power (Watts) = Voltage (Volts) × Current (Amps). This is the fundamental relationship: P = V × I.' },
    { question: 'How many amps does a 100W solar panel produce?', answer: 'At 12V nominal: about 8.3A (100W ÷ 12V). At 24V: about 4.2A. Actual output varies with conditions.' },
    { question: 'Why is DC voltage important for solar?', answer: 'Solar panels, batteries, and charge controllers work with DC voltage. Knowing exact current draw helps size wires and fuses safely.' },
];

const relatedTools = [
    { href: '/calculators/solar/dc-wire-gauge-calculator', title: 'DC Wire Gauge Calculator', description: 'Choose the right wire gauge.' },
    { href: '/calculators/solar/inverter-size-calculator', title: 'Inverter Size Calculator', description: 'Size your DC to AC inverter.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery storage.' },
];

export default function DCPowerCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="dc-power-calculator" title="DC Power Calculator"
                    description="Convert between Watts, Amps, and Volts." category="Solar & Off-Grid" />
                <section aria-label="DC Power Calculator"><DCPowerCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
