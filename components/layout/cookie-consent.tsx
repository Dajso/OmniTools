'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'accepted' | 'rejected' | null;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
    // Initialize analytics and non-essential cookies here
    // Example: initializeAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setShowBanner(false);
    // Disable non-essential cookies
    // The site will continue to function with only essential cookies
  };

  const handleClose = () => {
    // Closing without choice defaults to rejecting non-essential cookies
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setShowBanner(false);
  };

  // Don't render on server to avoid hydration mismatch
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Content */}
          <div className="flex-1 pr-8 sm:pr-0">
            <p id="cookie-consent-description" className="text-sm text-gray-600">
              We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.{' '}
              <Link
                href="/privacy"
                className="font-medium text-blue-600 hover:text-blue-500 underline"
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="order-2 sm:order-1"
            >
              Reject Non-Essential
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAccept}
              className="order-1 sm:order-2"
            >
              Accept All Cookies
            </Button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:relative sm:right-0 sm:top-0"
            aria-label="Close cookie consent banner"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Utility function to check if user has given cookie consent
 * Can be used by other components to conditionally load analytics
 */
export function getCookieConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
}

/**
 * Utility function to clear all user data (for GDPR data deletion requests)
 */
export function clearAllUserData(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = [
    COOKIE_CONSENT_KEY,
    'locale-settings',
    'calculator-history',
    'unit-preferences',
  ];
  
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
