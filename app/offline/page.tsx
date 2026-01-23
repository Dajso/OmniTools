import type { Metadata } from 'next';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

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
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
                {/* Offline Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-4">
                        <WifiOff className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4">You're Offline</h1>

                {/* Description */}
                <p className="text-muted-foreground mb-8 text-lg">
                    It looks like you've lost your internet connection.
                    Don't worry — some pages and calculators may still be available offline.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" aria-hidden="true" />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-background font-medium hover:bg-muted transition-colors"
                    >
                        <Home className="w-5 h-5" aria-hidden="true" />
                        Go to Homepage
                    </Link>
                </div>

                {/* Tips */}
                <div className="mt-12 text-left bg-muted/30 rounded-lg p-6 border border-border">
                    <h2 className="font-semibold mb-3">Tips for offline use:</h2>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Previously visited calculators are cached for offline access</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Your calculator history is saved locally on your device</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Install OmniTools as an app for better offline experience</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
