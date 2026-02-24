import { Metadata } from 'next';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { DCWireGaugeCalculator } from '@/components/calculators/solar';

export const metadata: Metadata = {
    title: 'DC Wire Gauge Calculator - Solar & Off-Grid Wire Sizing',
    description: 'Find the right wire gauge for your DC circuit. Calculate voltage drop and recommended AWG for solar, RV, and marine wiring.',
    keywords: ['DC wire gauge calculator', 'wire size calculator', 'AWG calculator', 'voltage drop', 'solar wire sizing'],
    alternates: { canonical: '/calculators/solar/dc-wire-gauge-calculator' },
};

const structuredData = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'DC Wire Gauge Calculator', description: 'Find the right wire gauge for your DC circuit.',
    applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
    { name: 'Enter current (amps)', text: 'Input the maximum current your circuit will carry.' },
    { name: 'Enter wire length', text: 'Measure the one-way wire run distance in feet.' },
    { name: 'Set acceptable voltage drop', text: 'Choose maximum voltage drop — typically 3% for power lines, 5% for lighting.' },
    { name: 'Get recommended gauge', text: 'See the minimum AWG wire gauge to keep voltage drop within limits.' },
];

const faqs = [
    { question: 'What voltage drop is acceptable for solar?', answer: '3% maximum for main power runs (panels to controller, controller to batteries). Up to 5% for branch circuits and lighting.' },
    { question: 'Why is wire gauge important for DC?', answer: 'DC systems run at lower voltages than AC, so the same wattage requires more current. Higher current needs thicker wire to avoid dangerous overheating.' },
    { question: 'What AWG for 30 amps at 12V?', answer: 'For a 10-foot run at 3% drop: 6 AWG. For longer runs, you need even thicker wire. Always check with this calculator for your exact setup.' },
    { question: 'Can I use AC wire for DC circuits?', answer: 'Yes, standard copper THHN/THWN wire works for DC. The gauge requirements are calculated the same way based on current and distance.' },
];

const relatedTools = [
    { href: '/calculators/solar/dc-power-calculator', title: 'DC Power Calculator', description: 'Calculate watts, amps, and volts.' },
    { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Battery Bank Sizing', description: 'Size your battery bank.' },
    { href: '/calculators/solar/inverter-size-calculator', title: 'Inverter Size Calculator', description: 'Size your inverter.' },
];

export default function DCWireGaugeCalculatorPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <ToolPageHeader toolId="dc-wire-gauge-calculator" title="DC Wire Gauge Calculator"
                    description="Find the right wire gauge for your DC circuit." category="Solar & Off-Grid" />
                <section aria-label="DC Wire Gauge Calculator"><DCWireGaugeCalculator /></section>
                <HowToSection steps={howToSteps} />
                <FAQSection faqs={faqs} />
                <RelatedToolsSection tools={relatedTools} />
            </main>
        </>
    );
}
