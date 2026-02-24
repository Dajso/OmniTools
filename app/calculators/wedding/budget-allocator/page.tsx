import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { BudgetAllocatorCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Wedding Budget Allocator - Where to Spend Your Money',
    description: 'Allocate your wedding budget across categories with industry-standard percentages. See recommended spending for venue, catering, photography & more.',
    keywords: ['wedding budget calculator', 'wedding budget breakdown', 'wedding cost allocator', 'wedding spending guide', 'wedding budget percentages'],
    alternates: { canonical: '/calculators/wedding/budget-allocator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Wedding Budget Allocator', description: 'Allocate your wedding budget wisely.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter total budget', text: 'Input your total wedding budget.' },
    { name: 'Review suggested allocation', text: 'See the recommended percentage breakdown across all wedding categories.' },
    { name: 'Customize percentages', text: 'Adjust percentages to match your priorities (e.g., more for photography, less for flowers).' },
    { name: 'Get dollar amounts', text: 'View the exact dollar amount for each category based on your budget.' },
];

const faqs = [
    { question: 'What percentage goes to the venue?', answer: 'Venue and catering typically consume 40-50% of the total budget. This is the single largest expense for most weddings.' },
    { question: 'How much should wedding photography cost?', answer: 'Photography is typically 10-12% of the budget. For a $30,000 wedding, that is $3,000-$3,600. Quality photography is one of the best investments.' },
    { question: 'What is the average US wedding cost in 2024?', answer: 'The average US wedding costs $28,000-$35,000, varying significantly by location. NYC and SF average $50,000+, while rural areas average $15,000-$20,000.' },
    { question: 'Where should I save money?', answer: 'Invitations (digital), favors (skip or DIY), flowers (in-season), and weekday/off-season dates are the easiest areas to cut costs.' },
];

const relatedTools = [
    { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Alcohol Calculator', description: 'Budget for drinks.' },
    { href: '/calculators/wedding/catering-quantity-estimator', title: 'Catering Quantity', description: 'Estimate food costs.' },
    { href: '/calculators/wedding/flower-stem-counter', title: 'Flower Stem Counter', description: 'Budget for wedding flowers.' },
];

export default function BudgetAllocatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="budget-allocator" title="Wedding Budget Allocator"
                    description="Allocate your wedding budget wisely." category="Wedding & Events" />
                <section aria-label="Budget Allocator"><BudgetAllocatorCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
