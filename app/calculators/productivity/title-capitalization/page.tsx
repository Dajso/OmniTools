import { Metadata } from 'next';
import { TitleCapitalization } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Title Capitalization Tool - Free Title Case Converter',
    description: 'Convert text to title case, sentence case, uppercase, lowercase, and more. AP/Chicago style capitalization for headlines and titles.',
    keywords: ['title case converter', 'capitalization tool', 'title capitalization', 'headline case', 'sentence case'],
    alternates: { canonical: '/calculators/productivity/title-capitalization' },
};

const faqs = [
    {
        question: 'What is title case?',
        answer: 'Title case capitalizes the first letter of major words while keeping minor words (a, an, the, and, but, or, etc.) in lowercase, except when they are the first or last word.'
    },
    {
        question: 'What words should not be capitalized in title case?',
        answer: 'Articles (a, an, the), coordinating conjunctions (and, but, or, nor, for, yet, so), and short prepositions (at, by, in, of, on, to, up, as) are typically lowercase unless they start or end the title.'
    },
    {
        question: 'What is sentence case?',
        answer: 'Sentence case capitalizes only the first word of a sentence and proper nouns. It is the standard for body text and many online headlines.'
    },
];

export default function TitleCapitalizationPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="title-capitalization"
                title="Title Capitalization Tool"
                description="Convert text to various capitalization styles including AP/Chicago title case."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Title Capitalization Tool">
                <TitleCapitalization />
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
