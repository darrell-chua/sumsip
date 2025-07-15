import Image from 'next/image';

export function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10">
        <Image
          src="/Icon_Logo.svg"
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

export function LogoIcon({ className = "h-8 w-8" }) {
  return (
    <div className={className}>
      <Image
        src="/Icon_Logo.svg"
        alt="SumSip Logo"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}

export function ResponsiveLogo({ className = "" }) {
  return (
    <>
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

export default Logo;