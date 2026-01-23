import { Metadata } from 'next';
import { BrewRatioCalculator } from '@/components/calculators/coffee/brew-ratio-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Brew Ratio Calculator - Coffee to Water Ratio Calculator',
    description: 'Calculate the perfect water amount for your coffee brew ratio. Free brew ratio calculator with strength profiles for pour over, French press, and drip coffee.',
    keywords: ['brew ratio calculator', 'coffee ratio', 'coffee to water ratio', 'pour over ratio', 'French press ratio', 'coffee strength'],
    alternates: { canonical: '/calculators/coffee/brew-ratio-calculator' },
    openGraph: {
        title: 'Brew Ratio Calculator - Coffee to Water Ratio Calculator',
        description: 'Calculate the perfect water amount for your coffee brew ratio. Free brew ratio calculator with strength profiles.',
        url: '/calculators/coffee/brew-ratio-calculator',
        siteName: 'OmniTools',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Brew Ratio Calculator - Coffee to Water Ratio Calculator',
        description: 'Calculate the perfect water amount for your coffee brew ratio.',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Brew Ratio Calculator',
    description: 'Calculate the water amount needed for your desired brew ratio to maintain consistent coffee strength',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter coffee dose', text: 'Input the amount of coffee grounds you plan to use in grams.' },
    { name: 'Select brew ratio', text: 'Choose your desired ratio (1:15 for strong, 1:16 for balanced, 1:17 for mild).' },
    { name: 'View water amount', text: 'See the calculated water amount needed for your brew.' },
    { name: 'Check strength profile', text: 'Review the strength profile to ensure it matches your preference.' },
    { name: 'Start brewing', text: 'Use the calculated amounts for consistent, delicious coffee.' },
];

const faqs = [
    { question: 'What is a coffee brew ratio?', answer: 'A coffee brew ratio is the relationship between the amount of coffee grounds and water used in brewing, typically expressed as 1:X (e.g., 1:16). This means for every 1 gram of coffee, you use X grams of water.' },
    { question: 'What is the best brew ratio for coffee?', answer: 'The ideal brew ratio depends on your preference. A balanced ratio of 1:15 to 1:17 works well for most pour over and drip coffee. Stronger ratios (1:12 to 1:15) are common for concentrated brews, while milder ratios (1:17 to 1:20) produce lighter coffee.' },
    { question: 'How do I calculate water amount from brew ratio?', answer: 'Multiply your coffee dose by the ratio number. For example, with 20g of coffee and a 1:16 ratio, you need 20 × 16 = 320g (or ml) of water.' },
    { question: 'What brew ratio should I use for pour over coffee?', answer: 'For pour over coffee, a ratio between 1:15 and 1:17 is recommended. A 1:16 ratio is a great starting point that produces balanced, flavorful coffee.' },
    { question: 'Does brew ratio affect coffee strength?', answer: 'Yes, brew ratio is one of the primary factors affecting coffee strength. Lower ratios produce stronger coffee, while higher ratios produce milder, lighter coffee.' },
];

const relatedTools = [
    { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction yield from TDS measurements.' },
    { href: '/calculators/coffee/pour-over-timer', title: 'Pour Over Timer', description: 'Multi-stage timer with 4:6 method.' },
    { href: '/calculators/coffee/grind-size-converter', title: 'Grind Size Converter', description: 'Convert grind settings between grinders.' },
];

export default function BrewRatioCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader
                    toolId="brew-ratio-calculator"
                    title="Brew Ratio Calculator"
                    description="Calculate the perfect water amount for your coffee brew ratio with strength profiles."
                    colorClass="bg-amber-100 text-amber-700"
                    category="Coffee"
                />

                <section aria-label="Brew Ratio Calculator">
                    <BrewRatioCalculator />
                </section>

                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
