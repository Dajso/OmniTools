import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { DanceFloorCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Dance Floor Size Calculator - Event & Wedding Planning',
    description: 'Calculate the right dance floor size for your wedding or event. Based on guest count and expected percentage of dancers.',
    keywords: ['dance floor calculator', 'dance floor size', 'wedding dance floor', 'event planning', 'square footage dance floor'],
    alternates: { canonical: '/calculators/wedding/dance-floor-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Dance Floor Size Calculator', description: 'Calculate the right dance floor size.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the total number of event guests.' },
    { name: 'Set dancer percentage', text: 'Estimate what percentage will dance (typically 30-50% for weddings).' },
    { name: 'Get floor dimensions', text: 'See recommended floor size in square feet and dimensions.' },
    { name: 'Plan your layout', text: 'Use the dimensions to plan your venue floor plan around the dance area.' },
];

const faqs = [
    { question: 'How big should a wedding dance floor be?', answer: 'Allow 4.5 sq ft per dancer. For 150 guests with 40% dancing: 150 × 0.4 × 4.5 = 270 sq ft, roughly a 16×17 foot floor.' },
    { question: 'What percentage of guests actually dance?', answer: '30-40% at most weddings. Up to 50-60% if you have an excellent band or DJ and an open bar. Afternoon events tend lower.' },
    { question: 'Is the dance floor too big a problem?', answer: 'Yes, an oversized dance floor looks empty and discourages dancing. A slightly snug floor creates energy. Go smaller rather than bigger.' },
    { question: 'Where should the dance floor go?', answer: 'Near the band/DJ, away from the dinner area but visible. Avoid placing it near exits where noise disturbs other zones.' },
];

const relatedTools = [
    { href: '/calculators/wedding/tent-size-calculator', title: 'Tent Size Calculator', description: 'Size your event tent.' },
    { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Seating Calculator', description: 'Plan table arrangements.' },
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Allocate your wedding budget.' },
];

export default function DanceFloorCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="dance-floor-calculator" title="Dance Floor Size Calculator"
                    description="Calculate the right dance floor size for your event." category="Wedding & Events" />
                <section aria-label="Dance Floor Calculator"><DanceFloorCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
