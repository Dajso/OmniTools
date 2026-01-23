import { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/layout/category-page-layout';

export const metadata: Metadata = {
  title: 'Coffee & Barista Calculators - OmniTools',
  description: 'Professional coffee and barista tools for third-wave coffee enthusiasts. Calculate extraction yield, brew ratios, espresso dial-in, water recipes, and more.',
  openGraph: {
    title: 'Coffee & Barista Calculators - OmniTools',
    description: 'Professional coffee and barista tools for third-wave coffee enthusiasts. Calculate extraction yield, brew ratios, espresso dial-in, water recipes, and more.',
    url: '/calculators/coffee',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee & Barista Calculators - OmniTools',
    description: 'Professional coffee and barista tools for third-wave coffee enthusiasts.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Coffee & Barista Calculators',
  description: 'Collection of professional coffee and barista tools for extraction, brewing, and analysis.',
  url: 'https://omnitools.dev/calculators/coffee',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: 'https://omnitools.dev/calculators/coffee/extraction-yield-calculator',
        name: 'Coffee Extraction Yield Calculator'
      },
      {
        '@type': 'ListItem',
        position: 2,
        url: 'https://omnitools.dev/calculators/coffee/brew-ratio-calculator',
        name: 'Brew Ratio Calculator'
      },
      {
        '@type': 'ListItem',
        position: 3,
        url: 'https://omnitools.dev/calculators/coffee/espresso-dial-in-log',
        name: 'Espresso Dial-in Log'
      }
    ]
  }
};

export default function CoffeeCalculatorsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <CategoryPageLayout
        categoryId="coffee"
        title="Coffee & Barista Calculators"
        description="Precision tools for coffee extraction analysis, brewing parameter optimization, and data-driven coffee preparation. Perfect for third-wave coffee enthusiasts and professional baristas."
      />
    </>
  );
}
