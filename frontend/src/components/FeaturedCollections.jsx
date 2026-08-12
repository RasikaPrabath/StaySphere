import React from 'react';
import { FEATURED_COLLECTIONS } from '../data/mockData';

export default function FeaturedCollections({ activeCategory, onSelectCategory }) {
  return (
    <section id="collections" className="w-full max-w-container-max mx-auto px-4 md:px-12 py-16 bg-surface-container-low/60 rounded-3xl my-6">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Curated Travel</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Featured Collections</h2>
          <p className="text-sm md:text-base text-on-surface-variant font-medium mt-1">Handbook of curated stays for every type of traveler.</p>
        </div>
        
        <button 
          onClick={() => onSelectCategory("all")}
          className={`hidden md:flex items-center text-xs font-bold px-4 py-2 rounded-xl transition-all border ${activeCategory === "all" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-white text-secondary border-outline-variant hover:border-secondary'}`}
        >
          <span>View all collections</span>
          <span className="material-symbols-outlined ml-1.5 text-base">arrow_forward</span>
        </button>
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
