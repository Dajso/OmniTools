import { Metadata } from 'next';
import { ContrastChecker } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Contrast Checker - WCAG Accessibility Color Contrast Tool',
    description: 'Check color contrast ratio for WCAG 2.1 AA/AAA accessibility compliance. Free tool to test text and background color combinations for web accessibility.',
    keywords: ['contrast checker', 'WCAG', 'accessibility', 'color contrast', 'ADA compliance', 'AA', 'AAA', 'web accessibility'],
    alternates: { canonical: '/calculators/productivity/contrast-checker' },
};

const faqs = [
    {
        question: 'What is WCAG contrast?',
        answer: 'WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text and background colors to ensure readability for users with visual impairments.'
    },
    {
        question: 'What is the difference between AA and AAA?',
        answer: 'AA is the minimum standard, requiring 4.5:1 for normal text and 3:1 for large text. AAA is enhanced, requiring 7:1 for normal text and 4.5:1 for large text.'
    },
    {
        question: 'What counts as large text?',
        answer: 'Large text is defined as 18pt (24px) or larger, or 14pt (18.67px) bold or larger.'
    },
    {
        question: 'Why is color contrast important?',
        answer: 'Good contrast ensures that text is readable by people with low vision, color blindness, or those viewing in bright sunlight. It is also a legal requirement under ADA and Section 508.'
    },
];

export default function ContrastCheckerPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="contrast-checker"
                title="Contrast Checker (WCAG)"
                description="Check color contrast ratio for WCAG 2.1 AA/AAA accessibility compliance. Essential for ADA and web accessibility requirements."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Contrast Checker Tool">
                <ContrastChecker />
            </section>

            <section className="mt-12" aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-2xl font-semibold mb-4">About WCAG Contrast Requirements</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        The Web Content Accessibility Guidelines (WCAG) 2.1 set minimum contrast ratios to ensure
                        text is readable by users with visual impairments. These guidelines are legally required
                        in many jurisdictions under laws like the Americans with Disabilities Act (ADA).
                    </p>
                    <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">Contrast Ratio Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Normal Text:</strong> 4.5:1 for AA, 7:1 for AAA</li>
                        <li><strong>Large Text:</strong> 3:1 for AA, 4.5:1 for AAA</li>
                        <li><strong>UI Components:</strong> 3:1 for AA</li>
                    </ul>
                </div>
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
