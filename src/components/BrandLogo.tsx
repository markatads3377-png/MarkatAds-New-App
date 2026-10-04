import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark' | 'icon';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  if (variant === 'icon' || variant === 'mark') {
    const sizeClasses = {
      sm: 'size-7',
      md: 'size-9',
      lg: 'size-11',
      xl: 'size-14',
    }[size];

    return (
      <img
        src="/favicon.svg"
        alt="Mark@Ads Logo Icon"
        className={`${sizeClasses} object-contain rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${className}`}
        onError={(e) => {
          e.currentTarget.src = '/favicon.png';
        }}
      />
    );
  }

  // Full logo
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.svg"
        alt="Mark@Ads"
        className={`${heightClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
        onError={(e) => {
          e.currentTarget.src = '/logo.png';
        }}
      />
    </div>
  );
};
