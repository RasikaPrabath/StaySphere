import React from 'react';
import { FEATURED_COLLECTIONS } from '../data/mockData';

export default function FeaturedCollections({ activeCategory, onSelectCategory }) {
  return (
    <section id="collections" className="w-full max-w-[1400px] mx-auto px-3 md:px-4 pt-1 pb-6 bg-white rounded-3xl my-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider inline-block mb-1.5">Curated Travel</span>
          <h2 className="text-lg md:text-xl font-bold text-[#111827] tracking-tight font-sans">Featured Collections</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Handbook of curated stays for every type of traveler.</p>
        </div>

        {/* Filter Tabs with Underline Indicator */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200/80 pb-1">
          {[
            { id: "all", label: "All Collections", icon: "grid_view" },
            { id: "beachfront", label: "Coastal Escapes", icon: "beach_access" },
            { id: "luxury-villas", label: "Colonial Luxury", icon: "villa" },
            { id: "mountain-retreats", label: "Highland Sanctuaries", icon: "landscape" },
            { id: "boutique-city", label: "City Sophistication", icon: "apartment" },
            { id: "wildlife-safari", label: "Safari Escapes", icon: "forest" },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`pb-2.5 pt-1 px-1 text-xs font-bold flex items-center gap-1.5 transition-all relative cursor-pointer ${isSelected
                    ? 'text-primary font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 font-semibold'
                  }`}
              >
                <span className={`material-symbols-outlined text-base ${isSelected ? 'text-secondary' : 'text-gray-400'}`}>{cat.icon}</span>
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 5 Collection Cards in 1 Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
        {FEATURED_COLLECTIONS.map((item) => {
          const isSelected = activeCategory === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(isSelected ? "all" : item.id)}
              className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${
                isSelected ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-100'
              } flex flex-col justify-between h-[340px]`}
            >
              {/* Card Image Area */}
              <div className="relative h-40 w-full overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Category Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider border border-white/20">
                  {item.tag}
                </div>

                {/* Top Discount Badge */}
                {item.discount && (
                  <div className="absolute top-2.5 right-2.5 bg-red-600 text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-sm">
                    {item.discount}
                  </div>
                )}

                {/* Stays Count Chip */}
                <div className="absolute bottom-2 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-sky-600">bed</span>
                  <span>{item.count}</span>
                </div>
              </div>

              {/* Card Details Area */}
              <div className="p-3 text-left flex flex-col justify-between flex-1 bg-white">
                <div>
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-1.5 mb-1.5 text-xs">
                    <span className="bg-[#003580] text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">star</span>
                      <span>{item.rating}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0058bc] transition-colors mb-1.5">
                    {item.title}
                  </h3>

                  {/* Offer / Perk Badge */}
                  <div className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-0.5 rounded text-[10px] font-bold mb-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    <span className="truncate">{item.offer}</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Starts from</span>
                  <div className="text-right">
                    {item.originalPrice && (
                      <span className="line-through text-slate-400 text-[10px] mr-1">{item.originalPrice}</span>
                    )}
                    <span className="text-sm font-extrabold text-[#0058bc]">{item.priceFrom}</span>
                    <span className="text-[10px] text-slate-500 font-normal"> /night</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
