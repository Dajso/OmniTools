import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { SunPeakHoursCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Sun Peak Hours Calculator - Solar Irradiance Estimator',
    description: 'Estimate peak sun hours for your location to size solar systems accurately. Essential for off-grid and residential solar planning.',
    keywords: ['peak sun hours', 'solar irradiance', 'sun hours calculator', 'solar insolation', 'kWh per day solar'],
    alternates: { canonical: '/calculators/solar/sun-peak-hours-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Sun Peak Hours Calculator', description: 'Estimate peak sun hours for your location.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter your latitude', text: 'Input your latitude to estimate solar irradiance for your location.' },
    { name: 'Select the month', text: 'Choose a specific month or view annual average.' },
    { name: 'Review peak sun hours', text: 'See estimated peak sun hours (PSH) per day for your location.' },
    { name: 'Use for system sizing', text: 'Multiply PSH × panel kW to estimate daily kWh production.' },
];

const faqs = [
    { question: 'What are peak sun hours?', answer: 'Peak sun hours (PSH) represent hours of 1,000 W/m² solar irradiance. 5 PSH means total daily solar energy equals 5 hours at full sun intensity.' },
    { question: 'How many peak sun hours does my area get?', answer: 'The US Southwest averages 6-7 PSH. The Northeast averages 3-4 PSH. Our calculator estimates based on your latitude and season.' },
    { question: 'Does cloudy weather reduce peak sun hours?', answer: 'Yes, significantly. Overcast days may produce only 10-25% of clear-day irradiance. Annual averages already account for typical weather patterns.' },
    { question: 'How do peak sun hours affect solar panel sizing?', answer: 'Fewer PSH means you need more panels. Example: 30 kWh/day ÷ 5 PSH = 6 kW system. With 4 PSH, you need a 7.5 kW system.' },
];

const relatedTools = [
    { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Panel Tilt Calculator', description: 'Optimize panel angle for your location.' },
    { href: '/calculators/solar/solar-roi-calculator', title: 'Solar ROI Calculator', description: 'Calculate your investment return.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size batteries for your system.' },
];

export default function SunPeakHoursCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="sun-peak-hours-calculator" title="Sun Peak Hours Calculator"
                    description="Estimate peak sun hours for your location." category="Solar & Off-Grid" />
                <section aria-label="Sun Peak Hours Calculator"><SunPeakHoursCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
