'use client';

import { Card, CardContent } from '@/components/ui/card';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

/**
 * Delt FAQ-seksjon for verktøysidene
 */
export function FAQSection({ faqs, title = 'Ofte stilte spørsmål' }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Card key={index} className="hover:bg-muted/30 transition-colors">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
