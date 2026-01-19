'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Download, Shield } from 'lucide-react';

interface PolicyConfig {
  websiteName: string;
  websiteUrl: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  collectsPersonalInfo: boolean;
  collectsEmail: boolean;
  collectsName: boolean;
  collectsPayment: boolean;
  usesCookies: boolean;
  usesAnalytics: boolean;
  usesThirdPartyServices: boolean;
  allowsUserAccounts: boolean;
  sellsData: boolean;
  targetChildren: boolean;
}

const DEFAULT_CONFIG: PolicyConfig = {
  websiteName: '',
  websiteUrl: '',
  companyName: '',
  contactEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  collectsPersonalInfo: true,
  collectsEmail: true,
  collectsName: true,
  collectsPayment: false,
  usesCookies: true,
  usesAnalytics: true,
  usesThirdPartyServices: false,
  allowsUserAccounts: false,
  sellsData: false,
  targetChildren: false,
};

function generatePrivacyPolicy(config: PolicyConfig): string {
  const date = new Date(config.effectiveDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let policy = `PRIVACY POLICY

Last updated: ${date}

${config.companyName || 'We'} ("us", "we", or "our") operates ${config.websiteName || 'this website'}${config.websiteUrl ? ` (${config.websiteUrl})` : ''}. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.

By using the Service, you agree to the collection and use of information in accordance with this policy.

INFORMATION COLLECTION AND USE

`;

  if (config.collectsPersonalInfo) {
    policy += `While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:\n\n`;
    
    if (config.collectsEmail) policy += `• Email address\n`;
    if (config.collectsName) policy += `• First name and last name\n`;
    if (config.collectsPayment) policy += `• Payment information (credit card numbers, billing address)\n`;
    if (config.allowsUserAccounts) policy += `• Account credentials (username, password)\n`;
    
    policy += `\n`;
  }

  if (config.usesCookies) {
    policy += `COOKIES

Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive.

We use cookies to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.

`;
  }

  if (config.usesAnalytics) {
    policy += `ANALYTICS

We may use third-party Service Providers to monitor and analyze the use of our Service. These services may collect information sent by your browser as part of a web page request, such as cookies or your IP address.

`;
  }

  if (config.usesThirdPartyServices) {
    policy += `THIRD-PARTY SERVICES

We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.

These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

`;
  }

  policy += `DATA SECURITY

The security of your Personal Information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.

`;

  if (!config.sellsData) {
    policy += `DATA SHARING

We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.

`;
  }

  if (config.targetChildren) {
    policy += `CHILDREN'S PRIVACY

Our Service may be directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13 without parental consent. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us.

`;
  } else {
    policy += `CHILDREN'S PRIVACY

Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers.

`;
  }

  policy += `YOUR RIGHTS

You have the right to:
• Access the personal information we hold about you
• Request correction of inaccurate personal information
• Request deletion of your personal information
• Object to processing of your personal information
• Request restriction of processing your personal information
• Request transfer of your personal information
• Withdraw consent at any time

CHANGES TO THIS PRIVACY POLICY

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

CONTACT US

If you have any questions about this Privacy Policy, please contact us:
${config.contactEmail ? `• By email: ${config.contactEmail}` : '• Through our website contact form'}
${config.websiteUrl ? `• By visiting: ${config.websiteUrl}` : ''}
`;

  return policy;
}

export function PrivacyPolicyGenerator() {
  const [config, setConfig] = React.useState<PolicyConfig>(DEFAULT_CONFIG);
  const [policy, setPolicy] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const updateConfig = <K extends keyof PolicyConfig>(key: K, value: PolicyConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    const generated = generatePrivacyPolicy(config);
    setPolicy(generated);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(policy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleDownload = () => {
    const blob = new Blob([policy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'privacy-policy.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Policy Generator
        </CardTitle>
        <CardDescription>
          Generate a privacy policy for your website or app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="websiteName">Website/App Name *</Label>
            <Input
              id="websiteName"
              value={config.websiteName}
              onChange={(e) => updateConfig('websiteName', e.target.value)}
              placeholder="My Website"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              value={config.websiteUrl}
              onChange={(e) => updateConfig('websiteUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company/Owner Name</Label>
            <Input
              id="companyName"
              value={config.companyName}
              onChange={(e) => updateConfig('companyName', e.target.value)}
              placeholder="Your Company LLC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={config.contactEmail}
              onChange={(e) => updateConfig('contactEmail', e.target.value)}
              placeholder="privacy@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={config.effectiveDate}
              onChange={(e) => updateConfig('effectiveDate', e.target.value)}
            />
          </div>
        </div>

        {/* Data Collection Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">Data Collection</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.collectsEmail}
                onChange={(e) => updateConfig('collectsEmail', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Collects email addresses</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.collectsName}
                onChange={(e) => updateConfig('collectsName', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Collects names</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.collectsPayment}
                onChange={(e) => updateConfig('collectsPayment', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Collects payment information</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowsUserAccounts}
                onChange={(e) => updateConfig('allowsUserAccounts', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Has user accounts</span>
            </label>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="font-semibold">Features & Services</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.usesCookies}
                onChange={(e) => updateConfig('usesCookies', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Uses cookies</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.usesAnalytics}
                onChange={(e) => updateConfig('usesAnalytics', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Uses analytics (Google Analytics, etc.)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.usesThirdPartyServices}
                onChange={(e) => updateConfig('usesThirdPartyServices', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Uses third-party services</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.sellsData}
                onChange={(e) => updateConfig('sellsData', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Sells user data to third parties</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.targetChildren}
                onChange={(e) => updateConfig('targetChildren', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Targets children under 13 (COPPA)</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} className="w-full">
          Generate Privacy Policy
        </Button>

        {/* Generated Policy */}
        {policy && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Generated Privacy Policy</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{policy}</pre>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">⚠️ Disclaimer:</p>
          <p>This generator creates a basic privacy policy template. For legal compliance, please consult with a qualified attorney to ensure your privacy policy meets all applicable laws and regulations (GDPR, CCPA, etc.).</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PrivacyPolicyGenerator;
