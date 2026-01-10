import { Mail, Phone, Linkedin } from 'lucide-react';

type AboutAgentProps = {
  agentName?: string;
  paragraphs?: string[];
  serving?: string[];
  specialties?: string[];
  roles?: string[];
  email?: string;
  phone?: string;
  linkedin?: string;
  onScheduleClick?: () => void;
};

export default function AboutAgent({
  agentName = "Jordan",
  paragraphs = [
    "Lorem ipsum dolor sit amet consectetur. Nullam in dignissim mattis posuere placerat. Sagittis elementum sit aliquet senectus in. Proin mi tellus mollis massa eros porttitor mauris vivamus. Habitasse sit vulputate enim placerat quis.",
    "Arcu aliquam pretium eu dis urna nibh egestas fringilla. Posuere tincidunt felis ut donec tincidunt. Sit leo at arcu egestas gravida id nisi ut in. Dolor urna nisl pellentesque odio in risus diam. Tempus at a molestie fames. Auctor ornare ipsum vitae lectus facilisis nunc ut vitae feugiat. Nec quam a vitae id. Eget nibh consectetur fermentum mauris mollis cursus ultrices molestie erat.",
    "Cursus massa ornare ut fermentum faucibus nec in arcu aliquam. Pellentesque gravida tristique tellus senectus ut quis. Etiam malesuada senectus eget cras urna cras rhoncus posuere turpis. In volutpat nisl facilisis pellentesque pulvinar. Et odio nulla feugiat in id lectus consequat vitae id."
  ],
  serving = ["Augusta", "Savannah", "Statesboro"],
  specialties = ["Land", "Retail", "STNL", "Industrial", "Office"],
  roles = ["Buyer Rep", "Tenant Rep", "Dispositions"],
  email,
  phone,
  linkedin,
  onScheduleClick
}: AboutAgentProps) {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <h2 className="text-5xl md:text-6xl font-serif text-[#1a2e2a] mb-8 leading-tight">
              About {agentName}
            </h2>
            <div className="space-y-6 text-[#1a2e2a]">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-[#F5F3F0] rounded-2xl p-8">
              {/* SERVING Section */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                  SERVING
                </p>
                <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                  {serving.join(", ")}
                </p>
                <div className="border-t border-gray-300 mt-6"></div>
              </div>

              {/* SPECIALTIES Section */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                  SPECIALTIES
                </p>
                <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                  {specialties.join(", ")}
                </p>
                <div className="border-t border-gray-300 mt-6"></div>
              </div>

              {/* ROLES Section */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                  ROLES
                </p>
                <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                  {roles.join(", ")}
                </p>
                <div className="border-t border-gray-300 mt-6"></div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-6">
                  {email && (
                    <a 
                      href={`mailto:${email}`} 
                      className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  )}
                  {phone && (
                    <a 
                      href={`tel:${phone}`} 
                      className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                    >
                      <Phone className="w-4 h-4" /> Phone
                    </a>
                  )}
                  {linkedin && (
                    <a 
                      href={linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Schedule A Consultation Button */}
              <button
                onClick={onScheduleClick}
                className="w-full bg-[#DAE684] text-[#0F231D] font-semibold hover:bg-[#cdd876] transition-colors rounded-full px-8 py-3 text-base text-center font-sans"
              >
                Schedule A Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

