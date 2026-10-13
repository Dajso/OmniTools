import { Metadata } from 'next';
import { PasswordGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Password Generator - Free Secure Password Generator',
  description: 'Generate strong, secure passwords with customizable options. Free online password generator with strength indicator.',
  keywords: ['password generator', 'secure password', 'random password', 'strong password generator'],
  alternates: { canonical: '/calculators/productivity/password-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Generator',
  description: 'Generate strong, secure passwords with customizable options',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set password length', text: 'Choose 12-16+ characters for best security.' },
  { name: 'Select character types', text: 'Include uppercase, lowercase, numbers, and symbols.' },
  { name: 'Generate password', text: 'Click "Generate" to create a secure random password.' },
  { name: 'Copy password', text: 'Click "Copy" to save it to your clipboard.' },
];

const faqs = [
  { question: 'How long should my password be?', answer: 'At least 12-16 characters. Longer passwords are exponentially harder to crack.' },
  { question: 'Are these passwords truly random?', answer: 'Yes, we use cryptographically secure random generation (crypto.getRandomValues) for maximum security.' },
  { question: 'What makes a password strong?', answer: 'Length, mix of character types, and uniqueness for each account. Avoid dictionary words and personal info.' },
  { question: 'Is it safe to generate passwords online?', answer: 'Yes, passwords are generated entirely in your browser. Nothing is sent to any server.' },
];

const relatedTools = [
  { href: '/calculators/productivity/uuid-generator', title: 'UUID Generator', description: 'Generate unique identifiers.' },
  { href: '/calculators/productivity/base64-converter', title: 'Base64 Converter', description: 'Encode and decode Base64.' },
];

export default function PasswordGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="password-generator"
          title="Password Generator"
          description="Generate strong, secure passwords instantly. Customize length and character types to meet any password requirements."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Password Generator Tool">
          <PasswordGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
