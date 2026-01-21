import { Metadata } from 'next';
import { URLEncoder } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'URL Encoder/Decoder - Free Online URL Encoding Tool',
    description: 'Encode and decode URLs online. Convert special characters to URL-safe format and vice versa.',
    keywords: ['URL encoder', 'URL decoder', 'percent encoding', 'encodeURIComponent', 'URL escape'],
    alternates: { canonical: '/calculators/productivity/url-encoder' },
};

const faqs = [
    {
        question: 'What is URL encoding?',
        answer: 'URL encoding converts special characters into a format that can be transmitted over the internet. It replaces unsafe characters with a % followed by two hexadecimal digits.'
    },
    {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI encodes a complete URL, preserving characters like : / ? & =. encodeURIComponent encodes individual URL components and encodes all special characters.'
    },
    {
        question: 'When should I use URL encoding?',
        answer: 'Use URL encoding when passing data in query parameters, especially if the data contains special characters, spaces, or non-ASCII characters.'
    },
];

export default function URLEncoderPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="url-encoder"
                title="URL Encoder/Decoder"
                description="Encode and decode URLs for web use. Convert special characters to URL-safe format."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="URL Encoder Tool">
                <URLEncoder />
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
