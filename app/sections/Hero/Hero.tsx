import React, { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '~/components/Navbar/Navbar';
import CollapsingMenuMobile from '~/components/CollapsingMenuMobile/CollapsingMenuMobile';
import styles from './Hero.module.scss';

type HeroVariant = 'default' | 'full-width-color' | 'split';

type HeadingSegment = {
  text: React.ReactNode;
  color?: string;
};

type HeroProps = {
  variant?: HeroVariant;
  headingSegments?: HeadingSegment[];
  subheading?: React.ReactNode;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  backgroundImage?: string;
  belowContent?: React.ReactNode;
};

const HeroHeader = ({
  segments,
  className,
  align = 'center',
}: {
  segments: HeadingSegment[];
  className?: string;
  align?: 'center' | 'start';
}) => {
  const containerAlign =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <h1 className={className}>
      <div
        className={`
          flex flex-col lg:flex-row lg:flex-wrap lg:gap-3 gap-0
          ${containerAlign}
        `}
      >
        {segments.map((segment, idx) => (
          <span
            key={idx}
            className={styles.unbreakable}
            style={segment.color ? { color: segment.color } : undefined}
          >
            {segment.text}
          </span>
        ))}
      </div>
    </h1>
  );
};

export default function Hero({
  variant = 'default',
  headingSegments,
  subheading,
  ctaPrimaryLabel,
  ctaSecondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  backgroundImage,
  belowContent,
}: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isFullWidthColor = variant === 'full-width-color';
  const isSplit = variant === 'split';

  const {
    resolvedHeading,
    resolvedSubheading,
    resolvedPrimaryCta,
    resolvedSecondaryCta,
    heroBackgroundImage,
  } = useMemo(() => {
    const fallbackSegments: HeadingSegment[] = isFullWidthColor
      ? [
          { text: 'Buy With Insight.' },
          { text: 'Invest With Confidence.', color: '#DAE684' },
        ]
      : isSplit
      ? [
          { text: 'We Represent Buyers' },
          { text: 'Think Strategically', color: '#DAE684' },
        ]
      : [
          { text: 'Smart Moves.' },
          { text: 'Strong Futures.', color: '#DAE684' },
        ];

    const fallbackSubheading = isFullWidthColor
      ? 'Approach every deal confidently, knowing you’re backed by analytical excellence, investment foresight, and personal care.'
      : isSplit
      ? 'From investment acquisitions to site selection, we find opportunities that align with your best interests.'
      : 'Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.';

    const fallbackPrimaryCta = isFullWidthColor
      ? 'Start Your Property Search'
      : isSplit
      ? 'Start the Conversation'
      : undefined;
    const fallbackSecondaryCta = isFullWidthColor ? 'Schedule a Consultation' : undefined;

    const defaultBackground = '/img/hero_section_background.png';

    return {
      resolvedHeading: headingSegments ?? fallbackSegments,
      resolvedSubheading: subheading ?? fallbackSubheading,
      resolvedPrimaryCta: ctaPrimaryLabel,
      resolvedSecondaryCta: ctaSecondaryLabel,
      heroBackgroundImage: isFullWidthColor ? undefined : backgroundImage ?? defaultBackground,
    };
  }, [backgroundImage, ctaPrimaryLabel, ctaSecondaryLabel, headingSegments, isFullWidthColor, isSplit, subheading]);

  const heroBaseClasses = `
    relative w-full
    ${isFullWidthColor ? 'bg-[var(--strong-green)]' : isSplit ? '' : 'bg-cover bg-center bg-no-repeat'}
    ${isSplit ? 'md:min-h-[600px]' : 'md:h-[700px] md:min-h-[700px]'}
  `;

  const headingClassName = isFullWidthColor
    ? `${styles.meybohmHeading} text-center mb-6`
    : isSplit
    ? `${styles.splitHeading} text-left mb-4 z-10 relative leading-tight`
    : `text-white text-4xl md:text-7xl font-bold mb-6 ${styles.heroHeading}`;

  const subheadingClassName = isFullWidthColor
    ? `${styles.meybohmSubheading} max-w-4xl mx-auto text-center`
    : isSplit
    ? `${styles.splitSubheading} text-white/90 font-light max-w-xl text-left leading-relaxed`
    : `${styles.heroSubheading} max-w-[1200px] max-[1150px]:max-w-[800px] max-[768px]:max-w-[400px]`;

  const primaryButtonClassName = isSplit
    ? `
        bg-[#DAE684] text-[#0F231D] font-semibold
        hover:bg-[#cdd876] transition-colors
        rounded-full
        px-8 py-3 text-base
        w-full md:w-auto text-center
      `
    : `
        sale-button
        px-6 py-3 text-base
        w-full sm:w-auto
        shadow-md
      `;

  const secondaryButtonClassName = isSplit
    ? `
        border border-white text-white font-semibold
        hover:bg-white/10 transition-colors
        rounded-full
        px-8 py-3 text-base
        w-full md:w-auto text-center
      `
    : `
        px-6 py-3 rounded-full border border-white/70 text-white 
        w-full sm:w-auto hover:bg-white/10 transition text-base
      `;

  return (
    <>
      {isSplit ? (
        <div className="relative w-full bg-[var(--strong-green)]">
          {/* Navbar sits on top of everything */}
          <div className="absolute inset-x-0 top-0 z-30">
            <Navbar />
          </div>

          <div className="relative w-full flex flex-col md:flex-row">
            {/* Left Side Content (Top on Mobile) */}
            <div className="relative w-full md:w-1/2 bg-[var(--strong-green)] text-white px-6 sm:px-10 md:px-14 lg:px-16 pt-[120px] pb-16 md:py-16 flex justify-center">
              <div className="flex flex-col gap-6 justify-center w-full max-w-xl md:mt-[150px] md:mb-[80px]">
                <div className="relative w-full">
                  <HeroHeader segments={resolvedHeading} className={headingClassName} align="start" />
                </div>

                {resolvedSubheading && <p className={subheadingClassName}>{resolvedSubheading}</p>}

                {(resolvedPrimaryCta || resolvedSecondaryCta) && (
                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    {resolvedPrimaryCta && (
                      <button onClick={onPrimaryClick} className={primaryButtonClassName}>
                        {resolvedPrimaryCta}
                      </button>
                    )}
                    {resolvedSecondaryCta && (
                      <button onClick={onSecondaryClick} className={secondaryButtonClassName}>
                        {resolvedSecondaryCta}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Image (Bottom on Mobile) */}
            <div
              className="relative w-full md:w-1/2 h-[50vh] md:h-auto bg-cover bg-center min-h-[400px]"
              style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
            >
              <div className="absolute inset-0 bg-black/20 md:bg-black/5" aria-hidden />

              {/* Mobile Only: Lime Green Centered Menu Button */}
              <div className="md:hidden absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="bg-[#DAE684] hover:bg-[#cdd876] text-[#0F231D] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label="Open Menu"
                >
                  {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {belowContent && (
            <div className="bg-[var(--strong-green)]">
              <div className="max-w-6xl mx-auto px-4 pb-10 flex justify-center">
                <div className="w-full flex justify-center">{belowContent}</div>
              </div>
            </div>
          )}

          <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      ) : (
        // Standard / Meybohm Variants
        <>
           <div
            className={heroBaseClasses}
            style={heroBackgroundImage ? { backgroundImage: `url('${heroBackgroundImage}')` } : undefined}
          >
            {!isFullWidthColor && <div className="absolute inset-0 bg-black/40" />}
            <div className="relative z-10 flex flex-col h-full pb-10">
              <Navbar />
              <div className={`mt-10 md:mt-0 md:flex-1 md:flex md:flex-col md:items-center md:justify-center px-6 text-center flex flex-col items-center ${isFullWidthColor ? 'gap-6' : ''}`}>
                <HeroHeader segments={resolvedHeading} className={headingClassName} align="center" />
                {resolvedSubheading && <p className={subheadingClassName}>{resolvedSubheading}</p>}
                {(resolvedPrimaryCta || resolvedSecondaryCta) && (
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {resolvedPrimaryCta && <button onClick={onPrimaryClick} className={primaryButtonClassName}>{resolvedPrimaryCta}</button>}
                    {resolvedSecondaryCta && <button onClick={onSecondaryClick} className={secondaryButtonClassName}>{resolvedSecondaryCta}</button>}
                  </div>
                )}
              </div>
              <div className="md:hidden flex justify-center mt-8 px-6">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-white bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition">
                  {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
            <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
          </div>
          {belowContent && (
            <div className={isFullWidthColor ? 'bg-[var(--strong-green)]' : ''}>
              <div className="relative px-4 pb-10 -mt-6 md:-mt-8">
                <div className="max-w-6xl mx-auto flex justify-center">{belowContent}</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}