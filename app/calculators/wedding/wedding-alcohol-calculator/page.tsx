import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { WeddingAlcoholCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Wedding Alcohol Calculator - How Much Booze Do You Need?',
    description: 'Calculate how much beer, wine, and liquor you need for your wedding reception based on guest count and event duration.',
    keywords: ['wedding alcohol calculator', 'wedding bar calculator', 'how much alcohol for wedding', 'reception drinks', 'open bar calculator'],
    alternates: { canonical: '/calculators/wedding/wedding-alcohol-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Wedding Alcohol Calculator', description: 'Calculate alcohol quantities for your wedding.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the number of guests at your reception (typically 80-85% of invites).' },
    { name: 'Set event duration', text: 'Enter how many hours your reception will last.' },
    { name: 'Choose drink types', text: 'Select which drinks to serve: beer, wine, cocktails, or all three.' },
    { name: 'Get shopping list', text: 'See exactly how many bottles, cases, and kegs to purchase.' },
];

const faqs = [
    { question: 'How much alcohol per person at a wedding?', answer: 'Plan for about 1 drink per person per hour for the first hour, then 0.5-0.75 drinks per hour after. A 5-hour reception averages 4-5 drinks per guest.' },
    { question: 'What is the beer/wine/liquor ratio?', answer: 'A common split is 50% wine, 30% beer, 20% liquor. Adjust based on your guest preferences and season.' },
    { question: 'Should I buy more alcohol than calculated?', answer: 'Yes, buy 10-15% extra. Most liquor stores allow returns of unopened bottles, so overbuying is safer than running out.' },
    { question: 'How many bottles of wine for 100 guests?', answer: 'For 100 guests at a 5-hour reception with wine as primary drink: approximately 50-65 bottles (750ml each).' },
];

const relatedTools = [
    { href: '/calculators/wedding/catering-quantity-estimator', title: 'Catering Quantity', description: 'Calculate food quantities.' },
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Allocate your wedding budget.' },
    { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Seating Calculator', description: 'Plan guest seating.' },
];

export default function WeddingAlcoholCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="wedding-alcohol-calculator" title="Wedding Alcohol Calculator"
                    description="How much alcohol do you need for your wedding?" category="Wedding & Events" />
                <section aria-label="Wedding Alcohol Calculator"><WeddingAlcoholCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
