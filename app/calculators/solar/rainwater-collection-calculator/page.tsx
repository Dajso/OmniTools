import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { RainwaterCollectionCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'Rainwater Collection Calculator - Roof Harvest Estimator',
    description: 'Estimate how much rainwater your roof can collect. Plan your rain barrel or cistern size based on local rainfall data.',
    keywords: ['rainwater collection calculator', 'rain barrel calculator', 'roof rainwater harvest', 'cistern sizing', 'rainwater catchment'],
    alternates: { canonical: '/calculators/solar/rainwater-collection-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Rainwater Collection Calculator', description: 'Estimate how much rainwater your roof can collect.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter roof area', text: 'Calculate your roof collection area in square feet (length × width).' },
    { name: 'Enter annual rainfall', text: 'Look up your average annual rainfall in inches (check NOAA or local data).' },
    { name: 'Set collection efficiency', text: 'Typical efficiency is 80-90% for hard roofs, less for porous materials.' },
    { name: 'Get collection estimate', text: 'See annual and monthly rainwater collection in gallons.' },
];

const faqs = [
    { question: 'How much rainwater can I collect from my roof?', answer: 'Every 1 inch of rain on 1,000 sq ft of roof yields about 620 gallons. A 2,000 sq ft roof in an area with 30 inches of annual rain collects ~37,000 gallons/year.' },
    { question: 'What size rain barrel do I need?', answer: 'A 55-gallon rain barrel fills in under 1 inch of rain from a 100 sq ft downspout area. For serious collection, consider 250-500 gallon tanks or cisterns.' },
    { question: 'Is collected rainwater safe to drink?', answer: 'Not directly. Rainwater needs filtration and UV or chemical treatment before drinking. It is safe for irrigation, toilets, and laundry without treatment.' },
    { question: 'Is rainwater collection legal?', answer: 'Laws vary by state. Most states allow it, but some (like Colorado) have restrictions on the amount. Check your local regulations.' },
];

const relatedTools = [
    { href: '/calculators/solar/solar-panel-tilt-calculator', title: 'Solar Panel Tilt', description: 'Optimize solar panel angle.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Sizing', description: 'Size your off-grid batteries.' },
    { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Off-Grid Runtime', description: 'Calculate backup power runtime.' },
];

export default function RainwaterCollectionCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="rainwater-collection-calculator" title="Rainwater Collection Calculator"
                    description="Estimate how much rainwater your roof can collect." category="Solar & Off-Grid" />
                <section aria-label="Rainwater Collection Calculator"><RainwaterCollectionCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
