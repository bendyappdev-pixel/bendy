/**
 * Hero Carousel Component
 *
 * Displays a rotating set of panorama images with smooth crossfade transitions.
 * Falls back to gradient background if no images are provided.
 */

import { useState, useEffect, useCallback } from 'react';
import { heroImages, carouselConfig } from '../../data/heroImages';

interface HeroCarouselProps {
  children: React.ReactNode;
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasImages = heroImages.length > 0;

  // Preload images
  useEffect(() => {
    if (!hasImages) return;

    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [hasImages]);

  // Rotate images
  const nextImage = useCallback(() => {
    if (heroImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    if (!hasImages || isPaused || heroImages.length <= 1) return;

    const timer = setInterval(nextImage, carouselConfig.interval);
    return () => clearInterval(timer);
  }, [hasImages, isPaused, nextImage]);

  // Pause on hover handlers
  const handleMouseEnter = () => {
    if (carouselConfig.pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (carouselConfig.pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Fallback gradient background
  if (!hasImages) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-900" />

        {/* Content */}
        {children}
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Layers */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            transitionDuration: `${carouselConfig.transitionDuration}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        >
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Dark Gradient Overlay for Text Readability - Navy theme */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.95) 100%)',
        }}
      />

      {/* Content */}
      {children}

      {/* Image Indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-sunset-400 w-6'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
