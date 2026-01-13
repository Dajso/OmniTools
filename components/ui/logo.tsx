import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

/**
 * OmniTools Logo Component
 * A modern, versatile logo representing multiple tools/utilities
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-blue-600', className)}
      aria-hidden="true"
    >
      {/* Outer circle - represents "Omni" (all-encompassing) */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Inner hexagon grid - represents multiple tools */}
      <path
        d="M24 8L36 16V32L24 40L12 32V16L24 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Center tool icon - wrench/gear hybrid */}
      <circle
        cx="24"
        cy="24"
        r="6"
        fill="currentColor"
      />
      
      {/* Connecting lines - representing connectivity/versatility */}
      <line x1="24" y1="8" x2="24" y2="18" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="30" x2="24" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="16" x2="18" y2="21" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="27" x2="36" y2="32" stroke="currentColor" strokeWidth="2" />
      <line x1="36" y1="16" x2="30" y2="21" stroke="currentColor" strokeWidth="2" />
      <line x1="18" y1="27" x2="12" y2="32" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
