export default function CTAFooter() {
    return ( 
        <>
            <div className="w-full font-sans antialiased">
                <section className="bg-[#dce567] py-24 px-4 flex flex-col items-center justify-center text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1b2e28] mb-10 tracking-tight">
                        Ready to make your next move?
                    </h2>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <button className="bg-[#1b2e28] text-white px-8 py-3 rounded-full font-medium border border-[#1b2e28] hover:bg-opacity-90 transition outline-none">
                        Schedule a Consultation
                        </button>
                        
                        <button className="bg-transparent text-[#1b2e28] px-8 py-3 rounded-full font-medium border border-[#1b2e28] hover:bg-[#1b2e28] hover:text-white transition outline-none">
                        Get Matched with a Agent
                        </button>
                        
                        <button className="bg-transparent text-[#1b2e28] px-8 py-3 rounded-full font-medium border border-[#1b2e28] hover:bg-[#1b2e28] hover:text-white transition outline-none">
                        Search Listings
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}