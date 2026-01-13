/**
 * Optimized Image Component
 * 
 * A wrapper around Next.js Image component that enforces
 * performance best practices and accessibility requirements.
 * 
 * @see Requirements 13.1, 13.5 - Performance optimization
 * @module components/ui/optimized-image
 */

import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  /** Alt text is required for accessibility */
  alt: string;
  /** Whether to use blur placeholder (default: true for remote images) */
  useBlur?: boolean;
  /** Custom blur data URL */
  blurDataURL?: string;
}

/**
 * Default blur placeholder for images
 * A tiny, low-quality image placeholder
 */
const DEFAULT_BLUR_DATA_URL = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+';

/**
 * OptimizedImage Component
 * 
 * Wraps Next.js Image with performance defaults:
 * - Lazy loading by default
 * - Blur placeholder for better perceived performance
 * - Proper sizing attributes
 * - Accessibility compliance (required alt text)
 * 
 * @example
 * <OptimizedImage
 *   src="/images/calculator-icon.png"
 *   alt="Calculator icon"
 *   width={64}
 *   height={64}
 * />
 */
export function OptimizedImage({
  alt,
  useBlur = true,
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  // Determine if we should use blur placeholder
  const shouldUseBlur = useBlur && typeof props.src === 'string';

  return (
    <Image
      alt={alt}
      loading={loading}
      placeholder={shouldUseBlur ? 'blur' : 'empty'}
      blurDataURL={shouldUseBlur ? blurDataURL : undefined}
      {...props}
    />
  );
}

/**
 * Hero Image Component
 * 
 * Optimized for above-the-fold hero images with priority loading.
 * 
 * @example
 * <HeroImage
 *   src="/images/hero-banner.jpg"
 *   alt="Welcome to English Tools"
 *   fill
 * />
 */
export function HeroImage({
  alt,
  ...props
}: Omit<OptimizedImageProps, 'loading' | 'useBlur'>) {
  return (
    <Image
      alt={alt}
      loading="eager"
      priority
      placeholder="blur"
      blurDataURL={DEFAULT_BLUR_DATA_URL}
      {...props}
    />
  );
}

/**
 * Icon Image Component
 * 
 * Optimized for small icon images with inline loading.
 * 
 * @example
 * <IconImage
 *   src="/icons/calculator.svg"
 *   alt="Calculator"
 *   width={24}
 *   height={24}
 * />
 */
export function IconImage({
  alt,
  width = 24,
  height = 24,
  ...props
}: Omit<OptimizedImageProps, 'useBlur'>) {
  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      unoptimized={typeof props.src === 'string' && props.src.endsWith('.svg')}
      {...props}
    />
  );
}
