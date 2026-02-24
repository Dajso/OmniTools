import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { TurkeyThawingCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Turkey Thawing Calculator - Safe Defrost Time Guide',
    description: 'Calculate how long to thaw a frozen turkey safely. Get times for refrigerator, cold water, and microwave thawing methods.',
    keywords: ['turkey thawing calculator', 'defrost turkey time', 'thaw frozen turkey', 'turkey thawing guide', 'Thanksgiving turkey'],
    alternates: { canonical: '/calculators/baking/turkey-thawing-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Turkey Thawing Calculator', description: 'Calculate safe turkey thawing times.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter turkey weight', text: 'Input the weight of your frozen turkey in pounds.' },
    { name: 'Select thawing method', text: 'Choose refrigerator (safest), cold water (faster), or microwave (fastest).' },
    { name: 'See thawing time', text: 'Get the estimated total thawing time for your method.' },
    { name: 'Plan ahead', text: 'Calculate what day to start thawing so the turkey is ready for cooking day.' },
];

const faqs = [
    { question: 'How long to thaw a 20-pound turkey?', answer: 'In the refrigerator: about 5 days (24 hours per 4-5 lbs). In cold water: about 10 hours (30 minutes per pound). Always verify with a thermometer.' },
    { question: 'Can I cook a turkey from frozen?', answer: 'Yes, but it takes about 50% longer to cook. USDA says it is safe. Remove giblets when turkey is thawed enough during cooking.' },
    { question: 'Is it safe to thaw turkey on the counter?', answer: 'No. Room temperature thawing lets the outer surface enter the danger zone (40-140°F) while the inside is still frozen, promoting bacterial growth.' },
    { question: 'How long can a thawed turkey stay in the fridge?', answer: 'A fully thawed turkey can stay in the refrigerator for 1-2 additional days before cooking. Keep it at 40°F or below.' },
];

const relatedTools = [
    { href: '/calculators/baking/brine-calculator', title: 'Brine Calculator', description: 'Calculate brine for your turkey.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate meal costs per person.' },
    { href: '/calculators/baking/egg-size-converter', title: 'Egg Size Converter', description: 'Convert egg sizes for recipes.' },
];

export default function TurkeyThawingPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="turkey-thawing-calculator" title="Turkey Thawing Calculator"
                    description="Calculate safe turkey thawing times." category="Baking & Food Science" />
                <section aria-label="Turkey Thawing Calculator"><TurkeyThawingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
