import { Metadata } from 'next';
import { BoxShadowGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'CSS Box Shadow Generator - Free Shadow Generator Tool',
    description: 'Create CSS box shadows with multiple layers, inset options, and live preview. Copy ready-to-use CSS code.',
    keywords: ['box shadow generator', 'CSS shadow', 'drop shadow', 'box-shadow', 'shadow effect', 'CSS generator'],
    alternates: { canonical: '/calculators/productivity/box-shadow-generator' },
};

const faqs = [
    {
        question: 'What is box-shadow in CSS?',
        answer: 'The CSS box-shadow property adds shadow effects around an element\'s frame. You can set multiple effects separated by commas.'
    },
    {
        question: 'What do the box-shadow values mean?',
        answer: 'The values are: offset-x, offset-y, blur-radius, spread-radius, and color. Optional "inset" keyword creates an inner shadow.'
    },
    {
        question: 'Can I have multiple shadows?',
        answer: 'Yes! You can layer multiple shadows by separating them with commas. This is great for creating depth and elevation effects.'
    },
];

export default function BoxShadowGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="box-shadow-generator"
                title="CSS Box Shadow Generator"
                description="Create beautiful CSS box shadows with multiple layers and live preview."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Box Shadow Generator Tool">
                <BoxShadowGenerator />
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
