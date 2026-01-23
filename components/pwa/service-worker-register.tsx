'use client';

import { useEffect, useState } from 'react';

/**
 * Service Worker Registration Component
 * 
 * Registers the service worker and handles updates.
 * Shows a notification when a new version is available.
 */
export function ServiceWorkerRegister() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Only register service worker in production and if supported
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // Skip in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service Worker registration skipped in development mode');
            return;
        }

        const registerServiceWorker = async () => {
            try {
                const reg = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none',
                });

                console.log('[PWA] Service Worker registered successfully');
                setRegistration(reg);

                // Check for updates immediately
                reg.update();

                // Listen for updates
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            console.log('[PWA] New version available');
                            setUpdateAvailable(true);
                        }
                    });
                });

                // Check for updates periodically (every hour)
                setInterval(() => {
                    reg.update();
                }, 60 * 60 * 1000);

            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        };

        // Wait for page load before registering
        if (document.readyState === 'complete') {
            registerServiceWorker();
        } else {
            window.addEventListener('load', registerServiceWorker);
            return () => window.removeEventListener('load', registerServiceWorker);
        }
    }, []);

    // Handle update action
    const handleUpdate = () => {
        if (registration?.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Reload the page to activate the new version
        window.location.reload();
    };

    // Show update notification
    if (updateAvailable) {
        return (
            <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom-4">
                <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="font-medium">Update Available</p>
                        <p className="text-sm opacity-90">A new version of OmniTools is ready.</p>
                    </div>
                    <button
                        onClick={handleUpdate}
                        className="shrink-0 px-4 py-2 bg-primary-foreground text-primary rounded-md font-medium hover:opacity-90 transition-opacity"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default ServiceWorkerRegister;
