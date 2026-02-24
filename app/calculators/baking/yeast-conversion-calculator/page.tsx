import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { YeastConversionCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Yeast Conversion Calculator - Fresh, Active Dry & Instant',
    description: 'Convert between fresh yeast, active dry yeast, and instant yeast. Get exact substitution amounts for any bread recipe.',
    keywords: ['yeast conversion', 'fresh yeast to dry', 'instant yeast conversion', 'yeast substitution', 'baking yeast types'],
    alternates: { canonical: '/calculators/baking/yeast-conversion-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Yeast Conversion Calculator', description: 'Convert between yeast types for baking.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select source yeast type', text: 'Choose the type of yeast your recipe calls for.' },
    { name: 'Enter the amount', text: 'Input the amount of yeast specified in your recipe.' },
    { name: 'Select target yeast type', text: 'Choose the type of yeast you have available.' },
    { name: 'Get the conversion', text: 'See the exact amount of substitute yeast to use.' },
];

const faqs = [
    { question: 'How do I convert fresh yeast to dry yeast?', answer: 'Divide fresh yeast by 2.5 to get active dry, or by 3 to get instant yeast. Example: 21g fresh ≈ 8.4g active dry ≈ 7g instant.' },
    { question: 'Can I substitute instant for active dry yeast?', answer: 'Yes. Use about 25% less instant yeast than active dry. Instant can be mixed directly into flour; active dry should be proofed in warm water first.' },
    { question: 'Does yeast type affect flavor?', answer: 'Fresh yeast gives a subtly different flavor some bakers prefer. For most recipes, the difference is minimal between all three types.' },
    { question: 'How much yeast per cup of flour?', answer: 'About 2¼ tsp (7g) active dry yeast or 1 packet per 3-4 cups of flour is standard for most bread recipes.' },
];

const relatedTools = [
    { href: '/calculators/baking/sourdough-hydration-calculator', title: 'Sourdough Hydration', description: 'Calculate dough hydration.' },
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage", description: 'Scale recipes with baker\'s math.' },
    { href: '/calculators/baking/turkey-thawing-calculator', title: 'Turkey Thawing', description: 'Thaw time for frozen turkey.' },
];

export default function YeastConversionPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="yeast-conversion-calculator" title="Yeast Conversion Calculator"
                    description="Convert between fresh, active dry, and instant yeast." category="Baking & Food Science" />
                <section aria-label="Yeast Conversion Calculator"><YeastConversionCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
