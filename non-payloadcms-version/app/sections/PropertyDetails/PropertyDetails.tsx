import { 
  Heart, 
  Download, 
  Mail, 
  Phone, 
  Linkedin, 
  Instagram,
  Facebook,
} from 'lucide-react';
import AgentCard from 'non-payloadcms-version/app/components/AgentCard/AgentCard';
import Arrow from 'non-payloadcms-version/app/components/Arrow/Arrow';

const PropertyDetails = () => {
  const limeGreen = "bg-[#dce676]";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-gray-800">
      
      {/* Top Navigation */}
      <div className="mb-6">
        <button className="flex items-center text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black">
          <Arrow direction="left" variant="chevron" size="w-4 h-4" className="mr-1" /> Back to Search
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">105 Lancaster St SW</h1>
          <p className="text-lg text-gray-900 font-medium">1223 W Wheeler Pkwy | Aiken, SC 29801</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <h2 className="text-3xl font-bold text-gray-900">$700,000</h2>
          <p className="text-sm font-semibold text-gray-900">Sale Price</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN (Images & Details) */}
        <div className="lg:col-span-2">
          
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-gray-200 rounded-sm overflow-hidden mb-4 group">
            {/* Image Placeholder */}
            <img 
              src="/api/placeholder/800/500" 
              alt="Property Main" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlays */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`${limeGreen} text-black text-xs font-bold px-3 py-1 rounded-full`}>
                For Sale
              </span>
              <span className={`${limeGreen} text-black text-xs font-bold px-3 py-1 rounded-full`}>
                Price Reduction - 25k, July 1st
              </span>
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white">
              <Arrow direction="left" variant="chevron" size="w-6 h-6" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1 rounded-full text-white">
              <Arrow direction="right" variant="chevron" size="w-6 h-6" />
            </button>

            {/* Favorite Button */}
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-video bg-gray-200 rounded-sm overflow-hidden cursor-pointer hover:opacity-80">
                 <img src={`/api/placeholder/200/120?text=Img${item}`} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Property Details Table */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-gray-800 mb-6">Property Details</h2>
            <div className="border-t border-gray-300">
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Sale Price.</span>
                <span className="text-gray-600">$700,000</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Year Built.</span>
                <span className="text-gray-600">2010</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Property Type.</span>
                <span className="text-gray-600">Office Space</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Building Class</span>
                <span className="text-gray-600">A</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-300">
                <span className="font-bold text-gray-800">Building Size</span>
                <span className="text-gray-600">4,961 SF</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-gray-800 mb-4">Highlights</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Traffic count, buildout type, zoning, tenancy, etc.</li>
              <li>Traffic count, buildout type, zoning, tenancy, etc.</li>
              <li>Traffic count, buildout type, zoning, tenancy, etc.</li>
            </ul>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-gray-800 mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Lorem ipsum dolor sit amet consectetur. A elementum diam diam enim amet. Pellentesque consectetur mauris nisl felis non odio dolor ut cum. Ut elementum facilisis urna eget facilisi quam. Bibendum a cras mattis aliquam. Volutpat nisl egestas sed ac orci. Sit aliquet egestas semper commodo. Mi integer nunc mauris at dictum aenean orci. Velit sit enim accumsan in mi nulla et vulputate pellentesque.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="lg:col-span-1">
          
          {/* Download Brochure */}
          <button className="w-full flex items-center justify-center gap-2 border border-black rounded-full py-3 px-4 font-bold text-sm hover:bg-gray-50 mb-10">
            <Download className="w-4 h-4" /> Download Brochure PDF
          </button>

          {/* Agent Cards */}
          <div className="mb-10">
            <AgentCard 
              name="Jordan Collier" 
              role="Agent & Broker" 
              license="GA #000000" 
            />
             <AgentCard 
              name="Jordan Collier" 
              role="Agent & Broker" 
              license="GA #000000" 
            />
             <AgentCard 
              name="Jordan Collier" 
              role="Agent & Broker" 
              license="GA #000000" 
            />
          </div>

          {/* Contact Form */}
          <div className="mb-8">
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Interested in This Property.</h3>
            <p className="text-gray-700 font-medium mb-4">Request More Info</p>

            <form className="space-y-3">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="tel" 
                placeholder="Phone" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <input 
                type="text" 
                placeholder="Transaction Coordinator" 
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <textarea 
                placeholder="Message" 
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
              ></textarea>
              
              <p className="text-[10px] text-gray-500 mt-2">Terms of Use & Privacy Policy</p>

              <button 
                type="submit" 
                className={`w-full ${limeGreen} text-black font-bold py-3 rounded-full mt-4 hover:opacity-90 transition-opacity`}
              >
                Submit
              </button>
            </form>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-6 mt-8">
            <span className="text-sm font-medium text-gray-900">Share</span>
            <div className="flex gap-4 text-gray-800">
              <Linkedin className="w-6 h-6 cursor-pointer hover:text-black" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-black" />
              <Facebook className="w-6 h-6 cursor-pointer hover:text-black" />
              <Mail className="w-6 h-6 cursor-pointer hover:text-black" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

