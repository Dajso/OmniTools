/**
 * Schema Markup Generator
 * 
 * Generate JSON-LD structured data for SEO.
 * Supports Article, FAQ, Product, LocalBusiness, HowTo, Event schemas.
 * 
 * @module lib/calculations/creator/schema-markup-generator
 */

export type SchemaType = 'Article' | 'FAQ' | 'Product' | 'LocalBusiness' | 'HowTo' | 'Event' | 'Organization' | 'Person';

export interface ArticleData {
    headline: string;
    description: string;
    authorName: string;
    authorUrl?: string;
    publisherName: string;
    publisherLogoUrl: string;
    datePublished: string;
    dateModified?: string;
    imageUrl: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQData {
    items: FAQItem[];
}

export interface ProductData {
    name: string;
    description: string;
    imageUrl: string;
    brand: string;
    sku: string;
    price: number;
    priceCurrency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    ratingValue?: number;
    reviewCount?: number;
}

export interface LocalBusinessData {
    name: string;
    description: string;
    imageUrl: string;
    telephone: string;
    address: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    geo?: {
        latitude: number;
        longitude: number;
    };
    openingHours?: string[];
    priceRange?: string;
}

export interface HowToStep {
    name: string;
    text: string;
    imageUrl?: string;
}

export interface HowToData {
    name: string;
    description: string;
    totalTime?: string;
    estimatedCost?: { value: number; currency: string };
    steps: HowToStep[];
    imageUrl?: string;
}

export interface EventData {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: {
        name: string;
        address: string;
    };
    imageUrl?: string;
    offers?: {
        price: number;
        priceCurrency: string;
        url: string;
        availability: 'InStock' | 'SoldOut' | 'PreOrder';
    };
    performer?: string;
    organizer?: string;
}

export interface OrganizationData {
    name: string;
    url: string;
    logoUrl: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
        telephone: string;
        contactType: string;
    };
}

export interface PersonData {
    name: string;
    jobTitle?: string;
    url?: string;
    imageUrl?: string;
    sameAs?: string[];
}

export type SchemaData =
    | { type: 'Article'; data: ArticleData }
    | { type: 'FAQ'; data: FAQData }
    | { type: 'Product'; data: ProductData }
    | { type: 'LocalBusiness'; data: LocalBusinessData }
    | { type: 'HowTo'; data: HowToData }
    | { type: 'Event'; data: EventData }
    | { type: 'Organization'; data: OrganizationData }
    | { type: 'Person'; data: PersonData };

/**
 * Generate Article schema
 */
function generateArticleSchema(data: ArticleData): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        image: data.imageUrl,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
            '@type': 'Person',
            name: data.authorName,
            ...(data.authorUrl && { url: data.authorUrl }),
        },
        publisher: {
            '@type': 'Organization',
            name: data.publisherName,
            logo: {
                '@type': 'ImageObject',
                url: data.publisherLogoUrl,
            },
        },
    };
}

/**
 * Generate FAQ schema
 */
function generateFAQSchema(data: FAQData): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

/**
 * Generate Product schema
 */
function generateProductSchema(data: ProductData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.imageUrl,
        sku: data.sku,
        brand: {
            '@type': 'Brand',
            name: data.brand,
        },
        offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: data.priceCurrency,
            availability: `https://schema.org/${data.availability}`,
        },
    };

    if (data.ratingValue && data.reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: data.ratingValue,
            reviewCount: data.reviewCount,
        };
    }

    return schema;
}

/**
 * Generate LocalBusiness schema
 */
function generateLocalBusinessSchema(data: LocalBusinessData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: data.name,
        description: data.description,
        image: data.imageUrl,
        telephone: data.telephone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: data.address.streetAddress,
            addressLocality: data.address.addressLocality,
            addressRegion: data.address.addressRegion,
            postalCode: data.address.postalCode,
            addressCountry: data.address.addressCountry,
        },
    };

    if (data.geo) {
        schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: data.geo.latitude,
            longitude: data.geo.longitude,
        };
    }

    if (data.openingHours) {
        schema.openingHours = data.openingHours;
    }

    if (data.priceRange) {
        schema.priceRange = data.priceRange;
    }

    return schema;
}

/**
 * Generate HowTo schema
 */
function generateHowToSchema(data: HowToData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.name,
        description: data.description,
        step: data.steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.imageUrl && { image: step.imageUrl }),
        })),
    };

    if (data.totalTime) {
        schema.totalTime = data.totalTime;
    }

    if (data.estimatedCost) {
        schema.estimatedCost = {
            '@type': 'MonetaryAmount',
            value: data.estimatedCost.value,
            currency: data.estimatedCost.currency,
        };
    }

    if (data.imageUrl) {
        schema.image = data.imageUrl;
    }

    return schema;
}

/**
 * Generate Event schema
 */
function generateEventSchema(data: EventData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        location: {
            '@type': 'Place',
            name: data.location.name,
            address: data.location.address,
        },
    };

    if (data.endDate) {
        schema.endDate = data.endDate;
    }

    if (data.imageUrl) {
        schema.image = data.imageUrl;
    }

    if (data.offers) {
        schema.offers = {
            '@type': 'Offer',
            price: data.offers.price,
            priceCurrency: data.offers.priceCurrency,
            url: data.offers.url,
            availability: `https://schema.org/${data.offers.availability}`,
        };
    }

    if (data.performer) {
        schema.performer = {
            '@type': 'Person',
            name: data.performer,
        };
    }

    if (data.organizer) {
        schema.organizer = {
            '@type': 'Organization',
            name: data.organizer,
        };
    }

    return schema;
}

/**
 * Generate Organization schema
 */
function generateOrganizationSchema(data: OrganizationData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logoUrl,
    };

    if (data.description) {
        schema.description = data.description;
    }

    if (data.sameAs && data.sameAs.length > 0) {
        schema.sameAs = data.sameAs;
    }

    if (data.contactPoint) {
        schema.contactPoint = {
            '@type': 'ContactPoint',
            telephone: data.contactPoint.telephone,
            contactType: data.contactPoint.contactType,
        };
    }

    return schema;
}

/**
 * Generate Person schema
 */
function generatePersonSchema(data: PersonData): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
    };

    if (data.jobTitle) {
        schema.jobTitle = data.jobTitle;
    }

    if (data.url) {
        schema.url = data.url;
    }

    if (data.imageUrl) {
        schema.image = data.imageUrl;
    }

    if (data.sameAs && data.sameAs.length > 0) {
        schema.sameAs = data.sameAs;
    }

    return schema;
}

/**
 * Generate schema markup based on type
 */
export function generateSchema(input: SchemaData): string {
    let schema: object;

    switch (input.type) {
        case 'Article':
            schema = generateArticleSchema(input.data);
            break;
        case 'FAQ':
            schema = generateFAQSchema(input.data);
            break;
        case 'Product':
            schema = generateProductSchema(input.data);
            break;
        case 'LocalBusiness':
            schema = generateLocalBusinessSchema(input.data);
            break;
        case 'HowTo':
            schema = generateHowToSchema(input.data);
            break;
        case 'Event':
            schema = generateEventSchema(input.data);
            break;
        case 'Organization':
            schema = generateOrganizationSchema(input.data);
            break;
        case 'Person':
            schema = generatePersonSchema(input.data);
            break;
        default:
            throw new Error('Ukjent schema-type');
    }

    return JSON.stringify(schema, null, 2);
}

/**
 * Generate full script tag for embedding
 */
export function generateScriptTag(jsonLd: string): string {
    return `<script type="application/ld+json">
${jsonLd}
</script>`;
}

/**
 * Validate JSON-LD structure
 */
export function validateSchema(jsonLd: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
        const parsed = JSON.parse(jsonLd);

        if (!parsed['@context']) {
            errors.push('Mangler egenskapen @context');
        } else if (parsed['@context'] !== 'https://schema.org') {
            errors.push('@context bør være «https://schema.org»');
        }

        if (!parsed['@type']) {
            errors.push('Mangler egenskapen @type');
        }

    } catch (e) {
        errors.push('Ugyldig JSON-format');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Schema type display names and descriptions
 */
export const SCHEMA_TYPES: { type: SchemaType; name: string; description: string }[] = [
    { type: 'Article', name: 'Artikkel', description: 'Blogginnlegg, nyhetsartikler og annet skrevet innhold' },
    { type: 'FAQ', name: 'Side med vanlige spørsmål', description: 'Side med ofte stilte spørsmål' },
    { type: 'Product', name: 'Produkt', description: 'Produktoppføringer i nettbutikk' },
    { type: 'LocalBusiness', name: 'Lokal virksomhet', description: 'Fysiske forretningssteder' },
    { type: 'HowTo', name: 'Veiledning', description: 'Steg-for-steg-instruksjoner' },
    { type: 'Event', name: 'Arrangement', description: 'Arrangementer, konserter og treff' },
    { type: 'Organization', name: 'Organisasjon', description: 'Informasjon om firma eller organisasjon' },
    { type: 'Person', name: 'Person', description: 'Informasjon om en persons profil' },
];
