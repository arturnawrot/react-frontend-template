import React from 'react';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

interface ArticleCardProps {
  imageSrc: string;
  title: string;
  tags?: string[];
  link?: string;
}

const ArticleCard = ({ imageSrc, title, tags = [], link = "#" }: ArticleCardProps) => {
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
          <Arrow direction="right" variant="fill" size={16} className="transform transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;