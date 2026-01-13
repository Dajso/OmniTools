'use client';

export interface HowToStep {
  name: string;
  text: string;
}

interface HowToSectionProps {
  steps: HowToStep[];
  title?: string;
}

/**
 * Shared How-To section component for tool detail pages
 */
export function HowToSection({ steps, title = 'How to Use' }: HowToSectionProps) {
  if (steps.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="how-to-heading">
      <h2 id="how-to-heading" className="text-xl font-semibold mb-4">{title}</h2>
      <div className="bg-muted/50 rounded-xl p-6">
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <div>
                <span className="font-medium">{step.name}</span>
                <span className="text-muted-foreground"> — {step.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
