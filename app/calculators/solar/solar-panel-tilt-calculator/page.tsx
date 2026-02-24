import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SolarPanelTiltCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Solar Panel Tilt Angle Calculator - Optimize Solar Output',
    description: 'Calculate the optimal tilt angle for solar panels based on your latitude and season to maximize energy production.',
    keywords: ['solar panel tilt angle', 'solar panel angle calculator', 'optimal tilt', 'solar panel orientation', 'latitude angle'],
    alternates: { canonical: '/calculators/solar/solar-panel-tilt-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Solar Panel Tilt Angle Calculator', description: 'Calculate the optimal tilt angle for solar panels.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter your latitude', text: 'Input your location latitude (find it using Google Maps).' },
    { name: 'Select the season', text: 'Choose the season or month for seasonal angle optimization.' },
    { name: 'Get optimal angle', text: 'See the recommended tilt angle for maximum solar energy capture.' },
    { name: 'Adjust your panels', text: 'Set your panels to the recommended angle for peak output.' },
];

const faqs = [
    { question: 'What is the best angle for solar panels?', answer: 'A good starting point is your latitude angle. For year-round fixed panels, set the tilt equal to your latitude. Seasonal adjustment can increase output by 10-25%.' },
    { question: 'Should solar panels face south?', answer: 'In the Northern Hemisphere, panels should face true south (not magnetic south). In the Southern Hemisphere, face them true north.' },
    { question: 'Does the tilt angle change by season?', answer: 'Yes. Steeper angles (latitude + 15°) work best in winter when the sun is low. Shallower (latitude - 15°) is better in summer.' },
    { question: 'What if my roof angle is fixed?', answer: 'Most residential roofs (20-40°) work well enough. The energy difference between optimal and a typical roof angle is usually 5-15%.' },
];

const relatedTools = [
    { href: '/calculators/solar/solar-roi-calculator', title: 'Solar ROI Calculator', description: 'Calculate your solar investment return.' },
    { href: '/calculators/solar/sun-peak-hours-calculator', title: 'Sun Peak Hours', description: 'Estimate peak sun hours for your area.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery storage system.' },
];

export default function SolarPanelTiltCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="solar-panel-tilt-calculator" title="Solar Panel Tilt Angle Calculator"
                    description="Calculate the optimal tilt angle for your solar panels." category="Solar & Off-Grid" />
                <section aria-label="Solar Panel Tilt Calculator"><SolarPanelTiltCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
