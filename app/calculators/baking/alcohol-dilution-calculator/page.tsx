import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { AlcoholDilutionCalculator } from '@/components/calculators/baking';

export const metadata: Metadata = {
    title: 'Alcohol Dilution Calculator - Proof & ABV Adjustment',
    description: 'Calculate how much water to add to dilute spirits to a target proof or ABV. Essential for homebrewing and mixology.',
    keywords: ['alcohol dilution calculator', 'proof calculator', 'ABV calculator', 'dilute spirits', 'water to add alcohol'],
    alternates: { canonical: '/calculators/baking/alcohol-dilution-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Alcohol Dilution Calculator', description: 'Dilute spirits to a target proof or ABV.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter current strength', text: 'Input the current alcohol percentage (ABV) or proof of your spirit.' },
    { name: 'Enter volume', text: 'Input the volume of spirit you want to dilute.' },
    { name: 'Set target strength', text: 'Enter your desired ABV or proof.' },
    { name: 'Get water amount', text: 'See exactly how much water to add for dilution.' },
];

const faqs = [
    { question: 'How do I dilute 190 proof to 80 proof?', answer: 'For 1 liter of 190 proof (95% ABV) spirit, add approximately 1.375 liters of water to reach 80 proof (40% ABV). Use our calculator for exact amounts.' },
    { question: 'What is the difference between proof and ABV?', answer: 'In the US, proof is double the ABV. 80 proof = 40% ABV. In the UK, historical proof is different — use ABV for clarity.' },
    { question: 'Does water type matter for dilution?', answer: 'Use distilled or filtered water for best results. Tap water minerals can affect flavor and clarity, especially in clear spirits.' },
    { question: 'Why does diluted spirit become cloudy?', answer: 'Some compounds are soluble in alcohol but not water. Dilution can cause louching (cloudiness). This is normal and harmless.' },
];

const relatedTools = [
    { href: '/calculators/baking/brine-calculator', title: 'Brine Calculator', description: 'Calculate salt-water ratios.' },
    { href: '/calculators/baking/unit-cost-per-serving', title: 'Cost Per Serving', description: 'Calculate costs per serving.' },
    { href: '/calculators/baking/chocolate-tempering-calculator', title: 'Chocolate Tempering', description: 'Temper chocolate perfectly.' },
];

export default function AlcoholDilutionPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="alcohol-dilution-calculator" title="Alcohol Dilution Calculator"
                    description="Dilute spirits to a target proof or ABV." category="Baking & Food Science" />
                <section aria-label="Alcohol Dilution Calculator"><AlcoholDilutionCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
