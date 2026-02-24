import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { WeddingCakeCalculator } from '@/components/calculators/wedding';

export const metadata: Metadata = {
    title: 'Wedding Cake Serving Calculator - Cake Size Guide',
    description: 'Calculate how big your wedding cake needs to be. Get tier sizes and serving counts for your guest list.',
    keywords: ['wedding cake calculator', 'cake serving calculator', 'wedding cake size', 'how many servings', 'cake tier size'],
    alternates: { canonical: '/calculators/wedding/wedding-cake-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Wedding Cake Serving Calculator', description: 'Calculate wedding cake size for your guest count.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter guest count', text: 'Input the number of guests who will be served cake.' },
    { name: 'Choose serving style', text: 'Select wedding servings (thin slices) or party servings (larger slices).' },
    { name: 'Select tier count', text: 'Choose how many tiers you want for your cake design.' },
    { name: 'See tier sizes', text: 'View recommended tier diameters and total servings per configuration.' },
];

const faqs = [
    { question: 'How big should a wedding cake be for 150 guests?', answer: 'A 3-tier cake with 6", 10", and 14" round tiers provides about 150 wedding-size servings. Exact counts depend on serving size.' },
    { question: 'Wedding serving vs party serving?', answer: 'Wedding cake slices are 1"×2"×4" (thin). Party servings are 2"×2"×4" (generous). Wedding servings yield double the slices from the same cake.' },
    { question: 'Do all guests eat cake?', answer: 'Typically 70-85% of guests eat cake. You can plan for fewer servings, but having extra is better than running short.' },
    { question: 'Can I have a display cake and sheet cake?', answer: 'Yes! A small beautiful display cake with sheet cake in the kitchen is a popular and cost-effective approach.' },
];

const relatedTools = [
    { href: '/calculators/wedding/wedding-alcohol-calculator', title: 'Alcohol Calculator', description: 'Calculate drinks for reception.' },
    { href: '/calculators/wedding/catering-quantity-estimator', title: 'Catering Quantity', description: 'Plan food quantities.' },
    { href: '/calculators/wedding/budget-allocator', title: 'Budget Allocator', description: 'Allocate your wedding budget.' },
];

export default function WeddingCakeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="wedding-cake-calculator" title="Wedding Cake Serving Calculator"
                    description="Calculate how big your wedding cake needs to be." category="Wedding & Events" />
                <section aria-label="Wedding Cake Calculator"><WeddingCakeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
