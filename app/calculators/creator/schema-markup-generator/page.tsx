import { Metadata } from 'next';
import { SchemaMarkupGenerator } from '@/components/calculators/creator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Schema Markup Generator - Free JSON-LD Structured Data Tool',
    description: 'Generate JSON-LD schema markup for SEO. Supports Article, FAQ, Product, LocalBusiness, and more. Get rich results in Google Search.',
    keywords: ['schema markup generator', 'JSON-LD generator', 'structured data', 'SEO', 'rich snippets', 'FAQ schema', 'product schema'],
    alternates: { canonical: '/calculators/creator/schema-markup-generator' },
};

const faqs = [
    {
        question: 'What is schema markup?',
        answer: 'Schema markup is structured data that helps search engines understand your content better. It can enable rich results like star ratings, FAQ accordions, and event details in search results.'
    },
    {
        question: 'What is JSON-LD?',
        answer: 'JSON-LD (JavaScript Object Notation for Linked Data) is Google\'s recommended format for structured data. It is embedded in a <script> tag in your page\'s HTML.'
    },
    {
        question: 'Where do I put the schema markup?',
        answer: 'Add the generated <script type="application/ld+json"> tag to the <head> section of your HTML page, or just before the closing </body> tag.'
    },
    {
        question: 'How do I test my schema markup?',
        answer: 'Use Google\'s Rich Results Test (search.google.com/test/rich-results) or Schema Markup Validator (validator.schema.org) to validate your structured data.'
    },
];

export default function SchemaMarkupGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <ToolPageHeader
                toolId="schema-markup-generator"
                title="Schema Markup Generator"
                description="Generate JSON-LD structured data for SEO rich results. Supports Article, FAQ, Product, and more."
                colorClass="bg-indigo-100 text-indigo-700"
            />
            <section aria-label="Schema Markup Generator Tool">
                <SchemaMarkupGenerator />
            </section>

            <section className="mt-12" aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-2xl font-semibold mb-4">About Schema Markup</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        Schema markup helps search engines understand your content better, which can lead to
                        enhanced search results called &quot;rich snippets&quot; or &quot;rich results&quot;. These can include
                        star ratings, FAQ accordions, product prices, event dates, and more.
                    </p>
                    <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">Supported Schema Types</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Article</strong> - Blog posts, news articles, stories</li>
                        <li><strong>FAQ</strong> - Frequently asked questions pages</li>
                        <li><strong>Product</strong> - E-commerce product listings</li>
                        <li><strong>LocalBusiness</strong> - Physical store or service location</li>
                        <li><strong>HowTo</strong> - Step-by-step tutorials and guides</li>
                        <li><strong>Event</strong> - Events, concerts, conferences</li>
                        <li><strong>Organization</strong> - Company or brand information</li>
                        <li><strong>Person</strong> - Personal profile or author info</li>
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
