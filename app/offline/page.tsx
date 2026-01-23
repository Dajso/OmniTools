import type { Metadata } from 'next';
import { OfflineContent } from './offline-content';

export const metadata: Metadata = {
    title: 'Offline - OmniTools',
    description: 'You are currently offline. Please check your internet connection.',
    robots: {
        index: false,
        follow: false,
    },
};

/**
 * Offline Page
 * 
 * Displayed when the user is offline and the requested page is not cached.
 * Provides options to retry or return to homepage.
 */
export default function OfflinePage() {
    return <OfflineContent />;
}
