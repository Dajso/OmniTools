/**
 * UTM Builder
 * 
 * Build UTM tracking URLs for marketing campaigns.
 * 
 * @module lib/calculations/creator/utm-builder
 */

export interface UTMParams {
    url: string;
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
}

export interface UTMResults {
    fullUrl: string;
    params: Record<string, string>;
    isValid: boolean;
    errors: string[];
}

/**
 * Validate URL
 */
function isValidUrl(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
}

/**
 * Build UTM URL
 */
export function buildUTMUrl(inputs: UTMParams): UTMResults {
    const errors: string[] = [];

    // Validate required fields
    if (!inputs.url.trim()) {
        errors.push('Website URL is required');
    } else if (!isValidUrl(inputs.url)) {
        errors.push('Please enter a valid URL (including https://)');
    }

    if (!inputs.source.trim()) {
        errors.push('Campaign Source is required');
    }

    if (!inputs.medium.trim()) {
        errors.push('Campaign Medium is required');
    }

    if (!inputs.campaign.trim()) {
        errors.push('Campaign Name is required');
    }

    if (errors.length > 0) {
        return {
            fullUrl: '',
            params: {},
            isValid: false,
            errors,
        };
    }

    // Build params object
    const params: Record<string, string> = {
        utm_source: inputs.source.trim(),
        utm_medium: inputs.medium.trim(),
        utm_campaign: inputs.campaign.trim(),
    };

    if (inputs.term?.trim()) {
        params.utm_term = inputs.term.trim();
    }

    if (inputs.content?.trim()) {
        params.utm_content = inputs.content.trim();
    }

    // Build URL
    try {
        const url = new URL(inputs.url.trim());

        // Add UTM params
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        return {
            fullUrl: url.toString(),
            params,
            isValid: true,
            errors: [],
        };
    } catch {
        return {
            fullUrl: '',
            params: {},
            isValid: false,
            errors: ['Failed to build URL'],
        };
    }
}

/**
 * Common UTM source presets
 */
export const UTM_PRESETS = {
    sources: [
        'google',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'youtube',
        'tiktok',
        'email',
        'newsletter',
        'referral',
    ],
    mediums: [
        'cpc',
        'organic',
        'social',
        'email',
        'affiliate',
        'referral',
        'display',
        'video',
        'banner',
        'pr',
    ],
} as const;

/**
 * Campaign templates
 */
export const CAMPAIGN_TEMPLATES = [
    {
        name: 'Google Ads',
        source: 'google',
        medium: 'cpc',
        description: 'For Google paid search campaigns'
    },
    {
        name: 'Facebook Ads',
        source: 'facebook',
        medium: 'cpc',
        description: 'For Facebook/Meta paid campaigns'
    },
    {
        name: 'Email Newsletter',
        source: 'newsletter',
        medium: 'email',
        description: 'For email marketing campaigns'
    },
    {
        name: 'Twitter Organic',
        source: 'twitter',
        medium: 'social',
        description: 'For organic Twitter posts'
    },
    {
        name: 'LinkedIn Post',
        source: 'linkedin',
        medium: 'social',
        description: 'For LinkedIn organic content'
    },
    {
        name: 'Influencer',
        source: 'influencer',
        medium: 'referral',
        description: 'For influencer partnerships'
    },
] as const;
