import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Finance Tools',
    links: [
      { name: 'Mortgage Calculator', href: '/calculators/finance/mortgage-calculator' },
      { name: 'Compound Interest', href: '/calculators/finance/compound-interest-calculator' },
      { name: 'Tip Calculator', href: '/calculators/finance/tip-calculator' },
      { name: '401(k) Calculator', href: '/calculators/finance/401k-calculator' },
      { name: 'All Finance Tools', href: '/calculators/finance' },
    ],
  },
  {
    title: 'Health Tools',
    links: [
      { name: 'BMI Calculator', href: '/calculators/health/bmi-calculator' },
      { name: 'TDEE Calculator', href: '/calculators/health/tdee-calculator' },
      { name: 'Macro Calculator', href: '/calculators/health/macro-calculator' },
      { name: 'Sleep Calculator', href: '/calculators/health/sleep-cycle-calculator' },
      { name: 'All Health Tools', href: '/calculators/health' },
    ],
  },
  {
    title: 'Home & DIY',
    links: [
      { name: 'Paint Calculator', href: '/calculators/home/paint-calculator' },
      { name: 'Concrete Calculator', href: '/calculators/home/concrete-calculator' },
      { name: 'Square Footage', href: '/calculators/home/square-footage-calculator' },
      { name: 'Tile Calculator', href: '/calculators/home/tile-calculator' },
      { name: 'All Home Tools', href: '/calculators/home' },
    ],
  },
  {
    title: 'Coffee & Barista',
    links: [
      { name: 'Extraction Yield', href: '/calculators/coffee/extraction-yield-calculator' },
      { name: 'Brew Ratio', href: '/calculators/coffee/brew-ratio-calculator' },
      { name: 'Espresso Dial-in', href: '/calculators/coffee/espresso-dial-in-log' },
      { name: 'Water Recipe', href: '/calculators/coffee/water-recipe-calculator' },
      { name: 'All Coffee Tools', href: '/calculators/coffee' },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Tool category links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Logo and description */}
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-colors">
                <Logo className="h-8 w-8" />
                <span>OmniTools</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400 text-center md:text-left">
                Your all-in-one toolkit for everyday calculations.
              </p>
            </div>

            {/* Legal links */}
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Copyright notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} OmniTools. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              All calculations are for informational purposes only. Please consult a professional for financial, health, or legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
