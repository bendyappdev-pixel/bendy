/**
 * Hero Carousel
 *
 * Crossfades the panorama set behind the title card. The rotation logic is
 * unchanged from the previous design — 4s interval, 1000ms fade, pause on
 * hover. What changed is the frame: the layers now live inside a `.reel`
 * so the hero picks up the same vignette, grain and viewfinder treatment as
 * every other photo in the system, and the indicator dots are square + ember.
 */

import { useState, useEffect, useCallback } from 'react';
import { heroImages, carouselConfig } from '../../data/heroImages';
import { webpFor } from '../../utils/imageUtils';
import { creditFor } from '../../data/photoCredits';

interface HeroCarouselProps {
  children: React.ReactNode;
  /** Bottom-left mono slate. */
  label?: string;
  /** Bottom-right mono timecode. */
  timecode?: string;
}

const FRAME_STYLE: React.CSSProperties = {
  height: 'min(92vh, 940px)',
  minHeight: 680,
};

export default function HeroCarousel({ children, label, timecode }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasImages = heroImages.length > 0;

  useEffect(() => {
    if (!hasImages) return;
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [hasImages]);

  const nextImage = useCallback(() => {
    if (heroImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    if (!hasImages || isPaused || heroImages.length <= 1) return;
    const timer = setInterval(nextImage, carouselConfig.interval);
    return () => clearInterval(timer);
  }, [hasImages, isPaused, nextImage]);

  const handleMouseEnter = () => {
    if (carouselConfig.pauseOnHover) setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (carouselConfig.pauseOnHover) setIsPaused(false);
  };

  // No photography: the bare .reel already paints a dark cinematic placeholder.
  if (!hasImages) {
    return (
      <section className="relative">
        <div className="reel leak" style={FRAME_STYLE}>
          <div className="brackets" aria-hidden="true">
            <i className="tl" />
            <i className="tr" />
          </div>
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="reel has-photo leak" style={FRAME_STYLE}>
        {heroImages.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 -z-10"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transition: `opacity ${carouselConfig.transitionDuration}ms ease-in-out`,
            }}
            aria-hidden="true"
          >
            <picture>
              <source srcSet={webpFor(src)} type="image/webp" />
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </picture>
          </div>
        ))}

        <div className="brackets" aria-hidden="true">
          <i className="tl" />
          <i className="tr" />
        </div>
        {label && (
          <span className="label hidden md:block" aria-hidden="true">
            {label}
          </span>
        )}
        {timecode && (
          <span className="tc hidden md:block" aria-hidden="true">
            {timecode}
          </span>
        )}

        {/* Credit tracks the frame currently showing, so it stays truthful as
            the carousel crossfades. Pinned to the top edge because the
            lower-third letterbox covers the bottom of this reel. */}
        {creditFor(heroImages[currentIndex]) && (
          <span className="credit top">
            {creditFor(heroImages[currentIndex])!.label}
          </span>
        )}

        {children}

        {/* Frame selector — square, ember when live. Sits clear of the
            lower-third letterbox, which owns the bottom of the frame. */}
        {heroImages.length > 1 && (
          <div className="absolute left-1/2 top-6 z-30 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 transition-all ${
                  index === currentIndex ? 'w-6 bg-ember' : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Show frame ${index + 1} of ${heroImages.length}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
