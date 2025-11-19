import styles from "./FlippedM.module.scss";

const BulletPoint = ({
  title,
  description,
  linkText,
  linkHref,
  isLast = false,
  isActive = false,
}) => {
  const headingClasses = [
    styles.bulletPointHeading,
    "text-2xl",
    "font-bold",
    "mb-2",
    !isActive && styles.bulletPointHeadingMuted,
  ]
    .filter(Boolean)
    .join(" ");

  const descriptionClasses = [
    styles.bulletPointsubheading,
    "mb-4",
    !isActive && styles.bulletPointsubheadingMuted,
  ]
    .filter(Boolean)
    .join(" ");

  const linkClasses = [
    styles.bulletPointLink,
    isActive ? "" : styles.bulletPointLinkMuted,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex">
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center mr-6">
        {/* Dot */}
        <div
          className={[
            styles.bulletPointDot,
            isActive ? styles.bulletPointDotActive : styles.bulletPointDotMuted,
          ]
            .filter(Boolean)
            .join(" ")}
        ></div>

        {/* Line */}
        {!isLast && (
          <div className={styles.bulletPointLineWrapper}>
            {isActive && <div className={styles.bulletPointLineBlackSegment} />}
            <div className={styles.bulletPointLineMuted} />
          </div>
        )}
      </div>

      {/* Right column: text */}
      <div className={`${!isLast ? "pb-10" : ""} md:ml-8`}>
        <h2
          className={headingClasses}
          style={{ transform: "translateY(-4px)" }}
        >
          {title}
        </h2>
        <p className={descriptionClasses}>{description}</p>
        <a href={linkHref} className={linkClasses}>
          {linkText} &rarr;
        </a>
      </div>
    </div>
  );
};

const ProcessSection = ({ heading, subheading, bulletPoints, image, svgPath }) => {
  return (
    <div className="relative w-full flex flex-col py-12 md:py-20 min-h-[1600px] max-w-[1500px] mx-auto md:px-15">
      {/* SVG Background */}
      <div className="absolute inset-0 md:left-1/2 pointer-events-none">
        <img
          src={svgPath}
          alt=""
          className="absolute top-0 left-[-15%] w-auto h-auto z-0 overflow-hidden"
          style={{ maxWidth: "none", maxHeight: "none" }}
        />
      </div>

      {/* Heading & Subheading */}
      <div className="relative z-40 mx-auto md:mx-0 max-w-md">
        <h2
          className={`display2 text-4xl md:text-5xl lg:text-6xl font-light leading-tight`}
        >
          {heading}
        </h2>
        {subheading && (
          <p
            className={`${styles.subheading} text-base md:text-lg mt-4 max-w-[400px]`}
          >
            {subheading}
          </p>
        )}
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-0 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2 items-start">
          {/* Left Column - Bullets */}
          <div className="max-w-[450px] mx-auto md:mx-0 max-w-md">
            {bulletPoints.map((service, index) => (
              <BulletPoint
                key={index}
                title={service.title}
                description={service.description}
                linkText={service.linkText}
                linkHref={service.linkHref}
                isLast={index === bulletPoints.length - 1}
                isActive={index === 0} // only first one is “normal”
              />
            ))}
          </div>

          {/* Right Column - Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <img
                src={image}
                alt=""
                className="w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Heading = () => (
  <span>
    Built on more than <br />
    transactions.
  </span>
);

const sampleSection = {
  heading: <Heading />,
  subheading:
    "We advise with the same care we'd want for our own portfolio. Whether you're investing, expanding, or exiting - we're built for your next move.",
  bulletPoints: [
    {
      title: "Acquisition support for owner-operators and investors.",
      description:
        "Whether you’re expanding your business or building out your portfolio, we offer the guidance and expertise to transform real estate into lasting prosperity.",
      linkText: "See All Buying",
      linkHref: "#",
    },
    {
      title: "Space strategy and tenant representation.",
      description:
        "Our holistic approach to real estate means we equip you for every facet of ownership and investment - from long-term thinking to immediate solutions.",
      linkText: "See All Leasing",
      linkHref: "#",
    },
    {
      title: "Disposition and portfolio exit planning.",
      description:
        "When it’s time to make a strategic exit we have the experience and track-record to guide you towards the best possible returns and tax-friendly options.",
      linkText: "See All Selling",
      linkHref: "#",
    },
  ],
  image: "/img/amazon_fc.png",
  svgBackground: "/svg/flipped-m.svg",
};

export default function FlippedM({section = sampleSection}) {
  return (
    <div className={styles.containerBackground + " overflow-hidden"}>
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
