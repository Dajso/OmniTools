import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { UnitCostPerServingCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Cost Per Serving Calculator - Recipe Cost Analysis',
    description: 'Calculate the cost per serving for any recipe. Break down ingredient costs and find ways to save on your food budget.',
    keywords: ['cost per serving', 'recipe cost calculator', 'food cost analysis', 'meal cost calculator', 'ingredient cost'],
    alternates: { canonical: '/calculators/baking/unit-cost-per-serving' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Cost Per Serving Calculator', description: 'Calculate the cost per serving for any recipe.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'List ingredients', text: 'Add each ingredient with the store price and package size.' },
    { name: 'Enter amounts used', text: 'Specify how much of each ingredient your recipe uses.' },
    { name: 'Set number of servings', text: 'Enter how many servings your recipe makes.' },
    { name: 'See cost breakdown', text: 'View total recipe cost, cost per serving, and individual ingredient costs.' },
];

const faqs = [
    { question: 'How do I calculate food cost per serving?', answer: 'Add up the cost of all ingredients used (not the whole package, just the portion used). Divide by the number of servings. Our calculator does this automatically.' },
    { question: 'What is a good cost per serving for home cooking?', answer: '$2-4 per serving is typical for home-cooked meals in the US. Vegetarian meals can be under $1.50. Meat-heavy dishes may exceed $5.' },
    { question: 'Should I include spices and oil in the cost?', answer: 'Yes, though the per-recipe cost for spices and oil is usually very small. Include them for accuracy, especially for recipe pricing.' },
    { question: 'How does this compare to eating out?', answer: 'Restaurant meals typically cost 3-5× more than home-cooked equivalents. Even with ingredient waste, cooking at home saves significantly.' },
];

const relatedTools = [
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage", description: 'Scale recipe ingredients.' },
    { href: '/calculators/baking/egg-size-converter', title: 'Egg Size Converter', description: 'Substitute egg sizes.' },
    { href: '/calculators/baking/cake-pan-converter', title: 'Cake Pan Converter', description: 'Convert between pan sizes.' },
];

export default function UnitCostPerServingPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="unit-cost-per-serving" title="Cost Per Serving Calculator"
                    description="Calculate the cost per serving for any recipe." category="Baking & Food Science" />
                <section aria-label="Cost Per Serving Calculator"><UnitCostPerServingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
