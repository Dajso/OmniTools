/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  /**
   * Image Optimization Configuration
   * @see Requirements 13.1, 13.5 - Performance optimization
   */
  images: {
    // Use modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes for the `sizes` attribute
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize image quality while maintaining visual fidelity
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Disable static image imports optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  /**
   * Compiler Options for Bundle Optimization
   */
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  /**
   * Experimental Features for Performance
   */
  experimental: {
    // Enable optimized package imports for common libraries
    optimizePackageImports: [
      'lucide-react',
      'zod',
      '@radix-ui/react-slot',
    ],
  },

  /**
   * Headers for Caching and Performance
   */
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  /**
   * Webpack Configuration for Bundle Optimization
   */
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Separate vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate UI components
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              chunks: 'all',
              priority: 20,
            },
            // Separate calculation libraries
            calculations: {
              test: /[\\/]lib[\\/]calculations[\\/]/,
              name: 'calculations',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  },

  /**
   * Output Configuration
   */
  output: 'standalone',
  
  /**
   * Powered By Header - Remove for security
   */
  poweredByHeader: false,
  
  /**
   * Compression - Enable gzip compression
   */
  compress: true,
};

module.exports = nextConfig;
