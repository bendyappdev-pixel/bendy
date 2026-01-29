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
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const hasImages = heroImages.length > 0;

  // Preload images
  useEffect(() => {
    if (!hasImages) return;

    const loadStates = new Array(heroImages.length).fill(false);

    heroImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        loadStates[index] = true;
        setIsLoaded([...loadStates]);
      };
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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-mountain via-forest to-forest" />

        {/* Content */}
        {children}
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
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

      {/* Dark Gradient Overlay for Text Readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 50%, rgba(45,80,22,0.8) 100%)',
        }}
      />

      {/* Content */}
      {children}

      {/* Image Indicators (optional - shows which image is active) */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
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
