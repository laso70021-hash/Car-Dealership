import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/images/logo.png';

interface SwahivoLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Global cached transformed white logo to avoid recomputing
let cachedWhiteLogo: string | null = null;

export const SwahivoLogo: React.FC<SwahivoLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md'
}) => {
  const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(cachedWhiteLogo);

  useEffect(() => {
    if (variant === 'light' && !cachedWhiteLogo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = logoImg;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
              if (a > 20) {
                // If not red accent (red has r > 140 and low green/blue)
                const isRed = r > 130 && g < 75 && b < 75;
                if (!isRed) {
                  // Turn dark text to pure white
                  d[i] = 255;
                  d[i + 1] = 255;
                  d[i + 2] = 255;
                }
              }
            }
            ctx.putImageData(imgData, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            cachedWhiteLogo = dataUrl;
            setWhiteLogoUrl(dataUrl);
          }
        } catch {
          // Fallback if canvas is restricted
        }
      };
    }
  }, [variant]);

  const sizeStyles = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14'
  };

  const imageSrc = variant === 'light' ? (whiteLogoUrl || logoImg) : logoImg;

  return (
    <div className={`flex items-center select-none ${sizeStyles[size]} ${className}`}>
      <img
        src={imageSrc}
        alt="Swahivo Car Dealership"
        className={`h-full w-auto object-contain transition-opacity duration-200 ${
          variant === 'light' && !whiteLogoUrl ? 'brightness-200 contrast-200' : ''
        }`}
        loading="eager"
      />
    </div>
  );
};
