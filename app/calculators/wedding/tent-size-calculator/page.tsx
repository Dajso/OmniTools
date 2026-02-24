import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { TentSizeCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Tent Size Calculator - Wedding & Event Tent Planning',
    description: 'Calculate the right tent size for your wedding or event. Account for tables, dance floor, bar, and stage areas.',
    keywords: ['tent size calculator', 'wedding tent', 'event tent sizing', 'party tent size', 'tent rental calculator'],
    alternates: { canonical: '/calculators/wedding/tent-size-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Tent Size Calculator', description: 'Calculate the right tent size for your event.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the total number of guests expected at your event.' },
    { name: 'Select event type', text: 'Choose seated dinner, cocktail reception, ceremony, or combination.' },
    { name: 'Add extra areas', text: 'Include space for dance floor, bar, DJ/band, buffet tables, etc.' },
    { name: 'Get tent dimensions', text: 'See recommended tent size in square feet and standard tent dimensions.' },
];

const faqs = [
    { question: 'How big a tent for 100 guests?', answer: 'Seated dinner: 1,200-1,500 sq ft (30×40 or 40×40). Cocktail reception: 800-1,000 sq ft. Add 200+ sq ft for dance floor and bar.' },
    { question: 'How much space per person in a tent?', answer: 'Seated dinner: 12-15 sq ft/person. Cocktail: 8-10 sq ft/person. Ceremony seating: 6-8 sq ft/person.' },
    { question: 'What tent style should I choose?', answer: 'Pole tents are classic and affordable. Frame tents work on any surface. Clear-top tents are elegant for evening events. Sailcloth tents are most luxurious.' },
    { question: 'Do I need sidewalls?', answer: 'Sidewalls protect from wind, rain, and cool temperatures. Clear sidewalls maintain the view. Plan for sidewalls if there is any chance of inclement weather.' },
];

const relatedTools = [
    { href: '/calculators/wedding/dance-floor-calculator', title: 'Dance Floor Size', description: 'Size the dance floor inside your tent.' },
    { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Seating Calculator', description: 'Plan tables inside your tent.' },
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Plan your tent rental budget.' },
];

export default function TentSizeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="tent-size-calculator" title="Tent Size Calculator"
                    description="Calculate the right tent size for your event." category="Wedding & Events" />
                <section aria-label="Tent Size Calculator"><TentSizeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
