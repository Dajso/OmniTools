import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { CO2BubbleCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'CO₂ Bubble Rate Calculator - Planted Aquarium CO2 Levels',
    description: 'Calculate CO2 concentration in your planted aquarium from KH and pH values. Determine optimal bubble rates for plant growth.',
    keywords: ['CO2 calculator', 'planted tank CO2', 'KH pH CO2 chart', 'aquarium CO2 levels', 'bubble counter'],
    alternates: { canonical: '/calculators/aquarium/co2-bubble-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'CO₂ Bubble Rate Calculator', description: 'Calculate CO2 concentration from KH and pH values for planted aquariums.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Test your water', text: 'Measure KH (carbonate hardness) and pH using liquid test kits for accuracy.' },
    { name: 'Enter KH and pH', text: 'Input the measured KH in dKH and pH value into the calculator.' },
    { name: 'Read CO₂ level', text: 'The calculator shows your CO₂ concentration in mg/L (ppm).' },
    { name: 'Adjust if needed', text: 'Aim for 20-30 ppm CO₂ for optimal plant growth without harming fish.' },
];

const faqs = [
    { question: 'What is the ideal CO₂ level for a planted tank?', answer: '20-30 mg/L (ppm) is ideal. Below 20 ppm, plants may not thrive. Above 30 ppm, fish may show signs of stress.' },
    { question: 'How does KH affect CO₂ readings?', answer: 'CO₂ concentration is calculated from the relationship between KH and pH. Higher KH at the same pH means more CO₂ is dissolved.' },
    { question: 'Why is my drop checker yellow?', answer: 'A yellow drop checker indicates CO₂ is above 30 ppm, which may be too high for fish. Reduce your bubble rate or increase surface agitation.' },
    { question: 'Can I use CO₂ with a low-tech tank?', answer: 'Yes, but low-tech tanks usually rely on natural CO₂ from fish and organic matter. Injected CO₂ is typically used in high-light, high-tech setups.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Fertilizer Dosing Calculator', description: 'Calculate EI method fertilizer dosing.' },
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Aquarium Volume Calculator', description: 'Calculate your tank volume accurately.' },
    { href: '/calculators/aquarium/par-estimator', title: 'PAR Estimator', description: 'Estimate light levels at substrate depth.' },
];

export default function CO2BubbleCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="co2-bubble-calculator" title="CO₂ Bubble Rate Calculator"
                    description="Calculate CO2 concentration from KH and pH values." category="Aquariums & Terrariums" />
                <section aria-label="CO2 Bubble Calculator"><CO2BubbleCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
