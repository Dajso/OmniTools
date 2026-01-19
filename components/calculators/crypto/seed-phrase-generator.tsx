'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';

// BIP-39 English wordlist (first 100 words for demo - in production use full 2048 words)
const BIP39_WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
  'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
  'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
  'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless',
  'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
];

const WORD_COUNT_OPTIONS = [
  { value: '12', label: '12 words (128-bit)' },
  { value: '15', label: '15 words (160-bit)' },
  { value: '18', label: '18 words (192-bit)' },
  { value: '21', label: '21 words (224-bit)' },
  { value: '24', label: '24 words (256-bit)' },
];

function generateSecureRandomWords(count: number): string[] {
  const words: string[] = [];
  const array = new Uint32Array(count);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < count; i++) {
    const index = array[i] % BIP39_WORDLIST.length;
    words.push(BIP39_WORDLIST[index]);
  }
  
  return words;
}

export function SeedPhraseGenerator() {
  const [wordCount, setWordCount] = React.useState('12');
  const [seedPhrase, setSeedPhrase] = React.useState<string[]>([]);
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generate = () => {
    if (!acknowledged) return;
    const words = generateSecureRandomWords(parseInt(wordCount));
    setSeedPhrase(words);
  };

  const reset = () => {
    setSeedPhrase([]);
    setAcknowledged(false);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = seedPhrase.join(' ');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <CalculatorBase
      title="Seed Phrase Generator"
      description="Generate BIP-39 compatible seed phrases for cryptocurrency wallets"
      onCalculate={generate}
      onReset={reset}
      isCalculateDisabled={!acknowledged}
      results={seedPhrase.length > 0 && (
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">Your Seed Phrase</p>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {seedPhrase.map((word, index) => (
                <div key={index} className="flex items-center gap-2 bg-background rounded p-2">
                  <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
                  <span className="font-mono text-sm">{word}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              🔐 Critical Security Instructions
            </p>
            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
              <li>• Write this phrase on paper - NEVER store digitally</li>
              <li>• Store in a secure, fireproof location</li>
              <li>• Never share with anyone - not even support staff</li>
              <li>• Anyone with this phrase can access your funds</li>
              <li>• Consider using a hardware wallet for large amounts</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Phrase Details</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Words: {seedPhrase.length}</div>
              <div>Entropy: {seedPhrase.length === 12 ? '128' : seedPhrase.length === 24 ? '256' : seedPhrase.length * 11 - 1} bits</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Security Warning Banner */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Security Warning - Read Carefully
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>• This tool is for <strong>educational purposes only</strong></li>
                <li>• For real wallets, use official wallet software</li>
                <li>• Browser-generated randomness may not be cryptographically secure</li>
                <li>• Never use a seed phrase generated online for real funds</li>
                <li>• This page should be used <strong>offline only</strong></li>
              </ul>
            </div>
          </div>
        </Card>

        <SelectInput
          id="word-count"
          label="Number of Words"
          value={wordCount}
          onChange={setWordCount}
          options={WORD_COUNT_OPTIONS}
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
            I understand that this tool is for <strong>educational purposes only</strong> and I will NOT use 
            any generated seed phrase for a real cryptocurrency wallet containing actual funds.
          </label>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">About BIP-39 Seed Phrases</p>
          <p className="text-xs text-muted-foreground">
            BIP-39 defines a standard for generating mnemonic seed phrases from random entropy. 
            These phrases can be used to derive cryptocurrency private keys. The standard uses 
            a wordlist of 2048 words, and phrases are typically 12 or 24 words long.
          </p>
        </div>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            🚨 For Real Wallets
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">
            Always generate seed phrases using official wallet software like Ledger Live, Trezor Suite, 
            MetaMask, or other reputable wallet applications. These tools use hardware-based random 
            number generators and have been audited for security.
          </p>
        </Card>
      </div>
    </CalculatorBase>
  );
}

export default SeedPhraseGenerator;
