import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { CakePanConverterCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Cake Pan Converter - Scale Recipes to Any Pan Size',
    description: 'Convert cake recipes between different pan sizes and shapes. Calculate batter amounts for round, square, and rectangular pans.',
    keywords: ['cake pan converter', 'cake pan size calculator', 'recipe pan conversion', 'batter amount calculator', 'cake scaling'],
    alternates: { canonical: '/calculators/baking/cake-pan-converter' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Cake Pan Converter', description: 'Convert cake recipes between different pan sizes.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter original pan', text: 'Input the size and shape of the pan your recipe calls for.' },
    { name: 'Enter target pan', text: 'Input the size and shape of the pan you want to use.' },
    { name: 'Get scaling factor', text: 'See the multiplier to scale all ingredient amounts.' },
    { name: 'Adjust bake time', text: 'Note the suggested bake time adjustment — larger pans generally need longer, shallower pans less.' },
];

const faqs = [
    { question: 'How do I convert a round cake recipe to a square pan?', answer: 'A round pan and a square pan of the same diameter are NOT equal. An 8" round has ~50 sq in; an 8" square has 64 sq in. Use our calculator for exact conversions.' },
    { question: 'Can I use a 9-inch pan instead of 8-inch?', answer: 'Yes, a 9" round pan has about 27% more area than an 8" round. Keep the recipe the same but the cake will be thinner and bake faster.' },
    { question: 'How full should I fill a cake pan?', answer: 'Fill cake pans ½ to ⅔ full. Overfilling causes overflow. Underfilling results in thin, dry cakes.' },
    { question: 'Does pan material affect baking?', answer: 'Dark or non-stick pans absorb more heat — reduce temperature by 25°F. Glass pans also bake faster than light metal pans.' },
];

const relatedTools = [
    { href: '/calculators/baking/bakers-percentage-calculator', title: "Baker's Percentage", description: 'Scale all recipe ingredients.' },
    { href: '/calculators/baking/egg-size-converter', title: 'Egg Size Converter', description: 'Convert between egg sizes.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate recipe costs.' },
];

export default function CakePanConverterPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="cake-pan-converter" title="Cake Pan Converter"
                    description="Convert cake recipes between different pan sizes." category="Baking & Food Science" />
                <section aria-label="Cake Pan Converter"><CakePanConverterCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
