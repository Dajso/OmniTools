import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { AirbnbProfitCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Airbnb Profit Estimator - Short-Term Rental Income Calculator',
    description: 'Estimate Airbnb rental income and expenses. Calculate net profit, occupancy breakeven, and ROI for short-term rentals.',
    keywords: ['airbnb profit calculator', 'short-term rental income', 'airbnb ROI', 'vacation rental calculator', 'airbnb expenses'],
    alternates: { canonical: '/calculators/realestate/airbnb-profit-estimator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Airbnb Profit Estimator', description: 'Estimate Airbnb rental profit.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter nightly rate', text: 'Input your expected average nightly rate from comparable listings.' },
    { name: 'Set occupancy rate', text: 'Estimate your occupancy — 65-75% is typical for established listings.' },
    { name: 'Enter monthly expenses', text: 'Include mortgage, utilities, cleaning, insurance, and platform fees.' },
    { name: 'View profit analysis', text: 'See monthly/annual net profit, breakeven occupancy, and profit margins.' },
];

const faqs = [
    { question: 'What occupancy rate should I expect on Airbnb?', answer: 'New listings average 40-55%. Established listings with good reviews reach 65-80%. Top listings in hot markets can exceed 85%.' },
    { question: 'What are the biggest Airbnb expenses?', answer: 'Mortgage/rent (40-50% of revenue), cleaning fees, Airbnb service fee (3%), supplies, insurance, utilities, and property management (20-25% if hired).' },
    { question: 'Is Airbnb more profitable than long-term rental?', answer: 'Airbnb can generate 2-3× long-term rental income but has higher expenses, more work, vacancy risk, and regulatory challenges.' },
    { question: 'What is the Airbnb host service fee?', answer: 'Airbnb charges hosts a 3% service fee on each booking (split-fee model). Some hosts use the host-only fee model at 14-16%.' },
];

const relatedTools = [
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Compare investment returns.' },
    { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Cash-on-Cash Return', description: 'Calculate ROI on invested cash.' },
    { href: '/calculators/realestate/renovation-roi-estimator', title: 'Renovation ROI', description: 'Will renovations increase profits?' },
];

export default function AirbnbProfitEstimatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="airbnb-profit-estimator" title="Airbnb Profit Estimator"
                    description="Estimate your Airbnb rental profit." category="Real Estate Investing" />
                <section aria-label="Airbnb Profit Estimator"><AirbnbProfitCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
