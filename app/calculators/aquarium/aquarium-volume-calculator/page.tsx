import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { AquariumVolumeCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Aquarium Volume Calculator - Tank Size in Gallons & Liters',
    description: 'Calculate aquarium volume for rectangular, cylindrical, and bow-front tanks. Get results in gallons, liters, and cubic inches instantly.',
    keywords: ['aquarium volume calculator', 'fish tank size', 'tank gallons', 'aquarium liters', 'bow front tank volume'],
    alternates: { canonical: '/calculators/aquarium/aquarium-volume-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Aquarium Volume Calculator',
    description: 'Calculate aquarium water volume for rectangular, cylindrical, and bow-front tank shapes.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Select tank shape', text: 'Choose rectangular, cylindrical, or bow-front from the shape selector.' },
    { name: 'Enter dimensions', text: 'Measure and enter the length, width, and height of your tank in inches or centimeters.' },
    { name: 'Review the results', text: 'Instantly see the volume in gallons, liters, and cubic inches.' },
    { name: 'Plan your stocking', text: 'Use the volume to determine appropriate fish stocking levels and equipment sizing.' },
];

const faqs = [
    { question: 'How do I calculate the volume of my aquarium?', answer: 'For rectangular tanks, multiply length × width × height and divide by 231 to get US gallons. Our calculator handles this and other shapes automatically.' },
    { question: 'What is a bow-front aquarium?', answer: 'A bow-front aquarium has a curved front glass panel that adds extra volume compared to a standard rectangular tank of the same footprint.' },
    { question: 'How many gallons is a 20×10×12 tank?', answer: 'A rectangular tank measuring 20×10×12 inches holds approximately 10.4 US gallons (39.3 liters) of water.' },
    { question: 'Should I account for substrate and decorations?', answer: 'Yes, subtract about 10% from the calculated volume if you have a thick substrate layer and large decorations.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/stocking-calculator', title: 'Stocking Calculator', description: 'Check if your fish load is safe for your tank.' },
    { href: '/calculators/aquarium/heater-wattage-calculator', title: 'Heater Wattage Calculator', description: 'Find the right heater for your tank volume.' },
    { href: '/calculators/aquarium/substrate-calculator', title: 'Substrate Calculator', description: 'Calculate how much substrate you need.' },
];

export default function AquariumVolumeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="aquarium-volume-calculator" title="Aquarium Volume Calculator"
                    description="Calculate aquarium volume for rectangular, cylindrical, and bow-front tank shapes." category="Aquariums & Terrariums" />
                <section aria-label="Aquarium Volume Calculator"><AquariumVolumeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
