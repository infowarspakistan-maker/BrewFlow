import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, alt, containerClassName, imageClassName }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-all duration-700 ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
        } ${imageClassName}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/20 animate-pulse" />
      )}
    </div>
  );
};
