import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { categoryConfig } from '@/lib/constants/category-config';
import { getToolsByCategory, ToolDefinition } from '@/lib/constants/tool-registry';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  href: string;
  links: FooterLink[];
}

// Kategoriene som vises i bunnteksten
const FOOTER_CATEGORY_IDS: ToolDefinition['category'][] = ['finance', 'home', 'health', 'converter'];

/**
 * Bunnteksten bygges fra verktøyregisteret, så lenkene alltid peker på
 * verktøy som finnes. Utvalgte (featured) verktøy kommer først.
 */
function buildFooterSections(): FooterSection[] {
  return FOOTER_CATEGORY_IDS.map((id) => {
    const config = categoryConfig[id];
    const tools = [...getToolsByCategory(id)].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    );
    return {
      title: config.name,
      href: config.href,
      links: tools.slice(0, 4).map((tool) => ({ name: tool.name, href: tool.path })),
    };
  });
}

const legalLinks: FooterLink[] = [{ name: 'Personvern', href: '/personvern' }];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerSections = buildFooterSections();

  return (
    <footer className="bg-gray-900 text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Bunntekst
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Lenker til verktøy */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={section.href}
                    className="text-sm font-medium text-blue-300 hover:text-white transition-colors"
                  >
                    Se alle
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Nederste del */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center md:items-start">
              <Link
                href="/"
                className="flex items-center gap-2 font-display text-xl font-bold text-white hover:text-blue-300 transition-colors"
              >
                <Logo className="h-8 w-8" />
                <span>Kalkulator</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400 text-center md:text-left">
                Kalkulatorer og omregnere tilpasset Norge. En del av Hjemmetavla.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-4 md:gap-6" aria-label="Om siden">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">&copy; {currentYear} Hjemmetavla</p>
            <p className="mt-1 text-xs text-gray-400">
              Beregningene er veiledende. Snakk med en fagperson før du tar viktige beslutninger om økonomi, helse eller bygging.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
