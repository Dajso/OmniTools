/**
 * Hashtag Generator
 * 
 * Generate relevant hashtags for social media posts.
 * 
 * @module lib/calculations/creator/hashtag-generator
 */

export interface HashtagInputs {
    topic: string;
    platform: 'instagram' | 'twitter' | 'tiktok' | 'linkedin';
    style: 'popular' | 'niche' | 'mixed';
    count: number;
}

export interface HashtagResults {
    hashtags: string[];
    formatted: string;
    copyText: string;
}

// Hashtag databases by category
const HASHTAG_PREFIXES: Record<string, string[]> = {
    photography: ['photography', 'photo', 'photooftheday', 'picoftheday', 'photographer', 'photoshoot'],
    travel: ['travel', 'travelphotography', 'travelgram', 'wanderlust', 'explore', 'adventure'],
    food: ['food', 'foodie', 'foodporn', 'foodphotography', 'yummy', 'delicious', 'instafood'],
    fashion: ['fashion', 'style', 'ootd', 'fashionista', 'fashionblogger', 'streetstyle'],
    fitness: ['fitness', 'gym', 'workout', 'fitnessmotivation', 'health', 'training'],
    business: ['business', 'entrepreneur', 'marketing', 'startup', 'success', 'motivation'],
    tech: ['tech', 'technology', 'coding', 'programming', 'developer', 'software'],
    art: ['art', 'artist', 'artwork', 'creative', 'design', 'illustration'],
    music: ['music', 'musician', 'newmusic', 'song', 'singer', 'band'],
    nature: ['nature', 'naturephotography', 'landscape', 'wildlife', 'outdoors', 'beautiful'],
};

const GENERAL_POPULAR = [
    'love', 'instagood', 'beautiful', 'happy', 'follow', 'like', 'instalike',
    'trending', 'viral', 'explore', 'fyp', 'foryou', 'foryoupage',
];

const PLATFORM_SPECIFIC: Record<string, string[]> = {
    instagram: ['instadaily', 'insta', 'ig', 'igers', 'instamood'],
    twitter: ['twittertrends', 'trending', 'viral', 'mustread'],
    tiktok: ['fyp', 'foryou', 'foryoupage', 'viral', 'trending', 'tiktok'],
    linkedin: ['networking', 'career', 'professional', 'leadership', 'growth'],
};

/**
 * Find relevant category based on topic keywords
 */
function findRelevantCategories(topic: string): string[] {
    const lowerTopic = topic.toLowerCase();
    const categories: string[] = [];

    Object.keys(HASHTAG_PREFIXES).forEach(category => {
        if (lowerTopic.includes(category) || category.includes(lowerTopic.split(' ')[0])) {
            categories.push(category);
        }
    });

    return categories.length > 0 ? categories : ['general'];
}

/**
 * Generate hashtags based on topic
 */
export function generateHashtags(inputs: HashtagInputs): HashtagResults {
    const { topic, platform, style, count } = inputs;

    if (!topic.trim()) {
        return {
            hashtags: [],
            formatted: '',
            copyText: '',
        };
    }

    const hashtags = new Set<string>();
    const categories = findRelevantCategories(topic);

    // Add topic-based hashtags
    const topicWords = topic.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2);

    topicWords.forEach(word => {
        hashtags.add(word);
        hashtags.add(word + 's');
    });

    // Add combined topic terms
    if (topicWords.length >= 2) {
        hashtags.add(topicWords.join(''));
    }

    // Add category-specific hashtags
    categories.forEach(category => {
        const categoryTags = HASHTAG_PREFIXES[category] || [];
        categoryTags.forEach(tag => hashtags.add(tag));
    });

    // Add platform-specific hashtags
    const platformTags = PLATFORM_SPECIFIC[platform] || [];
    if (style !== 'niche') {
        platformTags.slice(0, 3).forEach(tag => hashtags.add(tag));
    }

    // Add general popular hashtags based on style
    if (style === 'popular' || style === 'mixed') {
        GENERAL_POPULAR.slice(0, 5).forEach(tag => hashtags.add(tag));
    }

    // Convert to array and limit
    const hashtagArray = Array.from(hashtags)
        .slice(0, count)
        .map(tag => `#${tag}`);

    return {
        hashtags: hashtagArray,
        formatted: hashtagArray.join(' '),
        copyText: hashtagArray.join(' '),
    };
}

/**
 * Platform options
 */
export const PLATFORMS = [
    { id: 'instagram', name: 'Instagram', maxTags: 30 },
    { id: 'twitter', name: 'Twitter/X', maxTags: 5 },
    { id: 'tiktok', name: 'TikTok', maxTags: 5 },
    { id: 'linkedin', name: 'LinkedIn', maxTags: 5 },
] as const;
