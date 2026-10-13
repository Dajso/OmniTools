/**
 * Kalkulator – Service Worker (Hjemmetavla)
 * 
 * Provides offline support, caching, and background sync for the PWA.
 * Uses a cache-first strategy for static assets and network-first for dynamic content.
 * 
 * @version 1.0.0
 */

const CACHE_NAME = 'kalkulator-v2';
const STATIC_CACHE_NAME = 'kalkulator-static-v2';
const DYNAMIC_CACHE_NAME = 'kalkulator-dynamic-v2';

// Static assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Routes to cache dynamically
const CACHEABLE_ROUTES = [
    '/calculators',
    '/calculators/finance',
    '/calculators/health',
    '/calculators/home',
    '/calculators/auto',
    '/calculators/solar',
    '/convert',
];

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Install event - caches static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

/**
 * Activate event - cleans up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old cache versions
                            return (cacheName.startsWith('omnitools-') || cacheName.startsWith('kalkulator-')) &&
                                cacheName !== STATIC_CACHE_NAME &&
                                cacheName !== DYNAMIC_CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - handles network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (url.origin !== self.location.origin) {
        return;
    }

    // Skip API requests and development resources
    if (url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/_next/') ||
        url.pathname.includes('hot-update')) {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(url.pathname)) {
        // Cache-first for static assets
        event.respondWith(cacheFirst(request));
    } else if (isCalculatorPage(url.pathname)) {
        // Stale-while-revalidate for calculator pages
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Network-first for other pages
        event.respondWith(networkFirst(request));
    }
});

/**
 * Check if the pathname is a static asset
 */
function isStaticAsset(pathname) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

/**
 * Check if the pathname is a calculator page
 */
function isCalculatorPage(pathname) {
    return pathname.startsWith('/calculators');
}

/**
 * Cache-first strategy
 * Returns cached version if available, otherwise fetches from network
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] Cache-first fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network-first strategy
 * Tries to fetch from network first, falls back to cache
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('[SW] Network request failed, trying cache:', request.url);
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline');
            if (offlinePage) {
                return offlinePage;
            }
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Stale-while-revalidate strategy
 * Returns cached version immediately while fetching update in background
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request)
        .then((response) => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch((error) => {
            console.log('[SW] Stale-while-revalidate fetch failed:', error);
            return null;
        });

    return cached || fetchPromise;
}

/**
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'sync-calculator-data') {
        event.waitUntil(syncCalculatorData());
    }
});

/**
 * Sync calculator data when back online
 */
async function syncCalculatorData() {
    // Placeholder for syncing calculator history or preferences
    console.log('[SW] Syncing calculator data...');
    return Promise.resolve();
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Ny oppdatering er tilgjengelig!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Kalkulator', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((windowClients) => {
                // Focus existing window if available
                for (const client of windowClients) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

console.log('[SW] Service Worker loaded');
