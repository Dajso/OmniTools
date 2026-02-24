import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { ProratedRentCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Prorated Rent Calculator - Daily Rent & Move-In Cost',
    description: 'Calculate prorated rent for partial month occupancy. Get exact daily rate and amount due for mid-month move-ins.',
    keywords: ['prorated rent calculator', 'daily rent calculator', 'partial month rent', 'move-in cost', 'rent proration'],
    alternates: { canonical: '/calculators/realestate/prorated-rent-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Prorated Rent Calculator', description: 'Calculate prorated rent for partial months.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter monthly rent', text: 'Input your total monthly rent amount.' },
    { name: 'Select move-in date', text: 'Choose the day you move in during the month.' },
    { name: 'Select proration method', text: 'Choose calendar days (most common) or 30-day month method.' },
    { name: 'See prorated amount', text: 'View the exact prorated rent due for the partial month.' },
];

const faqs = [
    { question: 'How is prorated rent calculated?', answer: 'Monthly rent ÷ days in month × days occupied. For example: $1,500 rent, moving in on the 15th of a 30-day month = $1,500 ÷ 30 × 16 = $800.' },
    { question: 'Do landlords have to prorate rent?', answer: 'Most states do not require proration by law, but it is standard practice. Check your lease agreement — proration terms should be specified.' },
    { question: 'Which proration method is most common?', answer: 'Calendar days (actual days in the month) is most common. Some landlords use a flat 30-day month or a banker\'s month (360 day year).' },
    { question: 'Is first month rent always prorated?', answer: 'Only if you move in mid-month. If your lease starts on the 1st, you pay full rent. Some landlords charge full first month regardless.' },
];

const relatedTools = [
    { href: '/calculators/realestate/house-affordability-calculator', title: 'Affordability Calculator', description: 'How much rent/home can you afford?' },
    { href: '/calculators/realestate/closing-cost-estimator', title: 'Closing Costs', description: 'Estimate property closing costs.' },
    { href: '/calculators/realestate/gross-rent-multiplier-calculator', title: 'GRM Calculator', description: 'Compare rental properties.' },
];

export default function ProratedRentCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="prorated-rent-calculator" title="Prorated Rent Calculator"
                    description="Calculate prorated rent for partial months." category="Real Estate Investing" />
                <section aria-label="Prorated Rent Calculator"><ProratedRentCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
