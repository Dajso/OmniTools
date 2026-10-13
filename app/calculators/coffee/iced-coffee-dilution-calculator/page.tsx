import { Metadata } from 'next';
import { IcedCoffeeDilutionCalculator } from '@/components/calculators/coffee/iced-coffee-dilution-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Iced Coffee Dilution Calculator - Perfect Ice to Coffee Ratio',
    description: 'Calculate the perfect hot coffee and ice amounts for iced coffee. Free dilution calculator that accounts for ice melting to maintain target strength.',
    keywords: ['iced coffee calculator', 'coffee dilution', 'ice to coffee ratio', 'iced coffee recipe', 'cold brew dilution', 'coffee strength calculator'],
    alternates: { canonical: '/calculators/coffee/iced-coffee-dilution-calculator' },
    openGraph: {
        title: 'Iced Coffee Dilution Calculator - Perfect Ice to Coffee Ratio',
        description: 'Calculate the perfect hot coffee and ice amounts for iced coffee.',
        url: '/calculators/coffee/iced-coffee-dilution-calculator',
        siteName: 'OmniTools',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Iced Coffee Dilution Calculator - Perfect Ice to Coffee Ratio',
        description: 'Calculate the perfect hot coffee and ice amounts for iced coffee.',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Iced Coffee Dilution Calculator',
    description: 'Calculate the correct amounts of hot coffee and ice to maintain target strength after dilution',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Set target volume', text: 'Enter your desired final volume of iced coffee in milliliters.' },
    { name: 'Set target TDS', text: 'Enter your desired final strength (TDS) for the iced coffee.' },
    { name: 'Choose ice percentage', text: 'Select how much of the final volume should be ice (30-50% recommended).' },
    { name: 'Review calculations', text: 'See the hot coffee amount and the TDS to brew at.' },
    { name: 'Brew and pour over ice', text: 'Brew coffee at the calculated TDS and pour over ice.' },
];

const faqs = [
    { question: 'How do you calculate iced coffee dilution?', answer: 'Determine your target final volume and ice percentage. The hot coffee amount equals target volume minus ice amount. The brewing TDS is calculated as (Target TDS × Target Volume) / Hot Coffee Amount.' },
    { question: 'What is the best ice to coffee ratio for iced coffee?', answer: 'The ideal ice percentage is typically 30-50% of the final volume. A 40% ice ratio is a great starting point. Avoid exceeding 50% ice as it may result in overly diluted coffee.' },
    { question: 'How strong should I brew coffee for iced coffee?', answer: 'For iced coffee, brew your hot coffee stronger than normal to compensate for ice dilution. This calculator determines the precise brewing TDS needed for your desired final result.' },
    { question: 'Why does my iced coffee taste watery?', answer: 'Iced coffee tastes watery when the hot coffee is not brewed strong enough to compensate for ice dilution. Brew at a higher concentration (higher TDS) than your target final strength.' },
    { question: 'What TDS should I target for iced coffee?', answer: 'For iced coffee, target a final TDS of 1.2-1.4% for balanced flavor. This is slightly lower than hot coffee because cold temperatures reduce perceived bitterness.' },
];

const relatedTools = [
    { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
    { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
    { href: '/calculators/coffee/pour-over-timer', title: 'Pour Over Timer', description: 'Multi-stage timer for pour over brewing.' },
];

export default function IcedCoffeeDilutionCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader
                    toolId="iced-coffee-dilution-calculator"
                    title="Iced Coffee Dilution Calculator"
                    description="Calculate the perfect hot coffee and ice amounts for iced coffee that maintains target strength."
                    colorClass="bg-amber-100 text-amber-700"
                />

                <section aria-label="Iced Coffee Dilution Calculator">
                    <IcedCoffeeDilutionCalculator />
                </section>

                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
