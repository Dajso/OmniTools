import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { CashOnCashCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Cash-on-Cash Return Calculator - Real Estate ROI',
    description: 'Calculate cash-on-cash return for rental properties. Measure your annual return relative to the cash you invested.',
    keywords: ['cash on cash return', 'CoC calculator', 'real estate ROI', 'rental property return', 'investment property ROI'],
    alternates: { canonical: '/calculators/realestate/cash-on-cash-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Cash-on-Cash Return Calculator', description: 'Calculate cash-on-cash return for rental properties.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter annual cash flow', text: 'Input your annual net cash flow (rent minus ALL expenses including mortgage).' },
    { name: 'Enter total cash invested', text: 'Input down payment, closing costs, and any renovation costs you paid cash.' },
    { name: 'Calculate CoC return', text: 'Cash-on-Cash = Annual Cash Flow ÷ Total Cash Invested × 100.' },
    { name: 'Evaluate the deal', text: 'Compare your CoC return to alternative investments and your target return.' },
];

const faqs = [
    { question: 'What is a good cash-on-cash return?', answer: '8-12% is generally considered good. Above 12% is excellent. Below 6% may not justify the risk and effort of landlording.' },
    { question: 'How is cash-on-cash different from cap rate?', answer: 'Cash-on-cash includes mortgage payments and measures return on YOUR cash. Cap rate excludes financing and measures the property\'s raw return.' },
    { question: 'Does cash-on-cash include appreciation?', answer: 'No. CoC only measures annual cash flow return. Appreciation, tax benefits, and equity buildup are additional returns not captured here.' },
    { question: 'Can cash-on-cash return be negative?', answer: 'Yes, if your annual expenses (including mortgage) exceed rental income. This means you are losing cash each year on the property.' },
];

const relatedTools = [
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Calculate capitalization rate.' },
    { href: '/calculators/realestate/brrrr-calculator', title: 'BRRRR Calculator', description: 'Analyze BRRRR strategy deals.' },
    { href: '/calculators/realestate/airbnb-profit-estimator', title: 'Airbnb Profit Estimator', description: 'Estimate short-term rental income.' },
];

export default function CashOnCashCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="cash-on-cash-calculator" title="Cash-on-Cash Return Calculator"
                    description="Calculate return on your invested cash." category="Real Estate Investing" />
                <section aria-label="Cash-on-Cash Calculator"><CashOnCashCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
