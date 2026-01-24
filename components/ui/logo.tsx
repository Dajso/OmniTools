import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

/**
 * OmniTools Logo Component
 * Uses the icon from public/icons directory
 */
export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/icons/icon-192x192.png"
      alt="OmniTools"
      width={192}
      height={192}
      className={cn('object-contain', className)}
      priority
    />
  );
}
