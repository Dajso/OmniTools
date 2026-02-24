import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { CateringCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Catering Quantity Estimator - Event Food Planning',
    description: 'Calculate how much food to order for your wedding or event. Get quantities per person for appetizers, mains, sides, and desserts.',
    keywords: ['catering calculator', 'event food quantity', 'food per person', 'wedding catering', 'party food calculator'],
    alternates: { canonical: '/calculators/wedding/catering-quantity-estimator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Catering Quantity Estimator', description: 'Calculate food quantities for events.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the number of guests who will be eating.' },
    { name: 'Select meal style', text: 'Choose buffet, plated, or cocktail/appetizer-only style.' },
    { name: 'Choose menu items', text: 'Select which courses you are serving (appetizers, main, sides, dessert).' },
    { name: 'Get quantities', text: 'See total pounds/pieces needed for each food item.' },
];

const faqs = [
    { question: 'How much food per person for a wedding?', answer: 'Plan 1 lb of food total per person (6 oz protein, 4 oz starch, 4 oz vegetables, 2 oz salad). Add 8-10 appetizer pieces per person for cocktail hour.' },
    { question: 'Buffet vs plated — how much more food?', answer: 'Buffets require 15-20% more food than plated dinners because guests tend to take more. Plan accordingly.' },
    { question: 'How many appetizers per person?', answer: '8-10 pieces for a cocktail hour before dinner. For cocktail-only receptions, plan 12-15 pieces per person.' },
    { question: 'Should I order extra food?', answer: 'Yes, order 5-10% extra. Better to have leftovers than run short. Most caterers build this buffer into their per-person pricing.' },
];

const relatedTools = [
    { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Alcohol Calculator', description: 'Calculate drink quantities.' },
    { href: '/calculators/wedding/wedding-cake-calculator', title: 'Cake Calculator', description: 'Size your wedding cake.' },
    { href: '/calculators/wedding/seating-arrangement-calculator', title: 'Seating Calculator', description: 'Plan table arrangements.' },
];

export default function CateringQuantityEstimatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="catering-quantity-estimator" title="Catering Quantity Estimator"
                    description="Calculate food quantities for your event." category="Wedding & Events" />
                <section aria-label="Catering Quantity Estimator"><CateringCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
