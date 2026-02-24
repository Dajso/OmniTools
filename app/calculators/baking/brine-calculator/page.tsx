import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { BrineCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Brine Calculator - Salt to Water Ratio for Meat & Poultry',
    description: 'Calculate the perfect brine ratio for turkey, chicken, pork, and more. Get salt and water amounts for wet and dry brining.',
    keywords: ['brine calculator', 'brine ratio', 'turkey brine', 'salt water ratio', 'wet brine recipe', 'dry brine'],
    alternates: { canonical: '/calculators/baking/brine-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Brine Calculator', description: 'Calculate the perfect brine ratio for meat and poultry.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter meat weight', text: 'Input the weight of the meat you want to brine.' },
    { name: 'Select brine type', text: 'Choose between wet brine (saltwater) or dry brine (salt rub).' },
    { name: 'Choose concentration', text: 'Select standard (5-6%) or strong (8-10%) brine concentration.' },
    { name: 'Get your recipe', text: 'See exact amounts of salt, water, sugar, and brining time.' },
];

const faqs = [
    { question: 'What is the ratio for brine?', answer: 'A standard wet brine is about 1 cup (240g) salt per gallon of water (roughly 6% concentration). Use kosher or sea salt, not table salt.' },
    { question: 'How long should I brine a turkey?', answer: '12-24 hours for a wet brine, 24-48 hours for a dry brine. Do not exceed recommended times or the meat becomes too salty.' },
    { question: 'Wet brine vs dry brine?', answer: 'Dry brining produces crispier skin and takes less space. Wet brining adds moisture and flavor more deeply. Both produce juicier meat.' },
    { question: 'Can I brine too long?', answer: 'Yes. Over-brining makes meat mushy and overly salty. Follow recommended times: 1 hour per pound for chicken, 12-24 hours for turkey.' },
];

const relatedTools = [
    { href: '/calculators/baking/turkey-thawing-calculator', title: 'Turkey Thawing', description: 'Thaw your turkey on time.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate ingredient costs.' },
    { href: '/calculators/baking/alcohol-dilution-calculator', title: 'Alcohol Dilution', description: 'Dilute spirits to desired proof.' },
];

export default function BrineCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="brine-calculator" title="Brine Calculator"
                    description="Calculate the perfect brine ratio for meat and poultry." category="Baking & Food Science" />
                <section aria-label="Brine Calculator"><BrineCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
