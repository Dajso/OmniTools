'use client';

/**
 * Lazy-loaded SEO Content Sections
 * 
 * These components use Intersection Observer to lazy load
 * below-the-fold content like FAQ and How-To sections.
 * 
 * @see Requirements 13.3 - Implement lazy loading for content below the initial viewport
 * @module components/seo/lazy-sections
 */

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  /** Placeholder to show while loading */
  placeholder?: ReactNode;
  /** Root margin for intersection observer (default: 200px) */
  rootMargin?: string;
  /** Minimum height to prevent layout shift */
  minHeight?: string;
  /** Class name for the wrapper */
  className?: string;
}

/**
 * Default placeholder for lazy-loaded content
 */
function DefaultPlaceholder() {
  return (
    <div 
      className="animate-pulse space-y-4"
      role="status"
      aria-label="Loading content"
    >
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

/**
 * LazySection Component
 * 
 * Wraps content and only renders it when the section enters the viewport.
 * Uses Intersection Observer for efficient detection.
 * 
 * @example
 * <LazySection rootMargin="200px">
 *   <FAQSection faqs={faqs} />
 * </LazySection>
 */
export function LazySection({
  children,
  placeholder = <DefaultPlaceholder />,
  rootMargin = '200px',
  minHeight = '200px',
  className = '',
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if not supported
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasLoaded(true);
            // Stop observing once loaded
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: hasLoaded ? 'auto' : minHeight }}
    >
      {isVisible ? children : placeholder}
    </div>
  );
}

/**
 * FAQ Section Props
 */
export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  faqs: FAQ[];
  headingId?: string;
  /** Title for the FAQ section */
  title?: string;
  /** Whether to use accordion-style display (default: true) */
  accordion?: boolean;
  /** Whether to allow multiple items open at once (default: true) */
  allowMultiple?: boolean;
}

/**
 * Generates FAQPage structured data (JSON-LD) for rich snippets
 * @see https://schema.org/FAQPage
 * @see Requirements 10.4, 10.6
 */
function generateFAQStructuredData(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

/**
 * FAQ Accordion Item Component
 * 
 * Individual accordion item using native HTML details/summary for accessibility.
 * This approach provides built-in keyboard navigation and screen reader support.
 */
function FAQAccordionItem({ 
  faq, 
  index,
  isOpen,
  onToggle,
}: { 
  faq: FAQ; 
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const questionId = `faq-question-${index}`;
  const answerId = `faq-answer-${index}`;

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <details 
        className="group"
        open={isOpen}
        onToggle={(e) => {
          // Prevent default toggle behavior when we're managing state
          if ((e.target as HTMLDetailsElement).open !== isOpen) {
            onToggle();
          }
        }}
      >
        <summary
          id={questionId}
          className="flex cursor-pointer items-center justify-between py-4 text-left font-medium text-lg hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm list-none [&::-webkit-details-marker]:hidden"
          aria-controls={answerId}
          aria-expanded={isOpen}
        >
          <span>{faq.question}</span>
          <svg
            className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>
        <div
          id={answerId}
          role="region"
          aria-labelledby={questionId}
          className="pb-4 pt-2 text-muted-foreground animate-accordion-down"
        >
          <p>{faq.answer}</p>
        </div>
      </details>
    </div>
  );
}

/**
 * FAQ Section Component
 * 
 * Renders a list of frequently asked questions with accordion-style display
 * and FAQPage structured data (JSON-LD) for SEO rich snippets.
 * 
 * Uses native HTML details/summary elements for built-in accessibility:
 * - Keyboard navigation (Enter/Space to toggle)
 * - Screen reader support
 * - No JavaScript required for basic functionality
 * 
 * @see Requirements 10.4 - Structured data (JSON-LD) for rich snippets
 * @see Requirements 10.6 - FAQ section with common questions
 */
export function FAQSection({ 
  faqs, 
  headingId = 'faq-heading',
  title = 'Frequently Asked Questions',
  accordion = true,
  allowMultiple = true,
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const handleToggle = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  const structuredData = generateFAQStructuredData(faqs);

  if (!accordion) {
    // Non-accordion mode: show all FAQs expanded
    return (
      <section className="mt-12" aria-labelledby={headingId}>
        {/* FAQPage Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <h2 id={headingId} className="text-2xl font-semibold mb-6">
          {title}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12" aria-labelledby={headingId}>
      {/* FAQPage Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <h2 id={headingId} className="text-2xl font-semibold mb-6">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {faqs.map((faq, index) => (
          <FAQAccordionItem
            key={index}
            faq={faq}
            index={index}
            isOpen={openItems.has(index)}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * How-To Step Props
 */
export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToSectionProps {
  steps: HowToStep[];
  headingId?: string;
  title?: string;
  /** Tool name for structured data (e.g., "Mortgage Calculator") */
  toolName?: string;
  /** Tool description for structured data */
  toolDescription?: string;
}

/**
 * Generates HowTo structured data (JSON-LD) for rich snippets
 * @see https://schema.org/HowTo
 * @see Requirements 10.4, 10.5
 */
function generateHowToStructuredData(
  title: string,
  steps: HowToStep[],
  toolDescription?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": toolDescription || `Step-by-step guide: ${title}`,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
    })),
  };
}

/**
 * How-To Section Component
 * 
 * Renders step-by-step instructions with proper semantic markup
 * and HowTo structured data (JSON-LD) for SEO rich snippets.
 * 
 * @see Requirements 10.4 - Structured data (JSON-LD) for rich snippets
 * @see Requirements 10.5 - "How to Use" section with step-by-step instructions
 */
export function HowToSection({ 
  steps, 
  headingId = 'how-to-heading',
  title = 'How to Use This Calculator',
  toolName,
  toolDescription,
}: HowToSectionProps) {
  const structuredDataTitle = toolName ? `How to Use ${toolName}` : title;
  const structuredData = generateHowToStructuredData(
    structuredDataTitle,
    steps,
    toolDescription
  );

  return (
    <section className="mt-12" aria-labelledby={headingId}>
      {/* HowTo Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <h2 id={headingId} className="text-2xl font-semibold mb-6">
        {title}
      </h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </span>
            <div>
              <h3 className="font-medium">{step.name}</h3>
              <p className="text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Lazy FAQ Section
 * 
 * Wraps FAQSection with lazy loading behavior.
 */
export function LazyFAQSection(props: FAQSectionProps) {
  return (
    <LazySection minHeight="300px">
      <FAQSection {...props} />
    </LazySection>
  );
}

/**
 * Lazy How-To Section
 * 
 * Wraps HowToSection with lazy loading behavior.
 */
export function LazyHowToSection(props: HowToSectionProps) {
  return (
    <LazySection minHeight="250px">
      <HowToSection {...props} />
    </LazySection>
  );
}
