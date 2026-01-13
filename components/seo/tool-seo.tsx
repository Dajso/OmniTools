/**
 * ToolSEO Component
 * 
 * Generates SEO meta tags, WebApplication structured data, and canonical URLs
 * for tool pages. This component provides a centralized way to handle SEO
 * for all calculator and converter tools.
 * 
 * @see Requirements 10.2 - Unique, keyword-optimized title tag
 * @see Requirements 10.3 - Meta description with target keywords
 * @see Requirements 10.4 - Structured data (JSON-LD) for rich snippets
 * @see Requirements 10.9 - Canonical URLs to prevent duplicate content
 * @module components/seo/tool-seo
 */

import { Metadata } from 'next';

/**
 * Application category mapping for structured data
 * Maps tool categories to schema.org application categories
 */
const APPLICATION_CATEGORIES: Record<string, string> = {
  finance: 'FinanceApplication',
  health: 'HealthApplication',
  home: 'UtilitiesApplication',
  converter: 'UtilitiesApplication',
  productivity: 'ProductivityApplication',
};

/**
 * Props for the ToolSEO component
 */
export interface ToolSEOProps {
  /** Tool name (e.g., "Mortgage Calculator with PMI") */
  name: string;
  /** Tool description for meta tags and structured data */
  description: string;
  /** Array of keywords for SEO */
  keywords: string[];
  /** Canonical URL path (e.g., "/calculators/finance/mortgage-calculator") */
  canonicalPath: string;
  /** Tool category for application category mapping */
  category?: 'finance' | 'health' | 'home' | 'converter' | 'productivity';
  /** Optional custom application category override */
  applicationCategory?: string;
  /** Base URL for canonical URLs (defaults to empty for relative URLs) */
  baseUrl?: string;
  /** Optional Open Graph image URL */
  ogImage?: string;
  /** Optional Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * WebApplication structured data interface
 * @see https://schema.org/WebApplication
 */
export interface WebApplicationStructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  url?: string;
}

/**
 * Generates WebApplication structured data for a tool
 * 
 * @param props - Tool SEO properties
 * @returns WebApplication structured data object
 * 
 * @example
 * const structuredData = generateWebApplicationStructuredData({
 *   name: 'Mortgage Calculator',
 *   description: 'Calculate your monthly mortgage payment',
 *   keywords: ['mortgage', 'calculator'],
 *   canonicalPath: '/calculators/finance/mortgage-calculator',
 *   category: 'finance',
 * });
 */
export function generateWebApplicationStructuredData(
  props: ToolSEOProps
): WebApplicationStructuredData {
  const { name, description, category, applicationCategory, canonicalPath, baseUrl } = props;
  
  // Determine application category from props or mapping
  const appCategory = applicationCategory || 
    (category ? APPLICATION_CATEGORIES[category] : 'UtilitiesApplication');
  
  const structuredData: WebApplicationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    applicationCategory: appCategory,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  // Add URL if baseUrl is provided
  if (baseUrl) {
    structuredData.url = `${baseUrl}${canonicalPath}`;
  }

  return structuredData;
}

/**
 * Generates Next.js Metadata object for a tool page
 * 
 * @param props - Tool SEO properties
 * @returns Next.js Metadata object
 * 
 * @example
 * // In a page.tsx file:
 * export const metadata = generateToolMetadata({
 *   name: 'Mortgage Calculator',
 *   description: 'Calculate your monthly mortgage payment',
 *   keywords: ['mortgage', 'calculator'],
 *   canonicalPath: '/calculators/finance/mortgage-calculator',
 *   category: 'finance',
 * });
 */
export function generateToolMetadata(props: ToolSEOProps): Metadata {
  const { 
    name, 
    description, 
    keywords, 
    canonicalPath, 
    baseUrl,
    ogImage,
    twitterCard = 'summary',
  } = props;

  // Generate title with suffix
  const title = `${name} - Free Online Calculator`;
  
  // Build canonical URL
  const canonicalUrl = baseUrl ? `${baseUrl}${canonicalPath}` : canonicalPath;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Online Tools',
    },
    twitter: {
      card: twitterCard,
      title,
      description,
    },
  };

  // Add OG image if provided
  if (ogImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImage }],
    };
    metadata.twitter = {
      ...metadata.twitter,
      images: [ogImage],
    };
  }

  return metadata;
}

/**
 * Props for the ToolStructuredData component
 */
export interface ToolStructuredDataProps extends ToolSEOProps {
  /** Additional structured data to include (e.g., HowTo, FAQPage) */
  additionalStructuredData?: object[];
}

/**
 * ToolStructuredData Component
 * 
 * Renders JSON-LD structured data script tags for a tool page.
 * Includes WebApplication schema and any additional structured data.
 * 
 * @example
 * <ToolStructuredData
 *   name="Mortgage Calculator"
 *   description="Calculate your monthly mortgage payment"
 *   keywords={['mortgage', 'calculator']}
 *   canonicalPath="/calculators/finance/mortgage-calculator"
 *   category="finance"
 *   additionalStructuredData={[howToSchema, faqSchema]}
 * />
 */
export function ToolStructuredData({
  additionalStructuredData = [],
  ...props
}: ToolStructuredDataProps) {
  const webAppStructuredData = generateWebApplicationStructuredData(props);

  return (
    <>
      {/* WebApplication Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppStructuredData),
        }}
      />
      
      {/* Additional Structured Data (HowTo, FAQPage, etc.) */}
      {additionalStructuredData.map((data, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
    </>
  );
}

/**
 * Helper function to create HowTo structured data
 * 
 * @param title - Title of the how-to guide
 * @param steps - Array of step objects with name and text
 * @param description - Optional description
 * @returns HowTo structured data object
 */
export function createHowToStructuredData(
  title: string,
  steps: Array<{ name: string; text: string }>,
  description?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description || `Step-by-step guide: ${title}`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Helper function to create FAQPage structured data
 * 
 * @param faqs - Array of FAQ objects with question and answer
 * @returns FAQPage structured data object
 */
export function createFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Default export for convenience
 */
export default ToolStructuredData;
