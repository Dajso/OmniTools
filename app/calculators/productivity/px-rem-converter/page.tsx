import { Metadata } from 'next';
import { PxRemConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Px to Rem Converter - Free CSS Unit Converter',
    description: 'Convert between pixels (px) and rem units for responsive CSS. Includes conversion table and support for custom base font sizes.',
    keywords: ['px to rem', 'rem to px', 'CSS converter', 'responsive design', 'font size', 'CSS units'],
    alternates: { canonical: '/calculators/productivity/px-rem-converter' },
};

const faqs = [
    {
        question: 'What is the difference between px, rem, and em?',
        answer: 'px (pixels) is a fixed unit. rem is relative to the root (html) font size. em is relative to the parent element\'s font size. rem is preferred for consistent scaling across the site.'
    },
    {
        question: 'What should my base font size be?',
        answer: 'The browser default is 16px, which is the most common base. Some developers use 10px for easier math (1rem = 10px), set via html { font-size: 62.5%; }.'
    },
    {
        question: 'Why use rem instead of px?',
        answer: 'rem units scale with user preferences for text size (accessibility), enable global scaling by changing the root font size, and make responsive design easier.'
    },
    {
        question: 'How do I set the base font size in CSS?',
        answer: 'Set it on the html element: html { font-size: 16px; } or use a percentage like html { font-size: 100%; } to respect user preferences.'
    },
];

export default function PxRemConverterPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="px-rem-converter"
                title="Px to Rem Converter"
                description="Convert between pixels and rem units for responsive CSS design."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Px to Rem Converter Tool">
                <PxRemConverter />
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
