import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { MedicineDosageCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Aquarium Medicine Dosage Calculator - Fish Medication Dosing',
    description: 'Calculate accurate aquarium medication dosing based on tank volume. Prevent over-dosing and under-dosing fish medications.',
    keywords: ['aquarium medicine calculator', 'fish medication dosing', 'aquarium treatment', 'ich medication dose'],
    alternates: { canonical: '/calculators/aquarium/medicine-dosage-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Aquarium Medicine Dosage Calculator', description: 'Calculate aquarium medication dosing based on tank volume.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank volume', text: 'Input your actual water volume (subtract for substrate and decorations).' },
    { name: 'Select medication', text: 'Choose the medication type or enter a custom dosing rate.' },
    { name: 'Get dosage', text: 'See the exact amount to add in mL or drops for your tank.' },
    { name: 'Follow schedule', text: 'Note the recommended treatment duration and re-dosing intervals.' },
];

const faqs = [
    { question: 'Should I use actual water volume or tank size?', answer: 'Use actual water volume, which is typically 10-15% less than the rated tank size due to substrate, rocks, and decorations.' },
    { question: 'Can I overdose aquarium medication?', answer: 'Yes, overdosing can stress or kill fish and beneficial bacteria. Always measure carefully and follow dosing instructions.' },
    { question: 'Should I remove activated carbon during treatment?', answer: 'Yes, activated carbon absorbs most medications and reduces their effectiveness. Remove it before treatment and replace it after.' },
    { question: 'Do I need to treat the whole tank or just sick fish?', answer: 'For contagious diseases like ich, treat the entire tank. For localized issues, a quarantine tank may be better.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Volume Calculator', description: 'Calculate exact water volume.' },
    { href: '/calculators/aquarium/water-change-calculator', title: 'Water Change Calculator', description: 'Plan post-treatment water changes.' },
    { href: '/calculators/aquarium/salt-mix-calculator', title: 'Salt Mix Calculator', description: 'Calculate salt for treatments.' },
];

export default function MedicineDosageCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="medicine-dosage-calculator" title="Aquarium Medicine Dosage Calculator"
                    description="Calculate aquarium medication dosing based on tank volume." category="Aquariums & Terrariums" />
                <section aria-label="Medicine Dosage Calculator"><MedicineDosageCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
