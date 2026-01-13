# OmniTools

A comprehensive collection of 100+ free online calculators and converters built with Next.js 14.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **100+ Tools** - Finance, Health, Home & DIY, Unit Converters, Productivity
- **Fast & Lightweight** - Static generation for optimal performance
- **Mobile Responsive** - Works seamlessly on all devices
- **No Ads, No Signup** - 100% free to use
- **SEO Optimized** - Built-in sitemap and meta tags

## Tool Categories

| Category | Examples |
|----------|----------|
| **Finance** | Mortgage Calculator, Compound Interest, ROI, Tip Calculator |
| **Health & Fitness** | BMI Calculator, TDEE, Macro Calculator, Sleep Cycle |
| **Home & DIY** | Paint Calculator, Concrete, Tile, Square Footage |
| **Unit Converters** | Length, Weight, Temperature, Volume, Currency |
| **Productivity** | Word Counter, Password Generator, JSON Formatter, UUID |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/omnitools.git
cd omnitools

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run analyze` | Analyze bundle size |
| `npm run lighthouse` | Run Lighthouse audit |

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repository at [vercel.com](https://vercel.com).

### Static Export

```js
// next.config.js
module.exports = {
  output: 'export'
}
```

```bash
npm run build
# Deploy the 'out' directory to any static host
```

### Docker

```bash
docker build -t omnitools .
docker run -p 3000:3000 omnitools
```

## Project Structure

```
omnitools/
├── app/                    # Next.js App Router
│   ├── calculators/        # Calculator pages
│   │   ├── finance/
│   │   ├── health/
│   │   ├── home/
│   │   └── productivity/
│   ├── convert/            # Unit converter pages
│   └── (marketing)/        # Legal pages
├── components/
│   ├── calculators/        # Calculator components
│   ├── converters/         # Converter components
│   ├── layout/             # Layout components
│   └── ui/                 # UI primitives
├── lib/
│   ├── calculations/       # Calculation logic
│   ├── constants/          # Tool registry & config
│   ├── conversions/        # Conversion logic
│   └── utils/              # Utility functions
└── tests/                  # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-tool`)
3. Commit your changes (`git commit -m 'Add new tool'`)
4. Push to the branch (`git push origin feature/new-tool`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
