import { Mail, Phone, Linkedin, ArrowRight } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  license: string;
  image?: string;
}

const AgentCard = ({ name, role, license, image }: AgentCardProps) => {
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
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </a>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide ml-4">{license}</span>
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

