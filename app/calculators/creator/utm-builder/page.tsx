import { Metadata } from 'next';
import { UTMBuilder } from '@/components/calculators/creator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'UTM Builder - Free UTM URL Generator Tool',
    description: 'Build UTM tracking URLs for marketing campaigns. Generate Google Analytics compatible tracking links with source, medium, campaign, and more.',
    keywords: ['UTM builder', 'UTM generator', 'campaign tracking', 'Google Analytics', 'marketing URL', 'UTM parameters'],
    alternates: { canonical: '/calculators/creator/utm-builder' },
};

const faqs = [
    {
        question: 'What are UTM parameters?',
        answer: 'UTM parameters are tags added to URLs that help you track where your traffic comes from. They include source, medium, campaign, term, and content.'
    },
    {
        question: 'What is utm_source?',
        answer: 'utm_source identifies which platform sent the traffic (e.g., google, facebook, newsletter). It answers: where did this visitor come from?'
    },
    {
        question: 'What is utm_medium?',
        answer: 'utm_medium identifies the marketing channel type (e.g., cpc, organic, email, social). It answers: how did they get here?'
    },
    {
        question: 'Are UTM parameters case sensitive?',
        answer: 'Yes, in Google Analytics. Use consistent lowercase for all parameters to avoid splitting your data.'
    },
];

export default function UTMBuilderPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="utm-builder"
                title="UTM Builder"
                description="Create UTM tracking URLs for your marketing campaigns and track them in Google Analytics."
                colorClass="bg-indigo-100 text-indigo-700"
            />
            <section aria-label="UTM Builder Tool">
                <UTMBuilder />
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
