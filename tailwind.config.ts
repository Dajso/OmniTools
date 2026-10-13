import type { Config } from 'tailwindcss';

/**
 * Hjemmetavla-palett.
 *
 * Komponentene i prosjektet bruker Tailwinds standardfarger (blue, indigo,
 * gray, slate) rett i klassene. I stedet for å endre hundrevis av filer er
 * disse skalaene byttet ut med Hjemmetavlas farger:
 *   - blue / indigo -> turkis aksent (#1D6C6E på 600)
 *   - gray / slate  -> kjølig, grønnstikkende nøytralskala (blekk #13232A på 900)
 * Dermed følger alle eksisterende klasser som text-blue-600 eller bg-gray-50
 * automatisk Hjemmetavla-designet.
 */
const accent = {
  50: '#EEF6F5',
  100: '#DDEDEC',
  200: '#BFDCDB',
  300: '#94C3C3',
  400: '#5FA3A5',
  500: '#2A7E80',
  600: '#1D6C6E',
  700: '#175759',
  800: '#0F4A4C',
  900: '#0B3A3C',
  950: '#072A2C',
};

const neutral = {
  50: '#F7F9F8',
  100: '#ECF0EF',
  200: '#DCE3E1',
  300: '#C5D0CE',
  400: '#8A9B9E',
  500: '#5B6E73',
  600: '#4A5D62',
  700: '#384B51',
  800: '#1F3238',
  900: '#13232A',
  950: '#0C171B',
};

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Hjemmetavla-skalaer som erstatter Tailwinds standard
        blue: accent,
        indigo: accent,
        gray: neutral,
        slate: neutral,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        // Hjemmetavlas rolige skygge: en tynn kant pluss en myk, lav løftet skygge
        sm: '0 1px 2px rgba(19, 35, 42, 0.06)',
        DEFAULT: '0 1px 2px rgba(19, 35, 42, 0.06), 0 6px 18px -12px rgba(19, 35, 42, 0.28)',
        md: '0 1px 2px rgba(19, 35, 42, 0.06), 0 8px 22px -12px rgba(19, 35, 42, 0.30)',
        lg: '0 2px 4px rgba(19, 35, 42, 0.06), 0 14px 32px -16px rgba(19, 35, 42, 0.34)',
        xl: '0 2px 6px rgba(19, 35, 42, 0.08), 0 22px 44px -20px rgba(19, 35, 42, 0.38)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
