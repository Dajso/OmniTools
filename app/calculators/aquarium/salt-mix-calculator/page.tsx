import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SaltMixCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Salt Mix Calculator - Marine & Reef Aquarium Salinity',
    description: 'Calculate salt mix needed for your marine aquarium. Get the right amount for water changes and new tank setups.',
    keywords: ['salt mix calculator', 'marine aquarium salt', 'reef tank salinity', 'saltwater mix ratio', 'specific gravity'],
    alternates: { canonical: '/calculators/aquarium/salt-mix-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Salt Mix Calculator', description: 'Calculate salt mix needed for your marine aquarium.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter water volume', text: 'Input the amount of water you need to mix in gallons or liters.' },
    { name: 'Set target salinity', text: 'Choose your desired salinity or specific gravity (typically 1.025 sg / 35 ppt).' },
    { name: 'Get salt amount', text: 'See exactly how many cups or grams of salt mix to add.' },
    { name: 'Mix and verify', text: 'Mix thoroughly, aerate, and verify with a refractometer before use.' },
];

const faqs = [
    { question: 'What salinity should a reef tank be?', answer: 'Most reef tanks should be maintained at 35 ppt (1.025-1.026 specific gravity). Fish-only tanks can be kept slightly lower at 30-33 ppt.' },
    { question: 'How much salt per gallon of water?', answer: 'Most salt mixes require about ½ cup per gallon to achieve 35 ppt. Exact amounts vary by brand — always measure with a refractometer.' },
    { question: 'Can I use table salt for aquariums?', answer: 'No. Table salt contains anti-caking agents and iodine that can harm marine life. Use only marine aquarium salt mix.' },
    { question: 'How long should I mix saltwater before using it?', answer: 'Mix and aerate for at least 24 hours before adding to your tank. This ensures the salt fully dissolves and stabilizes.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Volume Calculator', description: 'Calculate water volume for mixing.' },
    { href: '/calculators/aquarium/water-change-calculator', title: 'Water Change Calculator', description: 'Plan your water change schedule.' },
    { href: '/calculators/aquarium/heater-wattage-calculator', title: 'Heater Calculator', description: 'Size your heater correctly.' },
];

export default function SaltMixCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="salt-mix-calculator" title="Salt Mix Calculator"
                    description="Calculate salt mix needed for your marine aquarium." category="Aquariums & Terrariums" />
                <section aria-label="Salt Mix Calculator"><SaltMixCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
