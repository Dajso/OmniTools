'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Download, Smartphone, Monitor, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
        appinstalled: Event;
    }
}

/**
 * PWA Install Prompt Component
 * 
 * Shows an install prompt for users to install the web app.
 * Handles both the native install prompt and provides instructions for iOS.
 */
export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (typeof window !== 'undefined') {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://');

            if (isStandalone) {
                setIsInstalled(true);
                return;
            }

            // Detect iOS
            const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            setIsIOS(isIOSDevice);

            // Check if user has dismissed the prompt before
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
            const oneWeek = 7 * 24 * 60 * 60 * 1000;

            if (dismissedTime && Date.now() - dismissedTime < oneWeek) {
                return;
            }
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after a delay (better UX)
            setTimeout(() => {
                setIsVisible(true);
            }, 3000);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            console.log('[PWA] App was installed');
            setIsInstalled(true);
            setIsVisible(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Show iOS install prompt after delay for iOS users
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOSDevice) {
            setTimeout(() => {
                setIsVisible(true);
            }, 5000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                setShowIOSInstructions(true);
            }
            return;
        }

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            console.log('[PWA] User choice:', outcome);

            if (outcome === 'accepted') {
                setIsInstalled(true);
            }

            setDeferredPrompt(null);
            setIsVisible(false);
        } catch (error) {
            console.error('[PWA] Install prompt error:', error);
        }
    }, [deferredPrompt, isIOS]);

    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        setShowIOSInstructions(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }, []);

    // Don't show if already installed
    if (isInstalled || !isVisible) {
        return null;
    }

    return (
        <>
            {/* Install Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300">
                <div className="bg-gradient-to-r from-primary/95 to-primary backdrop-blur-sm border-t border-primary-foreground/10">
                    <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-4">
                            {/* Icon and Text */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/20 shrink-0">
                                    {isIOS ? (
                                        <Smartphone className="w-6 h-6 text-primary-foreground" />
                                    ) : (
                                        <Monitor className="w-6 h-6 text-primary-foreground" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-primary-foreground truncate">
                                        Install OmniTools
                                    </p>
                                    <p className="text-sm text-primary-foreground/80 hidden sm:block">
                                        Get quick access to 100+ calculators right from your home screen
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    onClick={handleInstall}
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Install App</span>
                                    <span className="sm:hidden">Install</span>
                                </Button>
                                <button
                                    onClick={handleDismiss}
                                    className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                                    aria-label="Dismiss install prompt"
                                >
                                    <X className="w-5 h-5 text-primary-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Install OmniTools</h2>
                                <button
                                    onClick={() => setShowIOSInstructions(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    To install OmniTools on your iOS device:
                                </p>

                                <ol className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                                            1
                                        </span>
                                        <div>
                                            <p className="font-medium">Tap the Share button</p>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Share className="w-4 h-4" />
                                                <span>at the bottom of your screen</span>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                                            2
                                        </span>
                                        <div>
                                            <p className="font-medium">Scroll down and tap</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                "Add to Home Screen"
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                                            3
                                        </span>
                                        <div>
                                            <p className="font-medium">Tap "Add"</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                OmniTools will be added to your home screen
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t">
                                <Button
                                    onClick={() => setShowIOSInstructions(false)}
                                    className="w-full"
                                >
                                    Got it!
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default InstallPrompt;
