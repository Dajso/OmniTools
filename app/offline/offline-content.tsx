'use client';

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export function OfflineContent() {
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
                <h1 className="text-3xl font-bold mb-4">Du er frakoblet</h1>

                {/* Description */}
                <p className="text-muted-foreground mb-8 text-lg">
                    Det ser ut til at du har mistet internettforbindelsen.
                    Ta det rolig – noen sider og kalkulatorer kan fortsatt virke uten nett.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" aria-hidden="true" />
                        Prøv igjen
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-background font-medium hover:bg-muted transition-colors"
                    >
                        <Home className="w-5 h-5" aria-hidden="true" />
                        Gå til forsiden
                    </Link>
                </div>

                {/* Tips */}
                <div className="mt-12 text-left bg-muted/30 rounded-lg p-6 border border-border">
                    <h2 className="font-semibold mb-3">Tips for bruk uten nett:</h2>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Kalkulatorer du har besøkt før er lagret for bruk uten nett</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Historikken din lagres lokalt på enheten din</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>Installer Kalkulator som app for best opplevelse uten nett</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
