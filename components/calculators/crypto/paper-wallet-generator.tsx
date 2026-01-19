'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';

const WALLET_TYPE_OPTIONS = [
  { value: 'ethereum', label: 'Ethereum (ETH)' },
  { value: 'bitcoin', label: 'Bitcoin (BTC)' },
];

// Generate a random hex string
function generateRandomHex(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Simple mock address generation (for educational purposes only)
function generateMockWallet(type: 'ethereum' | 'bitcoin'): { privateKey: string; publicAddress: string } {
  const privateKey = generateRandomHex(32);
  
  if (type === 'ethereum') {
    // Mock Ethereum address (starts with 0x, 40 hex chars)
    const address = '0x' + generateRandomHex(20);
    return { privateKey: '0x' + privateKey, publicAddress: address };
  } else {
    // Mock Bitcoin address (starts with 1 or 3, base58)
    const mockAddress = '1' + generateRandomHex(16).slice(0, 33);
    return { privateKey, publicAddress: mockAddress };
  }
}

interface WalletData {
  privateKey: string;
  publicAddress: string;
  type: 'ethereum' | 'bitcoin';
}

export function PaperWalletGenerator() {
  const [walletType, setWalletType] = React.useState<'ethereum' | 'bitcoin'>('ethereum');
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);

  const generate = () => {
    if (!acknowledged) return;
    const newWallet = generateMockWallet(walletType);
    setWallet({ ...newWallet, type: walletType });
    setShowPrivateKey(false);
  };

  const reset = () => {
    setWallet(null);
    setAcknowledged(false);
    setShowPrivateKey(false);
  };

  const printWallet = () => {
    window.print();
  };

  return (
    <CalculatorBase
      title="Paper Wallet Generator"
      description="Generate paper wallets for cold storage (Educational Only)"
      onCalculate={generate}
      onReset={reset}
      isCalculateDisabled={!acknowledged}
      results={wallet && (
        <div className="space-y-4 print:space-y-2">
          {/* Security Warning - Always visible */}
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4 print:hidden">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              🚨 Critical Security Warning
            </p>
            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
              <li>• This is for EDUCATIONAL PURPOSES ONLY</li>
              <li>• Do NOT use this for real cryptocurrency</li>
              <li>• Browser-generated keys are NOT secure</li>
              <li>• Use hardware wallets for real funds</li>
            </ul>
          </Card>

          {/* Printable Wallet Card */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 print:border-solid print:border-black">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">
                {wallet.type === 'ethereum' ? 'Ethereum' : 'Bitcoin'} Paper Wallet
              </h3>
              <p className="text-xs text-muted-foreground print:text-black">
                EDUCATIONAL DEMO - NOT FOR REAL USE
              </p>
            </div>

            <div className="space-y-4">
              {/* Public Address */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg print:bg-white print:border print:border-green-500">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  📥 Public Address (Share this to receive funds)
                </p>
                <code className="text-xs font-mono break-all block bg-white dark:bg-gray-800 p-2 rounded print:bg-gray-100">
                  {wallet.publicAddress}
                </code>
                <div className="mt-2 flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                    [QR Code Placeholder]
                  </div>
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg print:bg-white print:border print:border-red-500">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  🔐 Private Key (NEVER share this!)
                </p>
                <div className="relative">
                  <code className={`text-xs font-mono break-all block bg-white dark:bg-gray-800 p-2 rounded print:bg-gray-100 ${!showPrivateKey ? 'blur-sm select-none' : ''}`}>
                    {wallet.privateKey}
                  </code>
                  {!showPrivateKey && (
                    <button
                      type="button"
                      onClick={() => setShowPrivateKey(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/10 rounded print:hidden"
                    >
                      <span className="bg-white px-3 py-1 rounded text-sm">Click to reveal</span>
                    </button>
                  )}
                </div>
                <div className="mt-2 flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                    [QR Code Placeholder]
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground print:text-black">
              <p>Generated: {new Date().toLocaleString()}</p>
              <p className="font-bold mt-2">⚠️ EDUCATIONAL DEMO - DO NOT USE FOR REAL FUNDS ⚠️</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center print:hidden">
            <button
              type="button"
              onClick={printWallet}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              🖨️ Print Wallet
            </button>
          </div>

          {/* Storage Instructions */}
          <Card className="p-4 print:hidden">
            <p className="text-sm font-medium mb-2">Storage Instructions (For Real Wallets)</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Print on a non-networked printer</li>
              <li>• Use acid-free paper for longevity</li>
              <li>• Consider laminating to protect from water</li>
              <li>• Store in a fireproof safe</li>
              <li>• Make multiple copies stored in different locations</li>
              <li>• Never store digital copies</li>
            </ul>
          </Card>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Major Security Warning */}
        <Card className="bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="font-bold text-red-800 dark:text-red-200 text-lg">
                EDUCATIONAL TOOL ONLY
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                <li>• This tool is for <strong>learning purposes only</strong></li>
                <li>• <strong>NEVER</strong> use browser-generated wallets for real funds</li>
                <li>• Browser randomness is NOT cryptographically secure</li>
                <li>• Your keys could be compromised by malware or browser extensions</li>
                <li>• For real crypto, use hardware wallets (Ledger, Trezor)</li>
              </ul>
            </div>
          </div>
        </Card>

        <SelectInput
          id="wallet-type"
          label="Wallet Type"
          value={walletType}
          onChange={(v) => setWalletType(v as 'ethereum' | 'bitcoin')}
          options={WALLET_TYPE_OPTIONS}
        />

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="acknowledge" className="text-sm">
            I understand this is an <strong>educational demonstration only</strong> and I will 
            <strong> NOT</strong> use any generated wallet for real cryptocurrency. I understand 
            that doing so could result in <strong>permanent loss of funds</strong>.
          </label>
        </div>

        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            💡 For Real Cold Storage
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Use official tools like <strong>bitaddress.org</strong> (offline), 
            <strong> Ledger Live</strong>, or <strong>Trezor Suite</strong>. 
            Always generate wallets on an air-gapped computer that has never been connected to the internet.
          </p>
        </Card>
      </div>
    </CalculatorBase>
  );
}

export default PaperWalletGenerator;
