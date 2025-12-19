import { Mail, Phone, Linkedin, Check } from 'lucide-react';
import Arrow from '~/components/Arrow/Arrow';

interface AgentCardProps {
  name: string;
  role: string;
  license?: string;
  image?: string;
  variant?: 'horizontal' | 'vertical';
  servingLocations?: string[];
  serviceTags?: string[];
  email?: string;
  phone?: string;
  linkedin?: string;
}

const AgentCard = ({ 
  name, 
  role, 
  license, 
  image, 
  variant = 'horizontal',
  servingLocations = [],
  serviceTags = [],
  email,
  phone,
  linkedin
}: AgentCardProps) => {
  const isVertical = variant === 'vertical';

  if (isVertical) {
    return (
      <div className="flex flex-col">
        {/* Agent Image with Service Tags Overlay */}
        <div className="relative w-full aspect-square bg-gray-300 rounded-sm overflow-hidden mb-4">
          {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
          {serviceTags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {serviceTags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-[#F5F5F0] text-[#1C2B28] text-[10px] font-semibold px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Agent Name */}
        <h3 className="font-serif font-bold text-xl text-[#1C2B28] mb-1">{name}</h3>
        
        {/* Agent Title */}
        <p className="text-sm text-gray-600 mb-3">{role}</p>
        
        {/* Serving Locations */}
        {servingLocations.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">SERVING</p>
            <p className="text-sm text-gray-700">{servingLocations.join(', ')}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="flex flex-col gap-2 mb-4">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:opacity-70">
              <Check className="w-4 h-4" /> Email
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:opacity-70">
              <Phone className="w-4 h-4" /> Phone
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:opacity-70">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>

        {/* View Bio Link */}
        <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#1C2B28] hover:opacity-70 group mt-auto">
          View Bio
          <Arrow direction="right" size="w-4 h-4" className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    );
  }

  // Horizontal variant (original)
  return (
    <div className="flex gap-4 mb-6">
      {/* Agent Image Placeholder */}
      <div className="w-24 h-24 bg-gray-300 rounded-sm flex-shrink-0 overflow-hidden">
        {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
      </div>
      
      <div className="flex flex-col justify-start">
        <h3 className="font-sans font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-xs text-gray-800 font-medium">{role}</p>
        
        <div className="flex items-center justify-between w-full mt-1">
           <a href="#" className="text-xs text-gray-600 hover:text-black flex items-center gap-1 font-medium group">
            View Agent Profile 
            <Arrow direction="right" size="w-3 h-3" className="transition-transform group-hover:translate-x-1" />
          </a>
          {license && <span className="text-[10px] text-gray-500 uppercase tracking-wide ml-4">{license}</span>}
        </div>

        <div className="flex gap-4 mt-3">
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
            <Mail className="w-4 h-4" /> Email
          </button>
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
            <Phone className="w-4 h-4" /> Phone
          </button>
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;

