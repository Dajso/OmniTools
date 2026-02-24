import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { HeaterWattageCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Aquarium Heater Wattage Calculator - Right Size Heater',
    description: 'Calculate the correct heater wattage for your aquarium based on tank volume and desired temperature rise.',
    keywords: ['aquarium heater calculator', 'heater wattage', 'fish tank heater size', 'aquarium temperature'],
    alternates: { canonical: '/calculators/aquarium/heater-wattage-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Aquarium Heater Wattage Calculator', description: 'Calculate the correct heater size for your aquarium.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank volume', text: 'Input your aquarium size in gallons or liters.' },
    { name: 'Set room temperature', text: 'Enter the average room temperature where the tank is located.' },
    { name: 'Set target temperature', text: 'Choose your desired water temperature for your fish species.' },
    { name: 'Get heater recommendation', text: 'See the recommended wattage and whether one or two heaters are best.' },
];

const faqs = [
    { question: 'How many watts per gallon do I need?', answer: 'A general rule is 3-5 watts per gallon. If the room temperature is much lower than the desired tank temperature, use the higher end.' },
    { question: 'Should I use two heaters?', answer: 'For tanks over 40 gallons, using two smaller heaters provides more even heating and a safety backup if one fails.' },
    { question: 'What temperature do tropical fish need?', answer: 'Most tropical fish thrive at 76-80°F (24-27°C). Check your species requirements for the exact range.' },
    { question: 'Can a heater be too powerful?', answer: 'An oversized heater can overshoot the target temperature if the thermostat fails. Choose one sized appropriately for your tank.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Aquarium Volume Calculator', description: 'Calculate your exact tank volume.' },
    { href: '/calculators/aquarium/stocking-calculator', title: 'Stocking Calculator', description: 'Check appropriate stocking levels.' },
    { href: '/calculators/aquarium/water-change-calculator', title: 'Water Change Calculator', description: 'Plan water changes for your tank.' },
];

export default function HeaterWattageCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="heater-wattage-calculator" title="Aquarium Heater Wattage Calculator"
                    description="Calculate the correct heater size for your aquarium." category="Aquariums & Terrariums" />
                <section aria-label="Heater Wattage Calculator"><HeaterWattageCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
