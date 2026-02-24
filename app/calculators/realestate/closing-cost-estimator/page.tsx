import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { ClosingCostCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Closing Cost Estimator - Home Buying & Selling Costs',
    description: 'Estimate closing costs for buying or selling a home. See title fees, attorney costs, taxes, and total due at closing.',
    keywords: ['closing cost estimator', 'closing costs calculator', 'home closing costs', 'title fees', 'settlement costs'],
    alternates: { canonical: '/calculators/realestate/closing-cost-estimator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Closing Cost Estimator', description: 'Estimate real estate closing costs.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter property price', text: 'Input the purchase or sale price of the property.' },
    { name: 'Select buyer or seller', text: 'Choose whether you are buying or selling to see relevant costs.' },
    { name: 'Enter loan details', text: 'If buying with a mortgage, enter loan amount and type.' },
    { name: 'See cost breakdown', text: 'View itemized closing costs and total due at settlement.' },
];

const faqs = [
    { question: 'How much are closing costs?', answer: 'Buyer closing costs are typically 2-5% of the purchase price. Seller closing costs (mainly agent commissions) are 6-10% of the sale price.' },
    { question: 'What is included in closing costs?', answer: 'Title insurance, attorney fees, appraisal, home inspection, loan origination fees, recording fees, transfer taxes, and prepaid items (insurance, taxes).' },
    { question: 'Who pays closing costs — buyer or seller?', answer: 'Both pay. Buyers pay most fees (lender/title). Sellers pay agent commissions and some transfer taxes. Some costs are negotiable.' },
    { question: 'Can closing costs be rolled into the mortgage?', answer: 'Some costs can be financed into certain loan types (VA, USDA). Conventional loans may allow seller concessions to cover buyer closing costs.' },
];

const relatedTools = [
    { href: '/calculators/realestate/house-affordability-calculator', title: 'Affordability Calculator', description: 'Include closing costs in your budget.' },
    { href: '/calculators/realestate/1031-exchange-calculator', title: '1031 Exchange', description: 'Defer taxes on property sales.' },
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Evaluate investment properties.' },
];

export default function ClosingCostEstimatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="closing-cost-estimator" title="Closing Cost Estimator"
                    description="Estimate real estate closing costs." category="Real Estate Investing" />
                <section aria-label="Closing Cost Estimator"><ClosingCostCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
