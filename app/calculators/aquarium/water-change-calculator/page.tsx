import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { WaterChangeCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Water Change Calculator - Aquarium Dilution & Schedule',
    description: 'Calculate how water changes reduce pollutant concentrations in your aquarium. Plan optimal water change schedules.',
    keywords: ['water change calculator', 'aquarium water change', 'nitrate dilution', 'aquarium maintenance'],
    alternates: { canonical: '/calculators/aquarium/water-change-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Water Change Calculator', description: 'Calculate how water changes reduce concentrations in your aquarium.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank volume', text: 'Input your aquarium water volume in gallons or liters.' },
    { name: 'Set current levels', text: 'Enter the current nitrate or pollutant concentration (ppm).' },
    { name: 'Choose change percentage', text: 'Select how much water you plan to change (e.g., 25%, 50%).' },
    { name: 'See the results', text: 'View the new concentration after the water change and plan your schedule.' },
];

const faqs = [
    { question: 'How often should I change aquarium water?', answer: 'Most tanks benefit from 25-30% weekly water changes. Heavily stocked tanks may need more frequent changes.' },
    { question: 'Is a 50% water change safe?', answer: 'Yes, as long as the replacement water matches temperature and pH. Large changes are sometimes needed for high nitrate levels.' },
    { question: 'What nitrate level is too high?', answer: 'Keep nitrates below 40 ppm for most freshwater fish, and below 20 ppm for sensitive species or planted tanks.' },
    { question: 'Does dechlorinator affect water changes?', answer: 'Always use dechlorinator when adding tap water. It neutralizes chlorine and chloramine that are harmful to fish.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Aquarium Volume Calculator', description: 'Calculate your exact tank volume.' },
    { href: '/calculators/aquarium/stocking-calculator', title: 'Stocking Calculator', description: 'Check your stocking level.' },
    { href: '/calculators/aquarium/medicine-dosage-calculator', title: 'Medicine Dosage Calculator', description: 'Dose medications accurately.' },
];

export default function WaterChangeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="water-change-calculator" title="Water Change Calculator"
                    description="Calculate how water changes reduce concentrations in your aquarium." category="Aquariums & Terrariums" />
                <section aria-label="Water Change Calculator"><WaterChangeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
