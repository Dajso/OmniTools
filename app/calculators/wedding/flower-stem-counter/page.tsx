import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { FlowerStemCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Flower Stem Counter - Wedding Floral Planning',
    description: 'Calculate how many flower stems you need for bouquets, centerpieces, and ceremony arrangements at your wedding.',
    keywords: ['flower stem calculator', 'wedding flowers calculator', 'how many stems', 'bouquet calculator', 'centerpiece flowers'],
    alternates: { canonical: '/calculators/wedding/flower-stem-counter' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Flower Stem Counter', description: 'Calculate flower stems for your wedding.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select arrangement type', text: 'Choose bouquet, centerpiece, arch, or ceremony arrangement.' },
    { name: 'Enter quantities', text: 'Specify how many of each arrangement you need.' },
    { name: 'Choose flower types', text: 'Select primary flowers and filler/greenery types.' },
    { name: 'Get stem count', text: 'See total stems needed for each type and overall shopping list.' },
];

const faqs = [
    { question: 'How many stems for a bridal bouquet?', answer: '25-35 stems for a medium bouquet. Small/posy bouquets use 15-20 stems. Large cascading bouquets can use 40-50+ stems.' },
    { question: 'How many stems per centerpiece?', answer: '15-25 stems for a low centerpiece, 30-40+ for tall or lush arrangements. Add 5-10 stems of greenery/filler per arrangement.' },
    { question: 'Should I order extra stems?', answer: 'Yes, order 10-15% extra stems to account for damaged flowers, broken stems, and last-minute additions.' },
    { question: 'What are the cheapest wedding flowers?', answer: 'Carnations, chrysanthemums, baby\'s breath, and seasonal local flowers are most affordable. Roses and peonies are mid-range. Orchids and gardenias are premium.' },
];

const relatedTools = [
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Plan floral budget.' },
    { href: '/calculators/wedding/save-the-date-timeline', title: 'Save the Date Timeline', description: 'When to order flowers.' },
    { href: '/calculators/wedding/tent-size-calculator', title: 'Tent Size Calculator', description: 'Size your event tent.' },
];

export default function FlowerStemCounterPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="flower-stem-counter" title="Flower Stem Counter"
                    description="Calculate flower stems for your wedding." category="Wedding & Events" />
                <section aria-label="Flower Stem Counter"><FlowerStemCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
