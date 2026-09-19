'use client';

import React, { useState } from 'react';
import {
  getOptimizedImageUrl,
  DEFAULT_AVATAR_PLACEHOLDER,
  DEFAULT_EVENT_PLACEHOLDER,
} from '@/lib/image-proxy';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: '1/1' | '16/9' | '4/3' | '3/2' | '2/3' | 'auto';
  width?: number;
  height?: number;
  isAvatar?: boolean;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
  width,
  height,
  isAvatar = false,
  priority = false,
  fit = 'cover',
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallback = isAvatar ? DEFAULT_AVATAR_PLACEHOLDER : DEFAULT_EVENT_PLACEHOLDER;

  // Process src through wsrv.nl WebP optimizer
  const optimizedSrc = !hasError && src
    ? getOptimizedImageUrl(src, { width, height, quality: 85, fit }, isAvatar)
    : fallback;

  const aspectClass = {
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '3/2': 'aspect-3/2',
    '2/3': 'aspect-2/3',
    'auto': '',
  }[aspectRatio];

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${containerClassName}`}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200/70" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-${fit} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
      />
    </div>
  );
}
