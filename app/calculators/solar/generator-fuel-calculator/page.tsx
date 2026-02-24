import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { GeneratorFuelCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Generator Fuel Calculator - Runtime & Fuel Consumption',
    description: 'Calculate how long your generator will run on a tank of fuel. Estimate fuel consumption based on load percentage.',
    keywords: ['generator fuel calculator', 'generator runtime', 'fuel consumption', 'generator gas usage', 'backup power'],
    alternates: { canonical: '/calculators/solar/generator-fuel-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Generator Fuel Calculator', description: 'Calculate generator runtime and fuel consumption.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank size', text: 'Input your generator fuel tank capacity in gallons.' },
    { name: 'Set fuel consumption', text: 'Enter the rated fuel consumption at your expected load (check the manual).' },
    { name: 'Choose load percentage', text: 'Select your estimated load — generators are most efficient at 50-75% load.' },
    { name: 'Get runtime estimate', text: 'See how many hours your generator will run before refueling.' },
];

const faqs = [
    { question: 'How much fuel does a generator use per hour?', answer: 'A typical 3500W portable generator uses 0.5-1.0 gallons per hour at 50% load. Larger generators consume proportionally more.' },
    { question: 'Is it bad to run a generator at full load?', answer: 'Running at 100% load continuously increases fuel consumption and wear. Aim for 50-75% load for optimal efficiency and longevity.' },
    { question: 'How long will a 5-gallon gas can run a generator?', answer: 'At 50% load on a typical 3500W generator, about 8-12 hours. Exact runtime depends on the generator model and load.' },
    { question: 'Can I use a generator during a power outage?', answer: 'Yes, but NEVER run it indoors or in an enclosed space. Place it at least 20 feet from the house with exhaust pointing away.' },
];

const relatedTools = [
    { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Off-Grid Runtime', description: 'Calculate battery backup runtime.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery bank instead.' },
    { href: '/calculators/solar/dc-power-calculator', title: 'DC Power Calculator', description: 'Calculate watts, amps, and volts.' },
];

export default function GeneratorFuelCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="generator-fuel-calculator" title="Generator Fuel Calculator"
                    description="How long will your generator run?" category="Solar & Off-Grid" />
                <section aria-label="Generator Fuel Calculator"><GeneratorFuelCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
