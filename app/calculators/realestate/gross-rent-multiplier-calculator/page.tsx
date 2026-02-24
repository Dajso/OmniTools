import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { GRMCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Gross Rent Multiplier Calculator - Quick Property Analysis',
    description: 'Calculate GRM to quickly compare investment properties. A simple ratio of property price to gross annual rent.',
    keywords: ['gross rent multiplier', 'GRM calculator', 'property comparison', 'rental property analysis', 'real estate metrics'],
    alternates: { canonical: '/calculators/realestate/gross-rent-multiplier-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Gross Rent Multiplier Calculator', description: 'Calculate GRM for quick property comparison.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter property price', text: 'Input the purchase price or listing price.' },
    { name: 'Enter gross annual rent', text: 'Input total annual rental income (before any expenses).' },
    { name: 'Calculate GRM', text: 'GRM = Price ÷ Gross Annual Rent.' },
    { name: 'Compare properties', text: 'Lower GRM generally indicates a better deal relative to rental income.' },
];

const faqs = [
    { question: 'What is a good GRM?', answer: 'GRM varies by market. 4-7 is typical for smaller markets. 10-15 is common in expensive cities. Compare within the same market for meaningful analysis.' },
    { question: 'GRM vs cap rate — which is better?', answer: 'Cap rate is more accurate as it accounts for expenses. GRM is useful for quick screening since it only needs price and gross rent.' },
    { question: 'Does GRM use gross or net rent?', answer: 'GRM uses GROSS rent (before expenses). This is both its strength (simplicity) and weakness (ignores operating costs).' },
    { question: 'How do I find comparable GRMs?', answer: 'Calculate GRM for recent sales of similar properties in the same area. This gives you a benchmark for evaluating new deals.' },
];

const relatedTools = [
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'More detailed property analysis.' },
    { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Cash-on-Cash Return', description: 'Calculate return on invested cash.' },
    { href: '/calculators/realestate/house-affordability-calculator', title: 'Affordability Calculator', description: 'How much property can you afford?' },
];

export default function GrossRentMultiplierCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="gross-rent-multiplier-calculator" title="Gross Rent Multiplier Calculator"
                    description="Quick property comparison using GRM." category="Real Estate Investing" />
                <section aria-label="Gross Rent Multiplier Calculator"><GRMCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
