import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import styles from "./AgentCarousel.module.scss";

export default function AgentsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const agents = [
    {
      name: "Jane Smith",
      role: "Agent",
      location: "Augusta",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop"
    },
    {
      name: "Jordan Collier",
      role: "Agent & Broker",
      location: "Augusta",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop"
    },
    {
      name: "Brian Sweeting",
      role: "Agent & Broker",
      location: "Augusta",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop"
    },
    {
        name: "Brian Sweeting",
        role: "Agent & Broker",
        location: "Augusta",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop"
    },
    {
        name: "Brian Sweeting",
        role: "Agent & Broker",
        location: "Augusta",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % agents.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  return (
    <div className="min-h-screen p-10">
      <div className="mx-auto">
        <div className="flex gap-12 items-start">
          {/* Header Section */}
          <div className="w-280 flex-shrink-0">
            <p className="text-sm tracking-widest text-gray-600 mb-4">MEET OUR AGENTS</p>
            <h1 className="text-5xl font-serif mb-6">
              Experience that<br />Performs
            </h1>
            <p className="text-gray-600 mb-8">
              We're proud to bring a wealth of knowledge and relational capital to every deal and partnership, knowing that trust is a long-term investment.
            </p>
            <button className="flex items-center text-sm hover:gap-3 gap-2 transition-all duration-300">
              Find an Agent <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Agents Carousel */}
          <div className="flex-1 relative">
            <div className="overflow-hidden">
              <div className="flex gap-6 transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}>
                {agents.map((agent, index) => (
                  <div key={index} className="min-w-[calc(33.33%-1rem)] relative group">
                    <div className="relative h-96 overflow-hidden rounded-sm">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-serif mb-1">{agent.name}</h3>
                        <p className="text-sm text-gray-200">{agent.role} | {agent.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Previous agent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Next agent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}