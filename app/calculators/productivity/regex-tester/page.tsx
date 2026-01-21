import { Metadata } from 'next';
import { RegexTester } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
    title: 'Regex Tester - Free Online Regular Expression Tester',
    description: 'Test and debug regular expressions with live matching. See matches highlighted, extract capture groups, and access common regex patterns.',
    keywords: ['regex tester', 'regular expression', 'regex online', 'regex debugger', 'pattern matching', 'regex validator'],
    alternates: { canonical: '/calculators/productivity/regex-tester' },
};

const faqs = [
    {
        question: 'What is a regular expression?',
        answer: 'A regular expression (regex) is a sequence of characters that defines a search pattern. It is used for pattern matching, validation, and text manipulation in programming.'
    },
    {
        question: 'What do the flags mean?',
        answer: 'g = Global (find all matches), i = Case insensitive, m = Multiline (^ and $ match line boundaries), s = DotAll (. matches newlines), u = Unicode support.'
    },
    {
        question: 'What are capture groups?',
        answer: 'Capture groups are portions of the pattern enclosed in parentheses (). They allow you to extract specific parts of a match. Named groups use the syntax (?<name>pattern).'
    },
    {
        question: 'How do I escape special characters?',
        answer: 'Use a backslash (\\) before special characters like . * + ? ^ $ { } [ ] ( ) | \\ to match them literally.'
    },
];

export default function RegexTesterPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="regex-tester"
                title="Regex Tester"
                description="Test regular expressions with live matching, capture groups, and common pattern library."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Regex Tester Tool">
                <RegexTester />
            </section>

            <section className="mt-12" aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-2xl font-semibold mb-4">About Regular Expressions</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        Regular expressions are powerful tools for pattern matching and text processing.
                        They are supported in virtually all programming languages and are essential for
                        tasks like form validation, data extraction, and search/replace operations.
                    </p>
                    <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">Common Metacharacters</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><code>.</code> - Any single character (except newline)</li>
                        <li><code>*</code> - Zero or more of the preceding element</li>
                        <li><code>+</code> - One or more of the preceding element</li>
                        <li><code>?</code> - Zero or one of the preceding element</li>
                        <li><code>^</code> - Start of string/line</li>
                        <li><code>$</code> - End of string/line</li>
                        <li><code>\d</code> - Any digit (0-9)</li>
                        <li><code>\w</code> - Any word character (a-z, A-Z, 0-9, _)</li>
                        <li><code>\s</code> - Any whitespace character</li>
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
