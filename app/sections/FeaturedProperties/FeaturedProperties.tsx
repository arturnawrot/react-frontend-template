import React from 'react';
import PropertyCard from '~/components/PropertyCard/PropertyCard';
import Arrow from '~/components/Arrow/Arrow';

const featuredProperties = [
  {
    id: 1,
    address: '105 Lancaster St SW',
    cityStateZip: 'Aiken, SC 29801',
    price: '$700,000',
    sqft: '4,961 SF',
    type: 'Office Space',
    agent: 'Jane Smith',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badges: [
      { text: 'For Sale', color: 'bg-[#CDDC39]' },
      { text: 'Price Reduction - 25k, July 1st', color: 'bg-[#D4E157]' },
    ],
  },
  {
    id: 2,
    address: '414 River Birch Ln',
    cityStateZip: 'Augusta, GA 30907',
    price: '$1,250,000',
    sqft: '7,200 SF',
    type: 'Retail',
    agent: 'Michael Chen',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badges: [
      { text: 'For Sale', color: 'bg-[#CDDC39]' },
      { text: 'New Listing', color: 'bg-[#D4E157]' },
    ],
  },
  {
    id: 3,
    address: '290 Broad St',
    cityStateZip: 'Columbia, SC 29201',
    price: '$985,000',
    sqft: '5,430 SF',
    type: 'Mixed Use',
    agent: 'Lauren Davis',
    image:
      'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badges: [
      { text: 'For Sale', color: 'bg-[#CDDC39]' },
      { text: 'Open House - Sat', color: 'bg-[#D4E157]' },
    ],
  },
  {
    id: 4,
    address: '78 Parkside Ave',
    cityStateZip: 'North Augusta, SC 29841',
    price: '$615,000',
    sqft: '3,980 SF',
    type: 'Office Space',
    agent: 'Jane Smith',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badges: [
      { text: 'For Sale', color: 'bg-[#CDDC39]' },
      { text: 'Price Reduction - 10k', color: 'bg-[#D4E157]' },
    ],
  },
];

const FeaturedProperties = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 font-sans text-[#1C2B28]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-stone-500 mb-2">
            Featured
          </p>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">Featured Properties</h2>
        </div>

        <a
          href="/property-search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B28] hover:underline"
        >
          See All Listings <Arrow direction="right" size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} variant="vertical" />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProperties;

