import { Metadata } from 'next';
import { MarkdownToHtml } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Markdown to HTML Converter - Free Online Tool',
    description: 'Convert Markdown to HTML with live preview. Supports headers, bold, italic, links, images, code blocks, and lists.',
    keywords: ['markdown to html', 'markdown converter', 'md to html', 'markdown preview', 'markdown editor'],
    alternates: { canonical: '/calculators/productivity/markdown-to-html' },
};

const faqs = [
    {
        question: 'What is Markdown?',
        answer: 'Markdown is a lightweight markup language that uses plain text formatting syntax. It was created to be easy to read and write, and it converts to HTML.'
    },
    {
        question: 'What Markdown syntax is supported?',
        answer: 'This converter supports headers (#), bold (**), italic (*), links, images, code blocks, blockquotes (>), horizontal rules (---), and lists.'
    },
    {
        question: 'Is the generated HTML safe to use?',
        answer: 'Yes, the HTML is escaped to prevent XSS attacks. The output is safe for embedding in web pages.'
    },
];

export default function MarkdownToHtmlPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <ToolPageHeader
                toolId="markdown-to-html"
                title="Markdown to HTML"
                description="Convert Markdown text to HTML with live preview."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Markdown to HTML Tool">
                <MarkdownToHtml />
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
