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

// Emneord (norske og engelske) som utløser hver kategori
const CATEGORY_TRIGGERS: Record<string, string[]> = {
    photography: ['foto', 'fotografi', 'fotograf', 'photo', 'bilde'],
    travel: ['reise', 'ferie', 'tur', 'travel', 'cabin', 'hytte'],
    food: ['mat', 'oppskrift', 'kafe', 'kaffe', 'restaurant', 'food', 'baking', 'bake'],
    fashion: ['mote', 'klær', 'stil', 'fashion', 'outfit'],
    fitness: ['trening', 'fitness', 'gym', 'løping', 'helse', 'workout'],
    business: ['business', 'gründer', 'gründerliv', 'bedrift', 'markedsføring', 'entreprenør', 'startup'],
    tech: ['teknologi', 'tech', 'koding', 'programmering', 'utvikler', 'data'],
    art: ['kunst', 'design', 'illustrasjon', 'tegning', 'art'],
    music: ['musikk', 'music', 'band', 'sang', 'konsert'],
    nature: ['natur', 'friluft', 'fjell', 'skog', 'fjord', 'nature'],
};

// Hashtags per kategori
const HASHTAG_PREFIXES: Record<string, string[]> = {
    photography: ['foto', 'fotografi', 'norgefoto', 'photography', 'bildeavdagen', 'fotograf'],
    travel: ['reise', 'reiseliv', 'visitnorway', 'norgeserbra', 'reisetips', 'travel'],
    food: ['mat', 'matglede', 'matblogg', 'oppskrift', 'godmat', 'foodie'],
    fashion: ['mote', 'stil', 'ootd', 'norskmote', 'moteblogger', 'streetstyle'],
    fitness: ['trening', 'treningsglede', 'motivasjon', 'fitness', 'helse', 'treningstips'],
    business: ['business', 'gründer', 'markedsføring', 'startup', 'entreprenør', 'suksess'],
    tech: ['teknologi', 'tech', 'koding', 'programmering', 'utvikler', 'programvare'],
    art: ['kunst', 'kunstner', 'design', 'illustrasjon', 'kreativ', 'tegning'],
    music: ['musikk', 'musiker', 'nymusikk', 'sang', 'band', 'konsert'],
    nature: ['natur', 'friluftsliv', 'norsknatur', 'fjellet', 'utepåtur', 'naturelsker'],
};

const GENERAL_POPULAR = [
    'norge', 'norway', 'inspirasjon', 'hverdagen', 'glede', 'trending', 'viral',
    'utforsk', 'fyp', 'foryou', 'foryoupage',
];

const PLATFORM_SPECIFIC: Record<string, string[]> = {
    instagram: ['instadaily', 'instanorge', 'norskinstagram', 'insta', 'instamood'],
    twitter: ['twittertrends', 'trending', 'viral', 'mustread'],
    tiktok: ['fyp', 'foryou', 'foryoupage', 'viral', 'trending', 'tiktok'],
    linkedin: ['nettverk', 'karriere', 'ledelse', 'profesjonell', 'vekst'],
};

/**
 * Finner relevante kategorier ut fra emnet
 */
function findRelevantCategories(topic: string): string[] {
    const lowerTopic = topic.toLowerCase();
    const categories: string[] = [];

    Object.entries(CATEGORY_TRIGGERS).forEach(([category, triggers]) => {
        if (triggers.some(t => lowerTopic.includes(t))) {
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
        .replace(/[^a-z0-9æøåäö\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2);

    topicWords.forEach(word => {
        hashtags.add(word);
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
