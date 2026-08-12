import React, { useState } from 'react';
import { TRENDING_DESTINATIONS, PROPERTIES } from '../data/mockData';

export default function TrendingDestinations({ onSelectDestination, selectedDestination, wishlist, onToggleWishlist }) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All deals" },
    { id: "colombo", label: "Colombo" },
    { id: "galle", label: "Galle" },
    { id: "kandy", label: "Kandy" },
    { id: "ella", label: "Ella" },
    { id: "nuwara-eliya", label: "Nuwara Eliya" },
    { id: "weligama", label: "Weligama" }
  ];

  // Filter properties or destinations based on active city tab
  const filteredDestinations = activeTab === "all"
    ? TRENDING_DESTINATIONS
    : TRENDING_DESTINATIONS.filter(d => d.id.includes(activeTab) || d.name.toLowerCase().includes(activeTab));

  return (
    <section id="destinations" className="w-full max-w-[1400px] mx-auto px-3 md:px-4 py-6">
      {/* Section Header matching Trivago style */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#111827] tracking-tight font-sans">
          Hot deals in popular Sri Lankan cities
        </h2>
        <button
          onClick={() => onSelectDestination && onSelectDestination("")}
          className="text-xs font-extrabold text-[#0058bc] hover:underline flex items-center gap-1"
        >
          <span>See more deals</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* City Filter Tabs matching Trivago style */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "all") {
                  onSelectDestination && onSelectDestination(tab.label);
                } else {
                  onSelectDestination && onSelectDestination("");
                }
              }}
              className={`pb-3 text-xs md:text-sm font-bold whitespace-nowrap transition-colors relative cursor-pointer ${isActive ? 'text-[#0058bc]' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0058bc] rounded-full animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>

      {/* Cards Grid matching Trivago cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDestinations.slice(0, 8).map((dest) => {
          const isSelected = selectedDestination === dest.name;
          const isFavorited = wishlist?.includes(dest.id);

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination && onSelectDestination(dest.name)}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-white border border-gray-150 flex flex-col ${isSelected ? 'ring-2 ring-[#0058bc]' : ''
                }`}
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-extrabold text-gray-900 flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                  <span>{dest.rating}</span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist && onToggleWishlist(dest.id);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${isFavorited ? 'bg-[#FF385C] text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#FF385C]'
                    }`}
                  title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <span className="material-symbols-outlined text-base">
                    {isFavorited ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col justify-between flex-grow text-left">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#0058bc] transition-colors truncate">
                    {dest.name}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5 line-clamp-1">
                    {dest.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">{dest.stays}</span>
                  <span className="text-xs font-black text-[#0058bc] group-hover:translate-x-0.5 transition-transform flex items-center">
                    Explore <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
