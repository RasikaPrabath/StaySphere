import React, { useState } from 'react';
import { TRENDING_DESTINATIONS } from '../data/mockData';

export default function TrendingDestinations({ onSelectDestination, selectedDestination, wishlist, onToggleWishlist }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleNext = () => {
    setScrollIndex((prev) => (prev + 1) % (TRENDING_DESTINATIONS.length - 3));
  };

  const handlePrev = () => {
    setScrollIndex((prev) => (prev === 0 ? TRENDING_DESTINATIONS.length - 4 : prev - 1));
  };

  return (
    <section id="destinations" className="w-full max-w-container-max mx-auto px-4 md:px-12 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Global Hotspots</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Trending Destinations</h2>
          <p className="text-sm md:text-base text-on-surface-variant font-medium mt-1">Explore top-rated locations for your next luxury escape.</p>
        </div>

        <div className="hidden md:flex gap-3">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container hover:border-secondary transition-all shadow-sm active:scale-95"
            title="Previous"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container hover:border-secondary transition-all shadow-sm active:scale-95"
            title="Next"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRENDING_DESTINATIONS.slice(scrollIndex, scrollIndex + 8).map((dest) => {
          const isSelected = selectedDestination === dest.name;
          const isFavorited = wishlist.includes(dest.id);

          return (
            <div
              key={dest.id}
              className={`group cursor-pointer rounded-2xl p-2 transition-all duration-300 hover:shadow-lg ${isSelected ? 'bg-secondary-fixed/30 ring-2 ring-secondary' : 'bg-transparent'}`}
            >
              <div 
                onClick={() => onSelectDestination(isSelected ? "" : dest.name)}
                className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/5] mb-3 bg-surface-container-high"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-surface-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-extrabold text-primary flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-rating-gold text-base">star</span> 
                  <span>{dest.rating}</span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist && onToggleWishlist(dest.id);
                  }}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md ${isFavorited ? 'bg-error text-white' : 'bg-surface-white/80 text-on-surface hover:bg-surface-white hover:text-error'}`}
                  title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isFavorited ? 'favorite' : 'favorite_border'}
                  </span>
                </button>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <span className="text-xs font-semibold text-tertiary-fixed mb-1">Click to filter stays</span>
                  <span className="text-xs line-clamp-2">{dest.description}</span>
                </div>
              </div>

              <div onClick={() => onSelectDestination(isSelected ? "" : dest.name)}>
                <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors flex items-center justify-between">
                  <span>{dest.name}</span>
                  <span className="text-xs font-normal text-on-surface-variant">{dest.country}</span>
                </h3>
                <p className="text-on-surface-variant text-xs font-semibold mt-0.5">{dest.stays}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
