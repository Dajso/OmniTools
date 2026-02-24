import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { FertilizerDosingCalculator } from '@/components/calculators/aquarium';

export const metadata: Metadata = {
    title: 'Fertilizer Dosing Calculator - EI Method for Planted Tanks',
    description: 'Calculate EI (Estimative Index) method fertilizer dosing for planted aquariums. Get precise macro and micro nutrient dosages.',
    keywords: ['fertilizer dosing calculator', 'EI method', 'planted tank fertilizer', 'aquarium nutrients', 'KNO3 dosing'],
    alternates: { canonical: '/calculators/aquarium/fertilizer-dosing-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Fertilizer Dosing Calculator', description: 'Calculate EI method fertilizer dosing for planted tanks.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter tank volume', text: 'Input your aquarium volume in gallons or liters.' },
    { name: 'Select dosing method', text: 'Choose EI (Estimative Index) or lean dosing for your plant load.' },
    { name: 'Review macro dosages', text: 'See recommended KNO3, KH2PO4, and K2SO4 amounts per dose.' },
    { name: 'Review micro dosages', text: 'Get trace element mix dosing recommendations.' },
];

const faqs = [
    { question: 'What is the EI dosing method?', answer: 'EI (Estimative Index) provides excess nutrients so plants always have what they need. Weekly 50% water changes reset nutrient levels to prevent buildup.' },
    { question: 'How often should I dose fertilizers?', answer: 'EI method alternates macros and micros on different days: macros on Mon/Wed/Fri, micros on Tue/Thu/Sat, rest and water change on Sunday.' },
    { question: 'Can I overdose fertilizers?', answer: 'With EI method and regular water changes, slight overdosing is safe. Without water changes, nutrients can reach harmful levels.' },
    { question: 'Do I need CO2 with fertilizers?', answer: 'CO2 injection maximizes the benefit of fertilizers in high-light tanks. Low-tech tanks should use lean dosing without CO2.' },
];

const relatedTools = [
    { href: '/calculators/aquarium/co2-bubble-calculator', title: 'CO₂ Bubble Calculator', description: 'Calculate CO2 levels for plants.' },
    { href: '/calculators/aquarium/par-estimator', title: 'PAR Estimator', description: 'Estimate light levels at substrate.' },
    { href: '/calculators/aquarium/aquarium-volume-calculator', title: 'Volume Calculator', description: 'Calculate your tank volume.' },
];

export default function FertilizerDosingCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="fertilizer-dosing-calculator" title="Fertilizer Dosing Calculator"
                    description="Calculate EI method fertilizer dosing for planted tanks." category="Aquariums & Terrariums" />
                <section aria-label="Fertilizer Dosing Calculator"><FertilizerDosingCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
