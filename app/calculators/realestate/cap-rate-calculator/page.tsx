import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { CapRateCalculator } from '@/components/calculators/realestate';

export const metadata: Metadata = {
    title: 'Cap Rate Calculator - Real Estate Capitalization Rate',
    description: 'Calculate capitalization rate for investment properties. Compare properties and assess potential returns objectively.',
    keywords: ['cap rate calculator', 'capitalization rate', 'real estate cap rate', 'investment property calculator', 'NOI'],
    alternates: { canonical: '/calculators/realestate/cap-rate-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Cap Rate Calculator', description: 'Calculate cap rate for investment properties.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter property value', text: 'Input the purchase price or current market value.' },
    { name: 'Enter annual NOI', text: 'Input Net Operating Income (rental income minus operating expenses, excluding mortgage).' },
    { name: 'Calculate cap rate', text: 'Cap Rate = NOI ÷ Property Value × 100.' },
    { name: 'Compare properties', text: 'Use cap rate to objectively compare investment opportunities.' },
];

const faqs = [
    { question: 'What is a good cap rate?', answer: '5-10% is typical. Higher cap rates mean higher returns but often higher risk. Class A properties in prime locations may have 3-5% cap rates.' },
    { question: 'What is Net Operating Income (NOI)?', answer: 'NOI = Gross rental income − operating expenses (taxes, insurance, maintenance, management). It does NOT include mortgage payments.' },
    { question: 'Cap rate vs cash-on-cash return?', answer: 'Cap rate ignores financing — it measures the property\'s return. Cash-on-cash measures return on YOUR cash invested including the mortgage effect.' },
    { question: 'Is a higher cap rate always better?', answer: 'Not necessarily. Higher cap rates often indicate higher risk areas, older properties, or markets with less appreciation potential.' },
];

const relatedTools = [
    { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Cash-on-Cash Calculator', description: 'Calculate return on invested cash.' },
    { href: '/calculators/realestate/gross-rent-multiplier-calculator', title: 'Gross Rent Multiplier', description: 'Quick property comparison metric.' },
    { href: '/calculators/realestate/brrrr-calculator', title: 'BRRRR Calculator', description: 'Analyze BRRRR strategy deals.' },
];

export default function CapRateCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="cap-rate-calculator" title="Cap Rate Calculator"
                    description="Calculate capitalization rate for investment properties." category="Real Estate Investing" />
                <section aria-label="Cap Rate Calculator"><CapRateCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
