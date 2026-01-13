import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for OmniTools - Learn about the cookies we use and how to manage them.',
};

/**
 * Cookie Policy Page
 * Explains cookie usage for GDPR/CCPA compliance
 * 
 * **Validates: Requirements 12.1**
 */
export default function CookiePolicyPage() {
  const lastUpdated = 'January 12, 2026';
  const contactEmail = 'privacy@omnitools.com';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Cookie Policy
        </h1>
        
        <p className="text-sm text-gray-500 mt-2">
          Last Updated: {lastUpdated}
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">1. What Are Cookies?</h2>
          <p className="mt-4 text-gray-600">
            Cookies are small text files that are stored on your device (computer, tablet, or 
            mobile) when you visit a website. They help websites remember your preferences and 
            understand how you interact with the site.
          </p>
          <p className="mt-4 text-gray-600">
            This Cookie Policy explains what cookies we use on OmniTools, why we use them, and 
            how you can manage your cookie preferences.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">2. Types of Cookies We Use</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">2.1 Essential Cookies</h3>
          <p className="mt-4 text-gray-600">
            These cookies are necessary for the website to function properly. They enable core 
            functionality such as security, network management, and accessibility. You cannot 
            opt out of these cookies.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">cookie_consent</td>
                  <td className="px-4 py-3 text-sm text-gray-600">OmniTools</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Stores your cookie consent preferences</td>
                  <td className="px-4 py-3 text-sm text-gray-600">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">session_id</td>
                  <td className="px-4 py-3 text-sm text-gray-600">OmniTools</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Maintains session state</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-6">2.2 Analytics Cookies</h3>
          <p className="mt-4 text-gray-600">
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. They help us improve our website and user experience.
          </p>
          
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">_ga</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google Analytics</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Distinguishes unique users</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2 years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">_ga_*</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google Analytics</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Persists session state</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2 years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">_gid</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google Analytics</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Distinguishes users</td>
                  <td className="px-4 py-3 text-sm text-gray-600">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>


          <h3 className="text-lg font-medium text-gray-900 mt-6">2.3 Advertising Cookies</h3>
          <p className="mt-4 text-gray-600">
            These cookies are used to deliver advertisements that are relevant to you and your 
            interests. They also help limit the number of times you see an advertisement and 
            measure the effectiveness of advertising campaigns.
          </p>
          
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">__gads</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google AdSense</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Measures ad interactions</td>
                  <td className="px-4 py-3 text-sm text-gray-600">13 months</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">__gpi</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google AdSense</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Collects ad data</td>
                  <td className="px-4 py-3 text-sm text-gray-600">13 months</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">IDE</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Google DoubleClick</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Targeted advertising</td>
                  <td className="px-4 py-3 text-sm text-gray-600">13 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">3. How to Manage Cookies</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">3.1 Cookie Consent Banner</h3>
          <p className="mt-4 text-gray-600">
            When you first visit our website, you will see a cookie consent banner that allows 
            you to accept or reject non-essential cookies. You can change your preferences at 
            any time by clicking the &quot;Cookie Settings&quot; link in the footer.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">3.2 Browser Settings</h3>
          <p className="mt-4 text-gray-600">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>View what cookies are stored on your device</li>
            <li>Delete all or specific cookies</li>
            <li>Block all cookies or only third-party cookies</li>
            <li>Set preferences for certain websites</li>
          </ul>
          <p className="mt-4 text-gray-600">
            Please note that blocking all cookies may affect the functionality of our website 
            and other websites you visit.
          </p>


          <h3 className="text-lg font-medium text-gray-900 mt-6">3.3 Browser-Specific Instructions</h3>
          <p className="mt-4 text-gray-600">
            Here are links to cookie management instructions for popular browsers:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>
              <Link href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </Link>
            </li>
            <li>
              <Link href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Mozilla Firefox
              </Link>
            </li>
            <li>
              <Link href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Safari
              </Link>
            </li>
            <li>
              <Link href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Microsoft Edge
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Cookies</h2>
          <p className="mt-4 text-gray-600">
            Some cookies on our website are set by third-party services. We use the following 
            third-party services that may set cookies:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>
              <strong>Google Analytics:</strong> For website analytics and understanding user behavior.{' '}
              <Link href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </Link>
            </li>
            <li>
              <strong>Google AdSense:</strong> For displaying relevant advertisements.{' '}
              <Link href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Policy
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-gray-600">
            You can opt out of Google&apos;s use of cookies by visiting the{' '}
            <Link href="https://adssettings.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </Link>{' '}
            page.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">5. Local Storage</h2>
          <p className="mt-4 text-gray-600">
            In addition to cookies, we use browser local storage to save your calculator 
            preferences and recent calculations. This data is stored only on your device and 
            is never transmitted to our servers. You can clear this data at any time through 
            your browser settings or by using our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Clear My Data
            </Link>{' '}
            feature.
          </p>
        </section>


        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">6. Updates to This Policy</h2>
          <p className="mt-4 text-gray-600">
            We may update this Cookie Policy from time to time to reflect changes in our 
            practices or for other operational, legal, or regulatory reasons. We will notify 
            you of any material changes by posting the new Cookie Policy on this page and 
            updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">7. Contact Us</h2>
          <p className="mt-4 text-gray-600">
            If you have any questions about our use of cookies or this Cookie Policy, please 
            contact us at:
          </p>
          <p className="mt-4 text-gray-600">
            Email:{' '}
            <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
              {contactEmail}
            </a>
          </p>
        </section>

        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900">Related Policies</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              {' '}- Learn how we handle your data
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              {' '}- Our terms and conditions
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
