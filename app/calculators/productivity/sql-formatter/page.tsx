import { Metadata } from 'next';
import { SQLFormatter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'SQL Formatter - Free Online SQL Beautifier',
    description: 'Format and beautify SQL queries with proper indentation. Supports MySQL, PostgreSQL, SQLite, and standard SQL.',
    keywords: ['SQL formatter', 'SQL beautifier', 'format SQL', 'SQL pretty print', 'SQL indent'],
    alternates: { canonical: '/calculators/productivity/sql-formatter' },
};

const faqs = [
    {
        question: 'What SQL dialects are supported?',
        answer: 'The formatter supports Standard SQL, MySQL, PostgreSQL, and SQLite syntax. The formatting is generally compatible across dialects.'
    },
    {
        question: 'Does this validate my SQL?',
        answer: 'No, this tool only formats the SQL for readability. It does not validate syntax or execute queries. Use your database client to validate.'
    },
    {
        question: 'Is my SQL data secure?',
        answer: 'Yes, all formatting happens in your browser. Your SQL is never sent to any server.'
    },
];

export default function SQLFormatterPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <ToolPageHeader
                toolId="sql-formatter"
                title="SQL Formatter"
                description="Format and beautify SQL queries with proper indentation and keyword styling."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="SQL Formatter Tool">
                <SQLFormatter />
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
