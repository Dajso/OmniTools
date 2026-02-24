import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SunsetTimeCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Sunset Time for Wedding - Golden Hour Planning',
    description: 'Find the sunset time for your wedding date and location. Plan golden hour photos and ceremony timing perfectly.',
    keywords: ['sunset time wedding', 'golden hour calculator', 'wedding sunset photos', 'ceremony timing', 'sunset time calculator'],
    alternates: { canonical: '/calculators/wedding/sunset-wedding-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Sunset Time for Wedding', description: 'Plan your wedding around golden hour.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter your location', text: 'Input the latitude and longitude of your wedding venue.' },
    { name: 'Enter wedding date', text: 'Select the date of your wedding.' },
    { name: 'See sunset time', text: 'View the exact sunset time, golden hour start, and blue hour times.' },
    { name: 'Plan your schedule', text: 'Schedule ceremony, photos, and reception transitions around golden hour.' },
];

const faqs = [
    { question: 'What is golden hour?', answer: 'Golden hour is the period shortly before sunset (and after sunrise) when sunlight is warm and soft. It lasts roughly 30-60 minutes and produces the most beautiful photos.' },
    { question: 'When should I schedule ceremony for sunset photos?', answer: 'End the ceremony 60-90 minutes before sunset. This gives time for post-ceremony photos during golden hour while guests enjoy cocktail hour.' },
    { question: 'What is blue hour?', answer: 'Blue hour is the 20-30 minutes after sunset when the sky has a deep blue tone. It is beautiful for dramatic portraits with venue lights.' },
    { question: 'Does cloud cover affect golden hour?', answer: 'Overcast skies can eliminate golden hour direct light but create beautiful soft, even lighting. Partly cloudy skies often produce the most dramatic golden hour.' },
];

const relatedTools = [
    { href: '/calculators/wedding/save-the-date-timeline', title: 'Save the Date Timeline', description: 'Plan your wedding schedule.' },
    { href: '/calculators/wedding/tent-size-calculator', title: 'Tent Size Calculator', description: 'Plan outdoor reception.' },
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Plan your wedding budget.' },
];

export default function SunsetWeddingCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="sunset-wedding-calculator" title="Sunset Time for Wedding"
                    description="Plan your wedding around golden hour." category="Wedding & Events" />
                <section aria-label="Sunset Wedding Calculator"><SunsetTimeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
