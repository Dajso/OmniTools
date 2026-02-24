import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SubstrateCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Aquarium Substrate Calculator - How Much Gravel or Sand',
    description: 'Calculate how much substrate you need for your aquarium. Supports gravel, sand, soil, and other substrate types.',
    keywords: ['aquarium substrate calculator', 'fish tank gravel', 'aquarium sand amount', 'substrate depth'],
    alternates: { canonical: '/calculators/aquarium/substrate-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Aquarium Substrate Calculator', description: 'Calculate how much substrate you need for your aquarium.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank dimensions', text: 'Input the length and width of your tank in inches or centimeters.' },
    { name: 'Choose desired depth', text: 'Select your target substrate depth — typically 1-3 inches for most setups.' },
    { name: 'Select substrate type', text: 'Choose between gravel, sand, or planted tank soil for accurate weight calculation.' },
    { name: 'Get your amounts', text: 'See how many pounds or kilograms of substrate to purchase.' },
];

const faqs = [
    { question: 'How deep should aquarium substrate be?', answer: '1-2 inches for fish-only tanks, 2-3 inches for planted tanks. Slope it from back (deeper) to front (shallower) for a natural look.' },
    { question: 'How many pounds of gravel per gallon?', answer: 'Approximately 1-1.5 pounds per gallon for a 2-inch layer. Exact amounts vary by tank dimensions.' },
    { question: 'Can I mix gravel and sand?', answer: 'You can, but sand tends to settle below gravel over time. Use a mesh divider or keep them in separate zones.' },
    { question: 'Do I need special substrate for live plants?', answer: 'Yes. Planted tanks benefit from nutrient-rich substrate like aquasoil, though root tabs can supplement inert substrate.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Aquarium Volume Calculator', description: 'Calculate your tank volume.' },
    { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Fertilizer Dosing Calculator', description: 'Dose fertilizers for planted tanks.' },
    { href: '/calculators/aquarium/par-estimator', title: 'PAR Estimator', description: 'Estimate light levels for your plants.' },
];

export default function SubstrateCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="substrate-calculator" title="Aquarium Substrate Calculator"
                    description="Calculate how much substrate you need for your aquarium." category="Aquariums & Terrariums" />
                <section aria-label="Substrate Calculator"><SubstrateCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
