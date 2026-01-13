'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

/**
 * Clear Data Page
 * Allows users to clear all locally stored data (GDPR/CCPA compliance)
 * 
 * **Validates: Requirements 12.2, 12.6**
 */
export default function ClearDataPage() {
  const [cleared, setCleared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClearData = () => {
    try {
      // List of all localStorage keys used by the application
      const keysToRemove = [
        'cookie-consent',
        'locale-settings',
        'calculator-history',
        'unit-preferences',
        'recent-tools',
        'theme-preference',
      ];

      // Clear each key
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Also clear any keys that match our patterns
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (
          key.startsWith('calc-') ||
          key.startsWith('converter-') ||
          key.startsWith('tool-')
        ) {
          localStorage.removeItem(key);
        }
      });

      setCleared(true);
      setError(null);
    } catch (err) {
      setError('Failed to clear data. Please try again or clear your browser data manually.');
      console.error('Error clearing data:', err);
    }
  };

  if (cleared) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <CardTitle className="text-xl">Data Cleared Successfully</CardTitle>
            <CardDescription>
              All your locally stored data has been removed from this browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-600">
            <p>
              Your preferences, calculation history, and other stored data have been deleted.
              You may need to reconfigure your preferences when using our tools.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">Clear Your Data</CardTitle>
          <CardDescription>
            This will permanently delete all your locally stored data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The following data will be removed:
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>Cookie consent preferences</li>
              <li>Unit system preferences (Imperial/Metric)</li>
              <li>Locale and formatting preferences</li>
              <li>Recent calculation history</li>
              <li>Recently used tools</li>
            </ul>
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This action cannot be undone. You will need to reconfigure your preferences.
                  </p>
                </div>
              </div>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link href="/privacy">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleClearData}>
            Clear All My Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
