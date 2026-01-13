import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for OmniTools - Read our terms and conditions for using our calculators and converters.',
};

/**
 * Terms of Service Page
 * Standard terms content for the website
 * 
 * **Validates: Requirements 12.3**
 */
export default function TermsOfServicePage() {
  const lastUpdated = 'January 12, 2026';
  const contactEmail = 'legal@omnitools.com';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        
        <p className="text-sm text-gray-500 mt-2">
          Last Updated: {lastUpdated}
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="mt-4 text-gray-600">
            By accessing and using OmniTools (&quot;the Website&quot;), you accept and agree to be 
            bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, 
            please do not use the Website.
          </p>
          <p className="mt-4 text-gray-600">
            We reserve the right to modify these Terms at any time. Your continued use of the 
            Website following any changes constitutes acceptance of those changes.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">2. Description of Service</h2>
          <p className="mt-4 text-gray-600">
            OmniTools provides free online calculators, converters, and productivity tools 
            for personal and educational use. Our tools include but are not limited to:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Financial calculators (mortgage, compound interest, etc.)</li>
            <li>Health and fitness calculators (BMI, TDEE, etc.)</li>
            <li>Home and DIY calculators (paint, concrete, etc.)</li>
            <li>Unit converters (length, weight, temperature, etc.)</li>
            <li>Productivity tools (word counter, password generator, etc.)</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">3. Disclaimer of Warranties</h2>
          <p className="mt-4 text-gray-600">
            THE WEBSITE AND ALL TOOLS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT 
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Implied warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy, reliability, or completeness of results</li>
          </ul>
          <p className="mt-4 text-gray-600">
            We do not warrant that the Website will be uninterrupted, error-free, or free of 
            viruses or other harmful components.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">4. Limitation of Liability</h2>
          <p className="mt-4 text-gray-600">
            IN NO EVENT SHALL OMNITOOLS, ITS OWNERS, OPERATORS, OR AFFILIATES BE LIABLE FOR 
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
            OUT OF OR RELATED TO YOUR USE OF THE WEBSITE OR TOOLS.
          </p>
          <p className="mt-4 text-gray-600">
            This includes, without limitation, damages for:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Loss of profits, data, or other intangible losses</li>
            <li>Financial decisions made based on calculator results</li>
            <li>Health decisions made based on calculator results</li>
            <li>Construction or home improvement decisions based on calculator results</li>
            <li>Any errors or inaccuracies in calculations</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">5. Not Professional Advice</h2>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-gray-700 font-medium">
              Important: Our tools are for informational and educational purposes only.
            </p>
          </div>
          <p className="mt-4 text-gray-600">
            The calculators and tools on this Website do not constitute:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>
              <strong>Financial Advice:</strong> Consult a qualified financial advisor, 
              accountant, or tax professional for financial decisions.
            </li>
            <li>
              <strong>Medical Advice:</strong> Consult a qualified healthcare provider for 
              health-related decisions. Our health calculators are estimates only.
            </li>
            <li>
              <strong>Legal Advice:</strong> Consult a qualified attorney for legal matters.
            </li>
            <li>
              <strong>Professional Construction Advice:</strong> Consult licensed contractors 
              or engineers for construction and home improvement projects.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">6. Accuracy of Calculations</h2>
          <p className="mt-4 text-gray-600">
            While we strive to provide accurate calculations, we cannot guarantee the accuracy 
            of any results. Calculations may be affected by:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Rounding errors</li>
            <li>Floating-point precision limitations</li>
            <li>Simplified formulas that may not account for all variables</li>
            <li>Regional variations in standards and regulations</li>
            <li>Changes in tax rates, interest rates, or other external factors</li>
          </ul>
          <p className="mt-4 text-gray-600">
            Always verify important calculations with appropriate professionals or official sources.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">7. Acceptable Use</h2>
          <p className="mt-4 text-gray-600">
            You agree not to use the Website to:
          </p>
          <ul className="mt-4 list-disc pl-6 text-gray-600">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Website or servers</li>
            <li>Use automated systems to access the Website without permission</li>
            <li>Collect or harvest user information</li>
            <li>Transmit viruses, malware, or other harmful code</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">8. Intellectual Property</h2>
          <p className="mt-4 text-gray-600">
            All content on the Website, including but not limited to text, graphics, logos, 
            icons, images, and software, is the property of OmniTools or its content 
            suppliers and is protected by copyright and other intellectual property laws.
          </p>
          <p className="mt-4 text-gray-600">
            You may use the Website and tools for personal, non-commercial purposes. You may 
            not reproduce, distribute, modify, or create derivative works without our prior 
            written consent.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">9. Third-Party Links</h2>
          <p className="mt-4 text-gray-600">
            The Website may contain links to third-party websites. These links are provided 
            for your convenience only. We do not endorse or assume responsibility for the 
            content, privacy policies, or practices of any third-party websites.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">10. Advertising</h2>
          <p className="mt-4 text-gray-600">
            The Website may display advertisements from third-party advertising networks. 
            These advertisements may use cookies and similar technologies. Please refer to 
            our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            for more information about advertising and cookies.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">11. Indemnification</h2>
          <p className="mt-4 text-gray-600">
            You agree to indemnify, defend, and hold harmless OmniTools and its owners, 
            operators, affiliates, and agents from and against any claims, liabilities, 
            damages, losses, and expenses arising out of or in any way connected with your 
            use of the Website or violation of these Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">12. Termination</h2>
          <p className="mt-4 text-gray-600">
            We reserve the right to terminate or suspend access to the Website at any time, 
            without prior notice or liability, for any reason, including breach of these Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">13. Governing Law</h2>
          <p className="mt-4 text-gray-600">
            These Terms shall be governed by and construed in accordance with the laws of 
            the United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">14. Severability</h2>
          <p className="mt-4 text-gray-600">
            If any provision of these Terms is found to be unenforceable or invalid, that 
            provision shall be limited or eliminated to the minimum extent necessary, and 
            the remaining provisions shall remain in full force and effect.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">15. Entire Agreement</h2>
          <p className="mt-4 text-gray-600">
            These Terms, together with our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            , constitute the entire agreement between you and OmniTools regarding the 
            use of the Website.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">16. Contact Information</h2>
          <p className="mt-4 text-gray-600">
            If you have any questions about these Terms, please contact us at:
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
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
              {' '}- Information about cookies we use
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
