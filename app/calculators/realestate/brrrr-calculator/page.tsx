import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { BRRRRCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'BRRRR Calculator - Buy Rehab Rent Refinance Repeat',
    description: 'Analyze BRRRR strategy deals step by step. Calculate renovation costs, after-repair value, refinance amounts, and cash left in the deal.',
    keywords: ['BRRRR calculator', 'BRRRR strategy', 'buy rehab rent refinance', 'real estate BRRRR', 'house flipping calculator'],
    alternates: { canonical: '/calculators/realestate/brrrr-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'BRRRR Calculator', description: 'Analyze BRRRR strategy deals.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter purchase price', text: 'Input the property purchase price (typically below market value).' },
    { name: 'Enter rehab costs', text: 'Estimate total renovation costs to bring the property to target condition.' },
    { name: 'Enter after-repair value (ARV)', text: 'Input the estimated value after renovations are complete.' },
    { name: 'Set refinance terms', text: 'Enter expected LTV ratio and interest rate for the refinance loan.' },
    { name: 'See BRRRR analysis', text: 'View cash left in the deal, monthly cash flow, and whether you can recoup your investment.' },
];

const faqs = [
    { question: 'What is the BRRRR strategy?', answer: 'BRRRR stands for Buy, Rehab, Rent, Refinance, Repeat. You buy undervalue property, renovate it, rent it out, refinance to pull cash out, then repeat with another property.' },
    { question: 'What is the 70% rule in BRRRR?', answer: 'Buy at or below 70% of ARV minus repair costs. Example: $200K ARV, $30K repairs → Max purchase = ($200K × 70%) − $30K = $110K.' },
    { question: 'How much cash should I leave in a BRRRR deal?', answer: 'Ideally zero — a perfect BRRRR recovers all your cash on refinance. In practice, leaving $5-15K in the deal is common and still considered successful.' },
    { question: 'What LTV do banks offer for BRRRR refinance?', answer: 'Most banks offer 70-80% LTV on investment property refinances. Some portfolio lenders go to 80%. The higher the LTV, the more cash you recover.' },
];

const relatedTools = [
    { href: '/calculators/realestate/renovation-roi-estimator', title: 'Renovation ROI', description: 'Calculate renovation return.' },
    { href: '/calculators/realestate/cap-rate-calculator', title: 'Cap Rate Calculator', description: 'Calculate property cap rate.' },
    { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Cash-on-Cash Return', description: 'Calculate return on invested cash.' },
];

export default function BRRRRCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="brrrr-calculator" title="BRRRR Calculator"
                    description="Analyze Buy-Rehab-Rent-Refinance-Repeat deals." category="Real Estate Investing" />
                <section aria-label="BRRRR Calculator"><BRRRRCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
