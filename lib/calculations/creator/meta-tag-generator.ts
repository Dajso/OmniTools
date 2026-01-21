/**
 * Meta Tag Generator
 * 
 * Generate HTML meta tags for SEO, Open Graph, and Twitter Cards.
 * 
 * @module lib/calculations/creator/meta-tag-generator
 */

export interface MetaTagInputs {
    // Basic SEO
    title: string;
    description: string;
    keywords: string;
    author: string;
    robots: string;

    // Open Graph
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;

    // Twitter Card
    twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterSite: string;
    twitterCreator: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;

    // Additional
    favicon: string;
    canonical: string;
    viewport: string;
    charset: string;
    themeColor: string;
}

export interface MetaTagResults {
    html: string;
    tags: { name: string; content: string }[];
}

/**
 * Default meta tag values
 */
export const DEFAULT_META_INPUTS: MetaTagInputs = {
    title: '',
    description: '',
    keywords: '',
    author: '',
    robots: 'index, follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    ogType: 'website',
    ogSiteName: '',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    twitterCreator: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    favicon: '/favicon.ico',
    canonical: '',
    viewport: 'width=device-width, initial-scale=1',
    charset: 'UTF-8',
    themeColor: '#ffffff',
};

/**
 * Generate meta tags HTML
 */
export function generateMetaTags(inputs: Partial<MetaTagInputs>): MetaTagResults {
    const data = { ...DEFAULT_META_INPUTS, ...inputs };
    const lines: string[] = [];
    const tags: { name: string; content: string }[] = [];

    // Charset
    if (data.charset) {
        lines.push(`<meta charset="${data.charset}">`);
        tags.push({ name: 'charset', content: data.charset });
    }

    // Viewport
    if (data.viewport) {
        lines.push(`<meta name="viewport" content="${data.viewport}">`);
        tags.push({ name: 'viewport', content: data.viewport });
    }

    // Basic SEO
    if (data.title) {
        lines.push(`<title>${escapeHtml(data.title)}</title>`);
        tags.push({ name: 'title', content: data.title });
    }

    if (data.description) {
        lines.push(`<meta name="description" content="${escapeHtml(data.description)}">`);
        tags.push({ name: 'description', content: data.description });
    }

    if (data.keywords) {
        lines.push(`<meta name="keywords" content="${escapeHtml(data.keywords)}">`);
        tags.push({ name: 'keywords', content: data.keywords });
    }

    if (data.author) {
        lines.push(`<meta name="author" content="${escapeHtml(data.author)}">`);
        tags.push({ name: 'author', content: data.author });
    }

    if (data.robots) {
        lines.push(`<meta name="robots" content="${escapeHtml(data.robots)}">`);
        tags.push({ name: 'robots', content: data.robots });
    }

    // Theme color
    if (data.themeColor) {
        lines.push(`<meta name="theme-color" content="${escapeHtml(data.themeColor)}">`);
        tags.push({ name: 'theme-color', content: data.themeColor });
    }

    // Canonical URL
    if (data.canonical) {
        lines.push(`<link rel="canonical" href="${escapeHtml(data.canonical)}">`);
        tags.push({ name: 'canonical', content: data.canonical });
    }

    // Favicon
    if (data.favicon) {
        lines.push(`<link rel="icon" href="${escapeHtml(data.favicon)}">`);
        tags.push({ name: 'favicon', content: data.favicon });
    }

    // Open Graph
    lines.push('');
    lines.push('<!-- Open Graph / Facebook -->');

    const ogTitle = data.ogTitle || data.title;
    const ogDesc = data.ogDescription || data.description;

    if (ogTitle) {
        lines.push(`<meta property="og:title" content="${escapeHtml(ogTitle)}">`);
    }
    if (ogDesc) {
        lines.push(`<meta property="og:description" content="${escapeHtml(ogDesc)}">`);
    }
    if (data.ogImage) {
        lines.push(`<meta property="og:image" content="${escapeHtml(data.ogImage)}">`);
    }
    if (data.ogUrl) {
        lines.push(`<meta property="og:url" content="${escapeHtml(data.ogUrl)}">`);
    }
    if (data.ogType) {
        lines.push(`<meta property="og:type" content="${escapeHtml(data.ogType)}">`);
    }
    if (data.ogSiteName) {
        lines.push(`<meta property="og:site_name" content="${escapeHtml(data.ogSiteName)}">`);
    }

    // Twitter Card
    lines.push('');
    lines.push('<!-- Twitter -->');

    const twitterTitle = data.twitterTitle || data.ogTitle || data.title;
    const twitterDesc = data.twitterDescription || data.ogDescription || data.description;
    const twitterImg = data.twitterImage || data.ogImage;

    lines.push(`<meta name="twitter:card" content="${data.twitterCard}">`);
    if (data.twitterSite) {
        lines.push(`<meta name="twitter:site" content="${escapeHtml(data.twitterSite)}">`);
    }
    if (data.twitterCreator) {
        lines.push(`<meta name="twitter:creator" content="${escapeHtml(data.twitterCreator)}">`);
    }
    if (twitterTitle) {
        lines.push(`<meta name="twitter:title" content="${escapeHtml(twitterTitle)}">`);
    }
    if (twitterDesc) {
        lines.push(`<meta name="twitter:description" content="${escapeHtml(twitterDesc)}">`);
    }
    if (twitterImg) {
        lines.push(`<meta name="twitter:image" content="${escapeHtml(twitterImg)}">`);
    }

    return {
        html: lines.join('\n'),
        tags,
    };
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * OG Type options
 */
export const OG_TYPES = [
    'website',
    'article',
    'blog',
    'product',
    'profile',
    'video.movie',
    'video.episode',
    'music.song',
    'music.album',
] as const;

/**
 * Robots options
 */
export const ROBOTS_OPTIONS = [
    'index, follow',
    'noindex, follow',
    'index, nofollow',
    'noindex, nofollow',
] as const;
