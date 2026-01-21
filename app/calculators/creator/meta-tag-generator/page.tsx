import { Metadata } from 'next';
import { MetaTagGenerator } from '@/components/calculators/creator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Meta Tag Generator - Free SEO Meta Tags Tool',
    description: 'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Create optimized meta tags for better search engine visibility and social sharing.',
    keywords: ['meta tag generator', 'SEO tags', 'Open Graph', 'Twitter Card', 'meta description', 'og tags'],
    alternates: { canonical: '/calculators/creator/meta-tag-generator' },
};

const faqs = [
    {
        question: 'What are meta tags?',
        answer: 'Meta tags are HTML elements that provide metadata about a web page. They help search engines understand your content and control how your page appears in search results and social media.'
    },
    {
        question: 'What is Open Graph?',
        answer: 'Open Graph is a protocol created by Facebook that controls how URLs are displayed when shared on social media. It defines the title, description, and image that appear in the preview.'
    },
    {
        question: 'What is a Twitter Card?',
        answer: 'Twitter Cards are similar to Open Graph but specific to Twitter. They enhance tweets containing links by showing a preview with title, description, and images.'
    },
    {
        question: 'How long should my meta description be?',
        answer: 'Meta descriptions should be 150-160 characters. Google typically displays up to 155-160 characters in search results before truncating.'
    },
];

export default function MetaTagGeneratorPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="meta-tag-generator"
                title="Meta Tag Generator"
                description="Generate HTML meta tags for SEO, Open Graph, and Twitter Cards."
                colorClass="bg-indigo-100 text-indigo-700"
            />
            <section aria-label="Meta Tag Generator Tool">
                <MetaTagGenerator />
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
