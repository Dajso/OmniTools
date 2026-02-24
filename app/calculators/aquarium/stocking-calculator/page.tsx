import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { StockingCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Aquarium Stocking Calculator - Fish Load & Bioload Checker',
    description: 'Check if your aquarium stocking level is safe. Calculate fish bioload based on tank size and fish species for a healthy aquarium.',
    keywords: ['aquarium stocking calculator', 'fish tank stocking', 'bioload calculator', 'how many fish', 'inch per gallon rule'],
    alternates: { canonical: '/calculators/aquarium/stocking-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Aquarium Stocking Calculator', description: 'Check if your aquarium fish load is safe.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank volume', text: 'Input your aquarium volume in gallons or liters.' },
    { name: 'Select filtration type', text: 'Choose your filtration strength — basic, moderate, or heavy filtration.' },
    { name: 'Add your fish', text: 'Enter the number and approximate size of fish you plan to keep.' },
    { name: 'Check stocking level', text: 'Review the stocking percentage and recommendations for a healthy tank.' },
];

const faqs = [
    { question: 'What is the one-inch-per-gallon rule?', answer: 'The old rule suggests 1 inch of fish per gallon, but it is inaccurate for large or messy fish. Our calculator uses bioload-based calculations for better accuracy.' },
    { question: 'How many fish can I put in a 10 gallon tank?', answer: 'A 10-gallon tank works for about 6-8 small fish (neon tetras, guppies). Avoid large or territorial species in small tanks.' },
    { question: 'What happens if I overstock my tank?', answer: 'Overstocking leads to poor water quality, stress, disease, and shortened lifespans. Ammonia and nitrite spikes become more frequent.' },
    { question: 'Does filtration affect stocking capacity?', answer: 'Yes. Heavy filtration with good biological media can support a slightly higher bioload, but tank volume remains the primary limiting factor.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Aquarium Volume Calculator', description: 'Calculate your exact tank volume.' },
    { href: '/calculators/aquarium/water-change-calculator', title: 'Water Change Calculator', description: 'Plan water changes to maintain quality.' },
    { href: '/calculators/aquarium/heater-wattage-calculator', title: 'Heater Wattage Calculator', description: 'Size your heater appropriately.' },
];

export default function StockingCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="stocking-calculator" title="Aquarium Stocking Calculator"
                    description="Check if your aquarium stocking level is safe." category="Aquariums & Terrariums" />
                <section aria-label="Stocking Calculator"><StockingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
