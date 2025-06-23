// components/Logo.js
import Image from 'next/image';

// Main logo for header/footer - with text
export function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10">
        <Image
          src="/Icon_Logo.svg"  // Using the square logo for consistency
          alt="SumSip Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <span className="text-2xl font-bold text-gray-900 hidden sm:block">
        SumSip
      </span>
    </div>
  );
}

// Icon only version
export function LogoIcon({ className = "h-8 w-8" }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/Logo.svg"
        alt="SumSip Icon"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}

// Mobile responsive logo (icon on mobile, with text on desktop)
export function ResponsiveLogo({ className = "" }) {
  return (
    <>
      {/* Desktop: Icon + Text */}
      <div className={`hidden sm:flex items-center gap-3 ${className}`}>
        <div className="relative h-10 w-10">
          <Image
            src="/Logo.svg"
            alt="SumSip Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
        <span className="text-2xl font-bold text-gray-900">
          SumSip
        </span>
      </div>
      
      {/* Mobile: Icon only */}
      <div className={`relative h-10 w-10 sm:hidden ${className}`}>
        <Image
          src="/Logo.svg"
          alt="SumSip"
          fill
          priority
          className="object-contain"
        />
      </div>
    </>
  );
}

// Default export
export default Logo;