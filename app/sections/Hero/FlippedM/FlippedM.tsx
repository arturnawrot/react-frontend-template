import styles from "./FlippedM.module.scss";

export default function FlippedM() {
    const section = 
        {
          heading: "A Process Built for Business Growth",
          subheading: "We'll make sure you never have to guess when navigating the complexities of leasing property.",
          bulletPoints: [
            "Detail your full list of needs so you're ready to search strategically",
            "Comb through available options armed with detailed analytics",
            "Tour potential sites and check them against your criteria",
            "Negotiate a lease that aligns with your business goals",
            "Move in to your new site and let us handle the logistics"
          ],
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
          svgBackground: "/svg/flipped-m.svg"
        }
      ;
    
      return (
        <div className="bg-white">
          
            <ProcessSection
              heading={section.heading}
              subheading={section.subheading}
              bulletPoints={section.bulletPoints}
              image={section.image}
              svgPath={section.svgBackground}
            />
          
          
          {/* CTA Button */}
          <div className="py-12 px-6 text-center">
            <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium px-8 py-3 rounded-full transition-colors">
              See How it Works
            </button>
          </div>
        </div>
      );
}


const ProcessSection = ({ heading, subheading, bulletPoints, image, svgPath }) => {
    return (
      <div className="relative w-full min-h-screen flex justify-center py-12 md:py-20">
        {/* SVG Background - original size, top-left corner at right column start */}
        <div className="absolute inset-0 md:left-1/2 pointer-events-none overflow-visible">
          <img 
            src={svgPath} 
            alt=""
            className="absolute top-0 left-0 w-auto h-auto"
            style={{ 
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              {/* Heading & Subheading */}
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                  {heading}
                </h2>
                {subheading && (
                  <p className="text-base md:text-lg text-gray-700">
                    {subheading}
                  </p>
                )}
              </div>
              
              {/* Bullet Points */}
              {bulletPoints && bulletPoints.length > 0 && (
                <ul className="space-y-3 mt-6">
                  {bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>
                      <span className="text-gray-700">{point}</span>

                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Right Column - Image (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <img 
                  src={image} 
                  alt={heading}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };