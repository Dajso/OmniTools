import { Metadata } from 'next';
import { ColorBlindnessSimulator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Color Blindness Simulator - Free Accessibility Tool',
    description: 'Simulate how colors appear to people with color blindness. Test your designs for deuteranopia, protanopia, tritanopia, and more.',
    keywords: ['color blindness simulator', 'accessibility', 'color vision', 'deuteranopia', 'protanopia', 'colorblind test'],
    alternates: { canonical: '/calculators/productivity/color-blindness-simulator' },
};

const faqs = [
    {
        question: 'What is color blindness?',
        answer: 'Color blindness (color vision deficiency) is the decreased ability to see colors or differences between colors. It affects about 8% of men and 0.5% of women of Northern European ancestry.'
    },
    {
        question: 'What are the most common types?',
        answer: 'Deuteranomaly (green-weak) is the most common, affecting about 5% of males. Protanomaly (red-weak) and deuteranopia (green-blind) each affect about 1% of males.'
    },
    {
        question: 'How can I make my designs accessible?',
        answer: 'Don\'t rely solely on color to convey information. Use patterns, labels, or icons alongside colors. Ensure sufficient contrast ratios (use our Contrast Checker tool).'
    },
    {
        question: 'Is this simulation accurate?',
        answer: 'This is a mathematical approximation. Actual perception varies between individuals. Use it as a guide, not as a definitive representation of color vision deficiency.'
    },
];

export default function ColorBlindnessSimulatorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="color-blindness-simulator"
                title="Color Blindness Simulator"
                description="Simulate how colors appear to people with different types of color vision deficiency."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Color Blindness Simulator Tool">
                <ColorBlindnessSimulator />
            </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b pb-6 last:border-b-0">
                            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
