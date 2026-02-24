import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { PAREstimatorCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'PAR Estimator - Aquarium Light Level Calculator',
    description: 'Estimate PAR (Photosynthetically Active Radiation) at substrate depth in your aquarium for optimal plant growth.',
    keywords: ['PAR estimator', 'aquarium light calculator', 'planted tank lighting', 'PAR at depth', 'aquarium PAR'],
    alternates: { canonical: '/calculators/aquarium/par-estimator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'PAR Estimator', description: 'Estimate PAR at substrate depth in your aquarium.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter light specifications', text: 'Input your light fixture wattage and type (LED, T5, etc.).' },
    { name: 'Enter tank depth', text: 'Measure the distance from the light to the substrate in inches.' },
    { name: 'Review PAR estimate', text: 'See the estimated PAR value at substrate level.' },
    { name: 'Match to plant needs', text: 'Low light plants need 20-40 PAR, medium 40-80, high light 80+ PAR.' },
];

const faqs = [
    { question: 'What PAR do aquarium plants need?', answer: 'Low light plants (Anubias, Java fern): 20-40 PAR. Medium (Amazon sword, Crypts): 40-80 PAR. High (carpet plants, red plants): 80-150+ PAR.' },
    { question: 'Does water depth affect PAR?', answer: 'Yes, water absorbs light significantly. PAR drops roughly 50% for every 12 inches of water depth.' },
    { question: 'How do I measure PAR in my tank?', answer: 'Use a PAR meter (like Apogee MQ-500) if available. Otherwise, this estimator provides a reasonable approximation.' },
    { question: 'More PAR means more algae?', answer: 'High PAR without adequate CO2 and nutrients can fuel algae growth. Balance all three factors for best results.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/co2-bubble-calculator', title: 'CO₂ Bubble Calculator', description: 'Balance CO2 with your lighting.' },
    { href: '/calculators/aquarium/fertilizer-dosing-calculator', title: 'Fertilizer Dosing', description: 'Match nutrients to light levels.' },
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Volume Calculator', description: 'Calculate your tank volume.' },
];

export default function PAREstimatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="par-estimator" title="PAR Estimator"
                    description="Estimate PAR at substrate depth in your aquarium." category="Aquariums & Terrariums" />
                <section aria-label="PAR Estimator"><PAREstimatorCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
