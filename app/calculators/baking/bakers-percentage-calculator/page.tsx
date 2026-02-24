import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { BakersPercentageCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: "Baker's Percentage Calculator - Recipe Scaling Tool",
    description: "Calculate baker's percentages and scale bread recipes up or down. Convert any recipe to baker's math for consistent results.",
    keywords: ["baker's percentage", 'bread recipe scaling', "baker's math", 'flour percentage calculator', 'recipe scaling'],
    alternates: { canonical: '/calculators/baking/bakers-percentage-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: "Baker's Percentage Calculator", description: "Scale recipes using baker's percentages.",
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter ingredients', text: 'List your recipe ingredients and their weights in grams.' },
    { name: 'Set flour as 100%', text: "Total flour is always 100% in baker's math. All other ingredients are relative to flour." },
    { name: "See baker's percentages", text: 'View each ingredient as a percentage of total flour weight.' },
    { name: 'Scale the recipe', text: 'Change the flour amount to scale the entire recipe proportionally.' },
];

const faqs = [
    { question: "What is baker's percentage?", answer: "Baker's percentage expresses each ingredient as a percentage of total flour weight. If flour is 1000g and water is 700g, water is 70%. This makes scaling easy." },
    { question: "Why use baker's percentage instead of regular percentages?", answer: "Regular percentages add to 100% total. Baker's percentages reference only flour, so they can exceed 100% when summed but make scaling simple." },
    { question: 'How do I scale a bread recipe?', answer: "Convert to baker's percentages, then multiply all percentages by your new flour weight. Example: 70% water with 500g flour = 350g water." },
    { question: 'What percentage of salt should bread have?', answer: "Standard bread uses 1.8-2.2% salt (baker's percentage). So for 1000g flour, use 18-22g salt. This affects flavor and fermentation speed." },
];

const relatedTools = [
    { href: '/calculators/baking/sourdough-hydration-calculator', title: 'Sourdough Hydration', description: 'Calculate dough hydration.' },
    { href: '/calculators/baking/yeast-conversion-calculator', title: 'Yeast Conversion', description: 'Convert between yeast types.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate recipe costs.' },
];

export default function BakersPercentagePage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="bakers-percentage-calculator" title="Baker's Percentage Calculator"
                    description="Scale recipes using baker's percentages." category="Baking & Food Science" />
                <section aria-label="Baker's Percentage Calculator"><BakersPercentageCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
