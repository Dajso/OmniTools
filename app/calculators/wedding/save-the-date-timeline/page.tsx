import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SaveTheDateCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Save the Date Timeline - Wedding Planning Milestones',
    description: 'Generate a complete wedding planning timeline with key milestones from engagement to wedding day. Never miss a deadline.',
    keywords: ['wedding planning timeline', 'save the date when', 'wedding checklist', 'wedding milestones', 'wedding planning schedule'],
    alternates: { canonical: '/calculators/wedding/save-the-date-timeline' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Save the Date Timeline', description: 'Generate a wedding planning timeline.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter wedding date', text: 'Input your wedding date to calculate all milestone deadlines.' },
    { name: 'Review timeline', text: 'See key dates counting backwards from the wedding day.' },
    { name: 'Check each milestone', text: 'Key milestones: save the dates (6-8 months), invitations (8-10 weeks), final counts (2 weeks).' },
    { name: 'Track progress', text: 'Use the timeline to stay on track with vendors, RSVPs, and preparations.' },
];

const faqs = [
    { question: 'When should save the dates go out?', answer: '6-8 months before the wedding. For destination weddings, send 8-12 months in advance to give guests time to plan travel.' },
    { question: 'When should wedding invitations be sent?', answer: '6-8 weeks before the wedding. Set RSVP deadline for 2-3 weeks before the wedding to finalize counts with vendors.' },
    { question: 'How long is a typical engagement?', answer: '12-18 months is typical in the US. Shorter engagements (6 months) work but limit venue and vendor options.' },
    { question: 'When should I book vendors?', answer: 'Venue: 12-18 months out. Photographer and popular vendors: 9-12 months. Florist, DJ, cake: 6-9 months. Earlier for peak wedding season.' },
];

const relatedTools = [
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Plan your budget.' },
    { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Alcohol Calculator', description: 'Plan your bar.' },
    { href: '/calculators/wedding/catering-quantity-estimator', title: 'Catering Quantity', description: 'Plan food amounts.' },
];

export default function SaveTheDateTimelinePage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="save-the-date-timeline" title="Save the Date Timeline"
                    description="Generate your wedding planning timeline." category="Wedding & Events" />
                <section aria-label="Save the Date Timeline"><SaveTheDateCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
