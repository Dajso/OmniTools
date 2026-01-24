'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Download, Smartphone, Monitor, Share, Zap, WifiOff, Sparkles, Home, ChevronDown, ChevronUp } from 'lucide-react';
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

// Install benefits configuration
const installBenefits = [
    {
        icon: Zap,
        title: 'Faster Loading',
        description: 'Local cache for instant startup',
    },
    {
        icon: WifiOff,
        title: 'Works Offline',
        description: 'Use without internet connection',
    },
    {
        icon: Home,
        title: 'Home Screen Access',
        description: 'One-tap access, no browser needed',
    },
    {
        icon: Sparkles,
        title: 'Native Experience',
        description: 'Full-screen immersive interface',
    },
];

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
    const [isExpanded, setIsExpanded] = useState(false);

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
            {/* Install Banner - Enhanced with Benefits */}
            <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300">
                <div className="bg-gradient-to-r from-primary/95 via-primary to-primary/90 backdrop-blur-md border-t border-primary-foreground/10 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                        {/* Main Row */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Icon and Text */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/20 shrink-0 ring-2 ring-primary-foreground/30">
                                    {isIOS ? (
                                        <Smartphone className="w-6 h-6 text-primary-foreground" />
                                    ) : (
                                        <Monitor className="w-6 h-6 text-primary-foreground" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-primary-foreground truncate">
                                            Install OmniTools
                                        </p>
                                        <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-primary-foreground/20 text-primary-foreground rounded-full">
                                            Free
                                        </span>
                                    </div>
                                    <p className="text-sm text-primary-foreground/80 hidden sm:block">
                                        Add 500+ calculator tools to your home screen for quick access anytime
                                    </p>
                                    {/* Mobile: Short benefit preview */}
                                    <p className="text-xs text-primary-foreground/70 sm:hidden mt-0.5">
                                        Offline · Faster · Native
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Expand button for mobile */}
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="sm:hidden p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-primary-foreground" />
                                    ) : (
                                        <ChevronUp className="w-5 h-5 text-primary-foreground" />
                                    )}
                                </button>
                                <Button
                                    onClick={handleInstall}
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium shadow-lg"
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

                        {/* Desktop Benefits Row */}
                        <div className="hidden sm:grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-primary-foreground/10">
                            {installBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                                        <benefit.icon className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-primary-foreground truncate">
                                            {benefit.title}
                                        </p>
                                        <p className="text-xs text-primary-foreground/70 truncate">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Expanded Benefits */}
                        {isExpanded && (
                            <div className="sm:hidden grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-primary-foreground/10 animate-in slide-in-from-top-2 duration-200">
                                {installBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-2 bg-primary-foreground/5 rounded-lg p-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary-foreground/10 shrink-0">
                                            <benefit.icon className="w-3.5 h-3.5 text-primary-foreground" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-primary-foreground">
                                                {benefit.title}
                                            </p>
                                            <p className="text-[10px] text-primary-foreground/70 leading-tight">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Install OmniTools</h2>
                                <button
                                    onClick={() => setShowIOSInstructions(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Benefits Summary */}
                            <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                                <p className="text-sm font-medium mb-3">After installation you will get:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {installBenefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <benefit.icon className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-xs text-muted-foreground">{benefit.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
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
                                                OmniTools will appear on your home screen
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
