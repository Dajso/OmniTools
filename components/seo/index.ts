/**
 * SEO Components
 * 
 * Components for SEO optimization including lazy-loaded sections,
 * structured data generation, and meta tag utilities.
 * 
 * @module components/seo
 */

export {
  LazySection,
  FAQSection,
  HowToSection,
  LazyFAQSection,
  LazyHowToSection,
} from './lazy-sections';

export type { 
  HowToStep, 
  HowToSectionProps,
  FAQ,
  FAQSectionProps,
} from './lazy-sections';

export {
  ToolStructuredData,
  generateToolMetadata,
  generateWebApplicationStructuredData,
  createHowToStructuredData,
  createFAQStructuredData,
} from './tool-seo';

export type {
  ToolSEOProps,
  ToolStructuredDataProps,
  WebApplicationStructuredData,
} from './tool-seo';
