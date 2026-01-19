'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Download, FileText } from 'lucide-react';

interface TermsConfig {
  websiteName: string;
  websiteUrl: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  country: string;
  hasUserAccounts: boolean;
  hasSubscriptions: boolean;
  hasUserContent: boolean;
  sellsProducts: boolean;
  sellsDigitalProducts: boolean;
  hasRefundPolicy: boolean;
  refundDays: number;
  allowsTermination: boolean;
}

const DEFAULT_CONFIG: TermsConfig = {
  websiteName: '',
  websiteUrl: '',
  companyName: '',
  contactEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  country: 'United States',
  hasUserAccounts: true,
  hasSubscriptions: false,
  hasUserContent: false,
  sellsProducts: false,
  sellsDigitalProducts: false,
  hasRefundPolicy: true,
  refundDays: 30,
  allowsTermination: true,
};

function generateTermsConditions(config: TermsConfig): string {
  const date = new Date(config.effectiveDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let terms = `TERMS AND CONDITIONS

Last updated: ${date}

Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using ${config.websiteName || 'this website'}${config.websiteUrl ? ` (${config.websiteUrl})` : ''} (the "Service") operated by ${config.companyName || 'us'} ("us", "we", or "our").

Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.

By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.

1. ACCEPTANCE OF TERMS

By accessing and using this Service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.

`;

  if (config.hasUserAccounts) {
    terms += `2. USER ACCOUNTS

When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.

You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

`;
  }

  if (config.hasUserContent) {
    terms += `3. USER CONTENT

Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.

By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.

You represent and warrant that: (i) the Content is yours or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.

`;
  }

  if (config.sellsProducts || config.sellsDigitalProducts) {
    terms += `4. PURCHASES

If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.

You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.

By submitting such information, you grant us the right to provide the information to third parties for purposes of facilitating the completion of Purchases.

We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.

`;
  }

  if (config.hasSubscriptions) {
    terms += `5. SUBSCRIPTIONS

Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.

At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or we cancel it. You may cancel your Subscription renewal either through your online account management page or by contacting our customer support team.

A valid payment method, including credit card, is required to process the payment for your Subscription. You shall provide accurate and complete billing information including full name, address, state, zip code, telephone number, and valid payment method information.

`;
  }

  if (config.hasRefundPolicy) {
    terms += `6. REFUND POLICY

${config.sellsDigitalProducts ? 
`Due to the nature of digital products, we generally do not offer refunds once a purchase has been completed and the digital content has been delivered or accessed. However, we may consider refund requests on a case-by-case basis within ${config.refundDays} days of purchase if the product is defective or not as described.` :
`We offer refunds within ${config.refundDays} days of purchase. To be eligible for a refund, items must be unused and in the same condition that you received them. To initiate a refund, please contact us at ${config.contactEmail || 'our support email'}.`}

`;
  }

  terms += `7. INTELLECTUAL PROPERTY

The Service and its original content, features, and functionality are and will remain the exclusive property of ${config.companyName || 'us'} and its licensors. The Service is protected by copyright, trademark, and other laws of both the ${config.country} and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ${config.companyName || 'us'}.

8. LINKS TO OTHER WEBSITES

Our Service may contain links to third-party websites or services that are not owned or controlled by ${config.companyName || 'us'}.

${config.companyName || 'We'} has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that ${config.companyName || 'we'} shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such websites or services.

9. LIMITATION OF LIABILITY

In no event shall ${config.companyName || 'we'}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.

10. DISCLAIMER

Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.

`;

  if (config.allowsTermination) {
    terms += `11. TERMINATION

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.

`;
  }

  terms += `12. GOVERNING LAW

These Terms shall be governed and construed in accordance with the laws of ${config.country}, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.

13. CHANGES TO TERMS

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.

14. CONTACT US

If you have any questions about these Terms, please contact us:
${config.contactEmail ? `• By email: ${config.contactEmail}` : '• Through our website contact form'}
${config.websiteUrl ? `• By visiting: ${config.websiteUrl}` : ''}
`;

  return terms;
}

export function TermsConditionsGenerator() {
  const [config, setConfig] = React.useState<TermsConfig>(DEFAULT_CONFIG);
  const [terms, setTerms] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const updateConfig = <K extends keyof TermsConfig>(key: K, value: TermsConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    const generated = generateTermsConditions(config);
    setTerms(generated);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(terms);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleDownload = () => {
    const blob = new Blob([terms], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'terms-and-conditions.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Terms & Conditions Generator
        </CardTitle>
        <CardDescription>
          Generate terms of service for your website or app
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
              placeholder="legal@example.com"
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
          <div className="space-y-2">
            <Label htmlFor="country">Governing Law Country</Label>
            <Input
              id="country"
              value={config.country}
              onChange={(e) => updateConfig('country', e.target.value)}
              placeholder="United States"
            />
          </div>
        </div>

        {/* Service Features */}
        <div className="space-y-4">
          <h3 className="font-semibold">Service Features</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasUserAccounts}
                onChange={(e) => updateConfig('hasUserAccounts', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Has user accounts/registration</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasSubscriptions}
                onChange={(e) => updateConfig('hasSubscriptions', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Offers subscriptions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasUserContent}
                onChange={(e) => updateConfig('hasUserContent', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Users can post content</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.sellsProducts}
                onChange={(e) => updateConfig('sellsProducts', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Sells physical products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.sellsDigitalProducts}
                onChange={(e) => updateConfig('sellsDigitalProducts', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Sells digital products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowsTermination}
                onChange={(e) => updateConfig('allowsTermination', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Can terminate accounts</span>
            </label>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="space-y-4">
          <h3 className="font-semibold">Refund Policy</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasRefundPolicy}
                onChange={(e) => updateConfig('hasRefundPolicy', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm">Include refund policy</span>
            </label>
            {config.hasRefundPolicy && (
              <div className="flex items-center gap-2">
                <Label htmlFor="refundDays" className="text-sm">Refund period:</Label>
                <Input
                  id="refundDays"
                  type="number"
                  value={config.refundDays}
                  onChange={(e) => updateConfig('refundDays', parseInt(e.target.value) || 30)}
                  className="w-20"
                  min={1}
                  max={365}
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} className="w-full">
          Generate Terms & Conditions
        </Button>

        {/* Generated Terms */}
        {terms && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Generated Terms & Conditions</h3>
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
              <pre className="text-sm whitespace-pre-wrap font-mono">{terms}</pre>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">⚠️ Disclaimer:</p>
          <p>This generator creates a basic terms and conditions template. For legal compliance, please consult with a qualified attorney to ensure your terms meet all applicable laws and regulations.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TermsConditionsGenerator;
