import React from 'react';
import { FEATURED_COLLECTIONS } from '../data/mockData';

export default function FeaturedCollections({ activeCategory, onSelectCategory }) {
  return (
    <section id="collections" className="w-full max-w-[1400px] mx-auto px-3 md:px-4 py-6 bg-white rounded-3xl my-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider inline-block mb-1.5">Curated Travel</span>
          <h2 className="text-lg md:text-xl font-bold text-[#111827] tracking-tight font-sans">Featured Collections</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Handbook of curated stays for every type of traveler.</p>
        </div>

        {/* Filter Tabs with Underline Indicator */}
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-200/80 pb-1">
          {[
            { id: "all", label: "All Collections", icon: "grid_view" },
            { id: "beachfront", label: "Coastal Escapes", icon: "beach_access" },
            { id: "luxury-villas", label: "Colonial Luxury", icon: "villa" },
            { id: "mountain-retreats", label: "Highland Sanctuaries", icon: "landscape" },
            { id: "boutique-city", label: "City Sophistication", icon: "apartment" },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`pb-2.5 pt-1 px-1 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all relative cursor-pointer ${
                  isSelected 
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

      {/* Grid of Collection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_COLLECTIONS.map((item) => {
          const isSelected = activeCategory === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(isSelected ? "all" : item.id)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer h-80 shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-2 ${isSelected ? 'border-secondary ring-4 ring-secondary/20' : 'border-transparent'}`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-black/30 to-transparent transition-opacity group-hover:from-primary/95" />

              {/* Top Tag Badge */}
              <div className="absolute top-4 left-4 bg-surface-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider border border-white/30">
                {item.tag}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <h3 className="text-xl font-bold text-surface-white mb-1 group-hover:text-tertiary-fixed transition-colors">
                  {item.title}
                </h3>
                <p className="text-surface-white/80 text-xs font-semibold mb-2">
                  {item.count}
                </p>
                <p className="text-surface-white/70 text-[11px] line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
