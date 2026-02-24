import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SeatingCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Seating Arrangement Calculator - Tables & Guest Planning',
    description: 'Calculate tables needed and plan seating arrangements for weddings and events. Supports round, rectangular, and cocktail tables.',
    keywords: ['seating arrangement calculator', 'wedding seating plan', 'table calculator', 'event seating', 'how many tables'],
    alternates: { canonical: '/calculators/wedding/seating-arrangement-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Seating Arrangement Calculator', description: 'Plan seating arrangements for events.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the total number of seated guests.' },
    { name: 'Select table type', text: 'Choose round, rectangular, banquet, or a mix of table types.' },
    { name: 'Set guests per table', text: 'Choose how many guests per table (8 or 10 for round, 6-8 for rectangular).' },
    { name: 'Get table count', text: 'See how many tables you need and the floor space required.' },
];

const faqs = [
    { question: 'How many guests per round table?', answer: '60-inch round tables seat 8-10 guests comfortably. 72-inch rounds seat 10-12. Leave at least 24 inches per guest for comfort.' },
    { question: 'How much space between tables?', answer: 'Allow 5-6 feet between table centers. This gives guests and servers room to move. More space for formal events.' },
    { question: 'Do I need a seating chart?', answer: 'Yes, for any event over 40 seated guests. Assigned seating prevents confusion, balances tables, and helps with dietary needs.' },
    { question: 'Should the head table be round or rectangular?', answer: 'Head tables are traditionally long and rectangular so all honorees face the guests. Sweetheart tables (just the couple) are popular alternatives.' },
];

const relatedTools = [
    { href: '/calculators/wedding/dance-floor-calculator', title: 'Dance Floor Size', description: 'Size your dance floor.' },
    { href: '/calculators/wedding/tent-size-calculator', title: 'Tent Size Calculator', description: 'Size your event tent.' },
    { href: '/calculators/wedding/catering-quantity-estimator', title: 'Catering Quantity', description: 'Plan food quantities.' },
];

export default function SeatingArrangementCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="seating-arrangement-calculator" title="Seating Arrangement Calculator"
                    description="Plan seating arrangements for your event." category="Wedding & Events" />
                <section aria-label="Seating Calculator"><SeatingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
