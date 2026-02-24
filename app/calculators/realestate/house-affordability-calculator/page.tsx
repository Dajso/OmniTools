import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { HouseAffordabilityCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'House Affordability Calculator - How Much Home Can You Afford?',
    description: 'Calculate how much house you can afford based on income, debts, and down payment. See maximum purchase price and monthly payment.',
    keywords: ['house affordability calculator', 'how much house can I afford', 'home buying calculator', 'mortgage affordability', 'DTI ratio'],
    alternates: { canonical: '/calculators/realestate/house-affordability-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'House Affordability Calculator', description: 'How much house can you afford?',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter annual income', text: 'Input your gross annual household income before taxes.' },
    { name: 'Enter monthly debts', text: 'Include car payments, student loans, credit card minimums, etc.' },
    { name: 'Enter down payment', text: 'Input how much cash you have available for a down payment.' },
    { name: 'See what you can afford', text: 'View the maximum purchase price, monthly payment, and DTI ratio.' },
];

const faqs = [
    { question: 'The 28/36 rule — what is it?', answer: 'The 28/36 rule says housing costs should not exceed 28% of gross income, and total debt payments should not exceed 36%. This is a guideline, not a strict rule.' },
    { question: 'How much should I put down on a house?', answer: '20% is ideal to avoid PMI. FHA loans require 3.5%. VA loans require 0%. More down payment = lower monthly payments and better rates.' },
    { question: 'Does my credit score affect affordability?', answer: 'Yes. Higher credit scores qualify for lower interest rates, which means lower monthly payments and a higher affordable purchase price.' },
    { question: 'Should I buy the maximum I can afford?', answer: 'Probably not. Leave room for savings, maintenance, emergencies, and lifestyle spending. Most financial advisors recommend buying below your maximum.' },
];

const relatedTools = [
    { href: '/calculators/realestate/closing-cost-estimator', title: 'Closing Costs', description: 'Don\'t forget closing costs in your budget.' },
    { href: '/calculators/realestate/prorated-rent-calculator', title: 'Prorated Rent', description: 'Calculate rent for partial months.' },
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Evaluate investment properties.' },
];

export default function HouseAffordabilityCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="house-affordability-calculator" title="House Affordability Calculator"
                    description="How much house can you afford?" category="Real Estate Investing" />
                <section aria-label="House Affordability Calculator"><HouseAffordabilityCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
