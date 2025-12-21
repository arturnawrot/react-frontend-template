import React, { useState } from 'react';
import { Menu, X, Mail, Phone, Linkedin } from 'lucide-react';
import Navbar from 'non-payloadcms-version/app/components/Navbar/Navbar';
import CollapsingMenuMobile from 'non-payloadcms-version/app/components/CollapsingMenuMobile/CollapsingMenuMobile';
import styles from '../../../.react-router/types/non-payloadcms-version/app/sections/Hero/Hero.module.scss';

type HeroVariant = 'default' | 'full-width-color' | 'split' | 'agent';

type HeadingSegment = {
  text: React.ReactNode;
  color?: string;
  breakOnMobile?: boolean; // Force a line break after this segment on mobile only
  breakOnDesktop?: boolean; // Force a line break after this segment on desktop only
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
  // Agent variant props
  agentImage?: string;
  agentEmail?: string;
  agentPhone?: string;
  agentLinkedin?: string;
};

// Reusable Heading Component
const HeroHeader = ({
  segments,
  className,
  align = 'center',
  useJustifyCenter = false,
}: {
  segments: HeadingSegment[];
  className?: string;
  align?: 'center' | 'start';
  useJustifyCenter?: boolean;
}) => {
  // On mobile: text left-aligned, container centered. On desktop: follow align prop
  const containerAlign = align === 'center' 
    ? 'items-center text-left md:text-center' 
    : 'items-start text-left';
  
  return (
    <h1 className={`${className} flex justify-center md:block w-full md:w-auto`}>
      <div className={`inline-block md:inline w-full md:w-auto ${containerAlign} ${useJustifyCenter ? 'justify-center' : ''}`}>
        {segments.map((segment, idx) => {
          const prevSegment = idx > 0 ? segments[idx - 1] : null;
          // Add space only if previous segment didn't have a break
          const shouldAddMobileSpace = idx > 0 && !prevSegment?.breakOnMobile;
          const shouldAddDesktopSpace = idx > 0 && !prevSegment?.breakOnDesktop;
          
          return (
            <React.Fragment key={idx}>
              <span
                className="whitespace-normal md:whitespace-nowrap"
                style={segment.color ? { color: segment.color } : undefined}
              >
                {shouldAddMobileSpace && <span className="md:hidden"> </span>}
                {shouldAddDesktopSpace && <span className="hidden md:inline"> </span>}
                {segment.text}
              </span>
              {segment.breakOnMobile && <br className="md:hidden" />}
              {segment.breakOnDesktop && <br className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </div>
    </h1>
  );
};

// Reusable Action Buttons
const ActionButtons = ({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryClass,
  secondaryClass
}: {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryClass: string;
  secondaryClass: string;
}) => {
  if (!primaryLabel && !secondaryLabel) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      {primaryLabel && (
        <button onClick={onPrimary} className={primaryClass}>
          {primaryLabel}
        </button>
      )}
      {secondaryLabel && (
        <button onClick={onSecondary} className={secondaryClass}>
          {secondaryLabel}
        </button>
      )}
    </div>
  );
};

// Agent Contact Links
const AgentContactInfo = ({ email, phone, linkedin }: { email?: string; phone?: string; linkedin?: string }) => {
  if (!email && !phone && !linkedin) return null;

  const linkClass = "flex items-center gap-2 text-sm font-sans text-white hover:opacity-70 transition-opacity";
  
  return (
    <div className="flex flex-row gap-6 mb-8 flex-wrap">
      {email && (
        <a href={`mailto:${email}`} className={linkClass}>
          <Mail className="w-4 h-4" /> Email
        </a>
      )}
      {phone && (
        <a href={`tel:${phone}`} className={linkClass}>
          <Phone className="w-4 h-4" /> Phone
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      )}
    </div>
  );
};

/**
 * Centralizes the logic for default text/images based on variant.
 * Separating data derivation from rendering improves readability.
 */
const resolveHeroContent = (props: HeroProps) => {
  const { variant = 'default' } = props;
  const isFullWidthColor = variant === 'full-width-color';
  const isSplit = variant === 'split';
  const isAgent = variant === 'agent';

  // 1. Resolve Background
  const defaultBg = '/img/hero_section_background.png';
  // Agent uses agentImage, Split/Default use backgroundImage or fallback
  const finalImage = isAgent 
    ? (props.agentImage ?? defaultBg) 
    : (isFullWidthColor ? undefined : props.backgroundImage ?? defaultBg);

  // 2. Resolve Headings
  let segments: HeadingSegment[] = props.headingSegments || [];
  if (segments.length === 0) {
    if (isFullWidthColor) segments = [{ text: 'Buy With Insight.' }, { text: 'Invest With Confidence.', color: '#DAE684' }];
    else if (isSplit) segments = [{ text: 'We Represent Buyers' }, { text: 'Think Strategically', color: '#DAE684' }];
    else if (isAgent) segments = [{ text: 'Agent Name' }];
    else segments = [{ text: 'Smart Moves.' }, { text: 'Strong Futures.', color: '#DAE684' }];
  }

  // 3. Resolve Subheading
  let sub = props.subheading;
  if (!sub) {
    if (isFullWidthColor) sub = "Approach every deal confidently, knowing you're backed by analytical excellence, investment foresight, and personal care.";
    else if (isSplit) sub = "From investment acquisitions to site selection, we find opportunities that align with your best interests.";
    else if (isAgent) sub = "Agent & Broker";
    else sub = "Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.";
  }

  // 4. Resolve CTA Labels
  const primaryCta = props.ctaPrimaryLabel ?? (
    isFullWidthColor ? 'Start Your Property Search' :
    isSplit ? 'Start the Conversation' :
    isAgent ? 'Schedule A Consultation' : undefined
  );
  
  const secondaryCta = props.ctaSecondaryLabel ?? (isFullWidthColor ? 'Schedule a Consultation' : undefined);

  return {
    segments,
    subheading: sub,
    primaryCta,
    secondaryCta,
    finalImage,
    isFullWidthColor,
    isSplit,
    isAgent
  };
};

/**
 * Split View ('split', 'agent')
 * Left side text, Right side image.
 */
const SideBySideLayout = (props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) => {
  const { 
    isAgent, segments, subheading, primaryCta, secondaryCta, finalImage,
    agentEmail, agentPhone, agentLinkedin, onPrimaryClick, onSecondaryClick,
    belowContent, menuOpen, setMenuOpen 
  } = props;

  const containerBg = 'bg-[var(--strong-green)]';
  
  // Styling configuration - same for both split and agent variants
  const headingClass = `${styles.splitHeading} text-left mb-4 z-10 relative leading-tight`;
  const subClass = `${styles.splitSubheading} text-white/90 font-light w-full md:max-w-xl text-left leading-relaxed`;
  const btnPrimaryClass = `bg-[#DAE684] text-[#0F231D] font-semibold hover:bg-[#cdd876] transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto text-center`;
  const btnSecondaryClass = `border border-white text-white font-semibold hover:bg-white/10 transition-colors rounded-full px-8 py-3 text-base w-full md:w-auto text-center`;

  return (
    <div className={`relative w-full ${containerBg}`}>
      <div className="absolute inset-x-0 top-0 z-30">
        <Navbar />
      </div>

      <div className="relative w-full flex flex-col md:flex-row">
        {/* Left Content */}
        <div className={`relative w-full md:w-1/2 ${containerBg} text-white px-6 sm:px-10 md:px-14 lg:px-16 pt-[120px] pb-16 md:py-16 flex justify-center`}>
          <div className="flex flex-col gap-6 justify-center w-full max-w-xl md:mt-[150px] md:mb-[80px]">
            <div className="w-full max-w-[400px] md:max-w-none md:w-auto">
              <HeroHeader segments={segments} className={headingClass} align="start" />
              
              {subheading && <p className={subClass}>{subheading}</p>}
            </div>

            {isAgent && <AgentContactInfo email={agentEmail} phone={agentPhone} linkedin={agentLinkedin} />}

            <ActionButtons 
              primaryLabel={primaryCta}
              secondaryLabel={secondaryCta}
              onPrimary={onPrimaryClick}
              onSecondary={onSecondaryClick}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
            />
          </div>
        </div>

        {/* Right Image */}
        <div 
          className={`relative w-full md:w-1/2 h-[50vh] md:h-auto bg-cover bg-center min-h-[400px]`}
          style={{ backgroundImage: `url('${finalImage}')` }}
        >
          <div className={`absolute inset-0 bg-black/20 md:bg-black/5`} aria-hidden />
          
          {/* Mobile Menu Trigger */}
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
        <div className={containerBg}>
          <div className="max-w-6xl mx-auto px-4 pb-10 flex justify-center w-full">
            {belowContent}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * entered View ('Default', 'Full-Width-Color')
 */
const CenteredLayout = (props: HeroProps & ReturnType<typeof resolveHeroContent> & { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) => {
  const { 
    isFullWidthColor, segments, subheading, primaryCta, secondaryCta, finalImage,
    onPrimaryClick, onSecondaryClick, belowContent, menuOpen, setMenuOpen 
  } = props;

  // Styling configuration
  const wrapperClass = `
    relative w-full
    ${isFullWidthColor ? 'bg-[var(--strong-green)]' : 'bg-cover bg-center bg-no-repeat md:h-[700px] md:min-h-[700px]'}
  `;
  
  const headingClass = isFullWidthColor
    ? `${styles.meybohmHeading} text-center mb-6`
    : `text-white text-4xl md:text-7xl font-bold mb-6 ${styles.heroHeading} w-full`;

  const subClass = isFullWidthColor
    ? `${styles.meybohmSubheading} w-full md:max-w-4xl mx-auto text-center`
    : `${styles.heroSubheading} w-full md:max-w-[1200px] md:max-[1150px]:max-w-[800px]`;

  const btnPrimaryClass = `sale-button px-6 py-3 text-base w-full sm:w-auto shadow-md`;
  const btnSecondaryClass = `px-6 py-3 rounded-full border border-white/70 text-white w-full sm:w-auto hover:bg-white/10 transition text-base`;

  return (
    <>
      <div 
        className={wrapperClass} 
        style={finalImage ? { backgroundImage: `url('${finalImage}')` } : undefined}
      >
        {!isFullWidthColor && <div className="absolute inset-0 bg-black/40" />}
        
        <div className="relative z-10 flex flex-col h-full pb-10">
          <Navbar />
          
          <div className={`mt-10 md:mt-20 md:flex-1 md:flex md:flex-col md:items-center md:justify-center px-6 text-left md:text-center flex flex-col items-center ${isFullWidthColor ? 'gap-6' : ''}`}>
            <div className="w-full max-w-[400px] md:max-w-none md:w-auto flex flex-col items-center md:items-center">
              <HeroHeader 
                segments={segments} 
                className={headingClass} 
                align="center" 
                useJustifyCenter={!isFullWidthColor} 
              />
              
              {subheading && <p className={`${subClass} text-left md:text-center`}>{subheading}</p>}
            </div>

            <ActionButtons 
              primaryLabel={primaryCta}
              secondaryLabel={secondaryCta}
              onPrimary={onPrimaryClick}
              onSecondary={onSecondaryClick}
              primaryClass={btnPrimaryClass}
              secondaryClass={btnSecondaryClass}
            />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex justify-center mt-8 px-6">
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
        <div className={isFullWidthColor ? 'bg-[var(--strong-green)]' : ''}>
          <div className="relative px-4 pb-10 -mt-6 md:-mt-8">
            <div className="max-w-6xl mx-auto flex justify-center">{belowContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default function Hero(props: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Prepare data (content, styling flags)
  const content = resolveHeroContent(props);

  // Determine Layout Strategy
  const isSideBySide = content.isSplit || content.isAgent;

  return (
    <div className="relative w-full overflow-x-hidden" style={{ backgroundColor: 'var(--strong-green)' }}>
      {isSideBySide ? (
        <SideBySideLayout 
          {...props} 
          {...content} 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
        />
      ) : (
        <CenteredLayout 
          {...props} 
          {...content} 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
        />
      )}
      
      <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}