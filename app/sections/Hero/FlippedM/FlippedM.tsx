import styles from "./FlippedM.module.scss";

// The BulletPoint component is perfect as is. No changes needed here.
const BulletPoint = ({ title, description, linkText, linkHref, isLast = false }) => {
  return (
    <div className="flex">
      {/* Left column for the dot and the connecting line */}
      <div className="flex flex-col items-center mr-6">
        {/* The Dot */}
        <div className="flex-shrink-0 w-3 h-3 bg-gray-400 rounded-full"></div>
        {/* The Line: uses flex-grow to fill all available vertical space */}
        {!isLast && <div className="w-px flex-grow bg-gray-300"></div>}
      </div>

      {/* Right column for the text content */}
      <div className={!isLast ? 'pb-10' : ''}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ transform: 'translateY(-4px)' }}>
          {title}
        </h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <a href={linkHref} className="text-gray-800 font-semibold hover:text-gray-900">
          {linkText} &rarr;
        </a>
      </div>
    </div>
  );
};

// The ProcessSection component with the fix applied.
const ProcessSection = ({ heading, subheading, bulletPoints, image, svgPath }) => {
    return (
      <div className="relative w-full flex flex-col py-12 md:py-20 min-h-[1600px] max-w-[1400px] mx-auto">
        {/* SVG Background */}
        <div className="absolute inset-0 md:left-1/2 pointer-events-none">
          <img 
            src={svgPath} 
            alt=""
            className="absolute top-0 left-[-15%] w-auto h-auto z-1 overflow-hidden"
            style={{ 
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
        </div>
        
        {/* Heading & Subheading */}
        <div className="relative z-40">
          <h2 className={`${styles.heading} text-4xl md:text-5xl lg:text-6xl font-light leading-tight`}>
            {heading}
          </h2>
          {subheading && (
            <p className={`${styles.subheading} text-base md:text-lg text-gray-700 mt-4 max-w-[400px]`}>
              {subheading}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-6 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            
            {/* Left Column - Content */}
            {/* 
              FIX: Removed the "space-y-6" class from this div. 
              The padding inside the BulletPoint component now handles the spacing correctly.
            */}
            <div>
              {bulletPoints.map((service, index) => (
                <BulletPoint
                  key={index}
                  title={service.title}
                  description={service.description}
                  linkText={service.linkText}
                  linkHref={service.linkHref}
                  isLast={index === bulletPoints.length - 1}
                />
              ))}
            </div>
            
            {/* Right Column - Image */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <img 
                  src={image} 
                  alt="" // Alt text should ideally describe the image
                  className="min-w-[720px] h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Main FlippedM component. No changes needed here.
export default function FlippedM() {
    const Heading = () => (
      <span>Built on more than <br/> transactions.</span>
    );

    const section = {
      heading: <Heading />,
      subheading: "We advise with the same care we'd want for our own portfolio. Whether you're investing, expanding, or exiting - we're built for your next move.",
      bulletPoints: [
        {
          title: 'Acquisition support for owner-operators and investors.',
          description: 'Whether you’re expanding your business or building out your portfolio, we offer the guidance and expertise to transform real estate into lasting prosperity.',
          linkText: 'See All Buying',
          linkHref: '#',
        },
        {
          title: 'Space strategy and tenant representation.',
          description: 'Our holistic approach to real estate means we equip you for every facet of ownership and investment - from long-term thinking to immediate solutions.',
          linkText: 'See All Leasing',
          linkHref: '#',
        },
        {
          title: 'Disposition and portfolio exit planning.',
          description: 'When it’s time to make a strategic exit we have the experience and track-record to guide you towards the best possible returns and tax-friendly options.',
          linkText: 'See All Selling',
          linkHref: '#',
        }
      ],
      image: "/img/amazon_fc.png",
      svgBackground: "/svg/flipped-m.svg"
    };
    
    return (
      <div className={`${styles.containerBackground} overflow-hidden`}>
        <ProcessSection
          heading={section.heading}
          subheading={section.subheading}
          bulletPoints={section.bulletPoints}
          image={section.image}
          svgPath={section.svgBackground}
        />
      </div>
    );
}