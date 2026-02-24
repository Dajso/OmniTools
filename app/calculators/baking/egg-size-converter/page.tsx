import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { EggSizeConverterCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Egg Size Converter - Substitute Different Egg Sizes',
    description: 'Convert between egg sizes for baking recipes. Calculate how many small, medium, large, or extra-large eggs to substitute.',
    keywords: ['egg size converter', 'egg substitution chart', 'egg sizes baking', 'how many eggs', 'large eggs to medium'],
    alternates: { canonical: '/calculators/baking/egg-size-converter' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Egg Size Converter', description: 'Convert between egg sizes for baking.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select recipe egg size', text: 'Choose the egg size your recipe calls for (usually Large in US recipes).' },
    { name: 'Enter quantity', text: 'Input how many eggs the recipe requires.' },
    { name: 'Select your egg size', text: 'Choose the egg size you have available.' },
    { name: 'Get the substitution', text: 'See how many of your eggs to use and any volume adjustment needed.' },
];

const faqs = [
    { question: 'What size eggs do most recipes use?', answer: 'Most US recipes assume Large eggs (~50g / 1.75 oz each without shell). Always check the recipe, especially for baking.' },
    { question: 'How many medium eggs equal one large?', answer: 'About 1.1 medium eggs per large egg. For 3 large eggs, use 4 medium eggs.' },
    { question: 'Does egg size really matter in baking?', answer: 'Yes, especially in custards, soufflés, and cakes where liquid ratios are critical. For cookies and muffins, small differences are usually fine.' },
    { question: 'What is the weight of each egg size?', answer: 'Small: 42g, Medium: 49g, Large: 56g, Extra Large: 63g, Jumbo: 70g (approximate weights with shell).' },
];

const relatedTools = [
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage", description: 'Scale complete recipes.' },
    { href: '/calculators/baking/cake-pan-converter', title: 'Cake Pan Converter', description: 'Convert between pan sizes.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate recipe costs.' },
];

export default function EggSizeConverterPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="egg-size-converter" title="Egg Size Converter"
                    description="Convert between egg sizes for baking." category="Baking & Food Science" />
                <section aria-label="Egg Size Converter"><EggSizeConverterCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
