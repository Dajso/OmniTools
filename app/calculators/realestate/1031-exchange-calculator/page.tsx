import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Exchange1031Calculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: '1031 Exchange Calculator - Tax Deferred Real Estate Exchange',
    description: 'Calculate 1031 exchange requirements. See how much to reinvest to defer all capital gains taxes on investment property sales.',
    keywords: ['1031 exchange calculator', 'like-kind exchange', 'tax deferred exchange', 'capital gains deferral', 'investment property tax'],
    alternates: { canonical: '/calculators/realestate/1031-exchange-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: '1031 Exchange Calculator', description: 'Calculate 1031 exchange tax deferral requirements.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter sale price', text: 'Input the sale price of your relinquished (sold) property.' },
    { name: 'Enter cost basis', text: 'Input your adjusted cost basis (purchase price + improvements − depreciation).' },
    { name: 'Enter mortgage balance', text: 'Input any existing mortgage balance payoff amount.' },
    { name: 'See exchange requirements', text: 'View minimum replacement property price and equity to reinvest for full tax deferral.' },
];

const faqs = [
    { question: 'What is a 1031 exchange?', answer: 'A 1031 exchange (Section 1031 of the IRS Code) lets you defer capital gains taxes by reinvesting proceeds from an investment property sale into a "like-kind" replacement property.' },
    { question: 'What are the 1031 exchange deadlines?', answer: '45 days to identify replacement properties, 180 days to close. Both deadlines are strict and begin from the date you sell.' },
    { question: 'Can I do a 1031 exchange on my primary residence?', answer: 'No. 1031 exchanges only apply to investment or business properties, not primary residences or vacation homes (unless certain conditions are met).' },
    { question: 'How much do I need to reinvest to defer all taxes?', answer: 'Reinvest ALL net proceeds and acquire a replacement property of equal or greater value. Any cash taken out ("boot") is taxable.' },
];

const relatedTools = [
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Evaluate replacement properties.' },
    { href: '/calculators/realestate/closing-cost-estimator', title: 'Closing Costs', description: 'Estimate exchange closing costs.' },
    { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Cash-on-Cash Return', description: 'Analyze replacement property returns.' },
];

export default function Exchange1031CalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="1031-exchange-calculator" title="1031 Exchange Calculator"
                    description="Calculate 1031 exchange tax deferral requirements." category="Real Estate Investing" />
                <section aria-label="1031 Exchange Calculator"><Exchange1031Calculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
