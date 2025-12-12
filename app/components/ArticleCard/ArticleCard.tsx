import React from 'react';

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="transform transition-transform group-hover:translate-x-1">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
);

const ArticleCard = ({ imageSrc, title, tags = [], link = "#" }) => {
  return (
    <div className="w-[300px] md:w-[400px] shrink-0 snap-start">
      {/* Image Container */}
      <div className="relative h-[280px] w-full rounded-2xl overflow-hidden mb-6 group cursor-pointer">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Floating Tags */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-[#f0eee6] text-[#1a2e2a] text-[10px] md:text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-md shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pr-4">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a2e2a] leading-tight mb-4 font-serif">
          {title}
        </h3>
        <a 
          href={link} 
          className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2e2a] hover:opacity-70 transition-opacity"
        >
          Read More
          <ArrowRight />
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;