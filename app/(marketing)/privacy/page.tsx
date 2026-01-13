import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for OmniTools - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 12, 2026';
  const contactEmail = 'privacy@omnitools.com';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        
        <p className="text-sm text-gray-500 mt-2">
          Last Updated: {lastUpdated}
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
          <p className="mt-4 text-gray-600">
            Welcome to OmniTools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting 
            your privacy and ensuring you have a positive experience on our website. This Privacy 
            Policy explains how we collect, use, disclose, and safeguard your information when you 
            visit our website.
          </p>
          <p className="mt-4 text-gray-600">
            Please read this privacy policy carefully. If you do not agree with the terms of this 
            privacy policy, please do not access the site.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">2.1 Information Automatically Collected</h3>
          <p className="mt-4 text-gray-600">
            When you visit our website, we may automatically collect certain information about your 
            device, including:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address (anonymized)</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mt-6">2.2 Local Storage</h3>
          <p className="mt-4 text-gray-600">
            Our calculators and tools may store your preferences and recent calculations in your 
            browser&apos;s local storage. This data never leaves your device and is not transmitted 
            to our servers. You can clear this data at any time through your browser settings or 
            by using our &quot;Clear My Data&quot; feature.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">2.3 Information We Do NOT Collect</h3>
          <p className="mt-4 text-gray-600">
            We do not collect:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Personal identification information (name, email, phone number)</li>
            <li>Financial information</li>
            <li>Health information entered into our calculators</li>
            <li>Any data you enter into our tools (all calculations are performed locally)</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
          <p className="mt-4 text-gray-600">
            We use the automatically collected information to:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Analyze website traffic and usage patterns</li>
            <li>Improve our website and user experience</li>
            <li>Diagnose technical problems</li>
            <li>Understand which tools are most popular</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">4. Cookies and Tracking Technologies</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">4.1 Essential Cookies</h3>
          <p className="mt-4 text-gray-600">
            We use essential cookies that are necessary for the website to function properly. 
            These cannot be disabled.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">4.2 Analytics Cookies</h3>
          <p className="mt-4 text-gray-600">
            With your consent, we may use analytics cookies to understand how visitors interact 
            with our website. You can opt out of these cookies through our cookie consent banner.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">4.3 Advertising Cookies</h3>
          <p className="mt-4 text-gray-600">
            With your consent, we may use advertising cookies to display relevant advertisements. 
            These cookies may be set by our advertising partners. You can opt out of these cookies 
            through our cookie consent banner.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">5. Third-Party Services</h2>
          <p className="mt-4 text-gray-600">
            We may use third-party services that collect, monitor, and analyze data:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>
              <strong>Google Analytics:</strong> For website analytics. 
              <Link href="https://policies.google.com/privacy" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </Link>
            </li>
            <li>
              <strong>Google AdSense:</strong> For displaying advertisements. 
              <Link href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                Google Ads Policy
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">6.1 GDPR Rights (European Users)</h3>
          <p className="mt-4 text-gray-600">
            If you are a resident of the European Economic Area (EEA), you have certain data 
            protection rights:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li><strong>Right to Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request restriction of processing</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mt-6">6.2 CCPA Rights (California Residents)</h3>
          <p className="mt-4 text-gray-600">
            If you are a California resident, you have the right to:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Know what personal information is being collected</li>
            <li>Know whether your personal information is sold or disclosed</li>
            <li>Say no to the sale of personal information</li>
            <li>Access your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Not be discriminated against for exercising your privacy rights</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">7. Data Retention</h2>
          <p className="mt-4 text-gray-600">
            We retain automatically collected data for a period of 26 months. Local storage data 
            on your device is retained until you clear it manually or through our data deletion 
            feature.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">8. Data Security</h2>
          <p className="mt-4 text-gray-600">
            We implement appropriate technical and organizational security measures to protect 
            your information. However, no method of transmission over the Internet or electronic 
            storage is 100% secure.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">9. Children&apos;s Privacy</h2>
          <p className="mt-4 text-gray-600">
            Our website is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">10. Changes to This Privacy Policy</h2>
          <p className="mt-4 text-gray-600">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">11. Contact Us</h2>
          <p className="mt-4 text-gray-600">
            If you have questions about this Privacy Policy or wish to exercise your data rights, 
            please contact us at:
          </p>
          <p className="mt-4 text-gray-600">
            Email:{' '}
            <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
              {contactEmail}
            </a>
          </p>
        </section>

        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900">Clear Your Data</h2>
          <p className="mt-4 text-gray-600">
            You can clear all locally stored data (preferences, calculation history) at any time. 
            This action cannot be undone.
          </p>
          <ClearDataButton />
        </section>
      </article>
    </div>
  );
}

// Client component for the clear data button
function ClearDataButton() {
  return (
    <div className="mt-4">
      <a
        href="/privacy/clear-data"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Clear My Data
      </a>
    </div>
  );
}
