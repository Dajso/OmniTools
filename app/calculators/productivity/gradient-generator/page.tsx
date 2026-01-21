import { Metadata } from 'next';
import { GradientGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'CSS Gradient Generator - Free Linear & Radial Gradient Tool',
    description: 'Create beautiful CSS gradients with live preview. Generate linear and radial gradients with multiple color stops and copy ready-to-use CSS code.',
    keywords: ['gradient generator', 'CSS gradient', 'linear gradient', 'radial gradient', 'gradient maker', 'color gradient'],
    alternates: { canonical: '/calculators/productivity/gradient-generator' },
};

const faqs = [
    {
        question: 'What is a CSS gradient?',
        answer: 'A CSS gradient is a smooth transition between two or more colors. They are defined using functions like linear-gradient() and radial-gradient() and used as background images.'
    },
    {
        question: 'What is the difference between linear and radial gradients?',
        answer: 'Linear gradients transition colors along a straight line at a specified angle. Radial gradients transition colors from a center point outward in a circular or elliptical shape.'
    },
    {
        question: 'What are color stops?',
        answer: 'Color stops define the colors in a gradient and their positions. You can have multiple color stops to create complex multi-color gradients.'
    },
];

export default function GradientGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="gradient-generator"
                title="CSS Gradient Generator"
                description="Create beautiful linear and radial CSS gradients with live preview."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Gradient Generator Tool">
                <GradientGenerator />
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
