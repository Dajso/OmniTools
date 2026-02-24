import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SourdoughHydrationCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Sourdough Hydration Calculator - Dough Hydration Percentage',
    description: 'Calculate total sourdough hydration percentage including starter contribution. Account for whole wheat, rye, and other flour blends.',
    keywords: ['sourdough hydration calculator', 'dough hydration', 'bakers hydration', 'sourdough starter hydration', 'bread hydration'],
    alternates: { canonical: '/calculators/baking/sourdough-hydration-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Sourdough Hydration Calculator', description: 'Calculate total dough hydration including starter.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter flour weight', text: 'Input total flour weight in grams (not including flour in starter).' },
    { name: 'Enter water weight', text: 'Input the water weight in grams (not including water in starter).' },
    { name: 'Enter starter amount', text: 'Input starter weight and its hydration percentage (commonly 100%).' },
    { name: 'Get total hydration', text: 'See the overall dough hydration accounting for flour and water in the starter.' },
];

const faqs = [
    { question: 'What is sourdough hydration?', answer: 'Hydration is the ratio of water to flour in dough, expressed as a percentage. 70% hydration means 700g water per 1000g flour.' },
    { question: 'What hydration should my sourdough be?', answer: '65-70% for beginners (easier to handle). 75-85% for open crumb artisan loaves. Higher hydration requires more skill.' },
    { question: 'Does starter hydration matter?', answer: 'Yes. A 100% hydration starter contributes equal parts flour and water. A stiff starter (60%) adds more flour, affecting final dough hydration.' },
    { question: 'What is the best hydration for open crumb?', answer: '78-85% hydration with strong flour and proper fermentation produces an open, airy crumb structure.' },
];

const relatedTools = [
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage Calculator", description: 'Scale recipes using baker\'s percentages.' },
    { href: '/calculators/baking/yeast-conversion-calculator', title: 'Yeast Conversion', description: 'Convert between yeast types.' },
    { href: '/calculators/baking/cake-pan-converter', title: 'Cake Pan Converter', description: 'Scale recipes for different pan sizes.' },
];

export default function SourdoughHydrationPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="sourdough-hydration-calculator" title="Sourdough Hydration Calculator"
                    description="Calculate total dough hydration including starter contribution." category="Baking & Food Science" />
                <section aria-label="Sourdough Hydration Calculator"><SourdoughHydrationCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
