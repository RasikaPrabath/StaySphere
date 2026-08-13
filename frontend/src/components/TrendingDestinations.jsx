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

      {/* Cards Grid matching 5 cards per row standard booking layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
        {filteredDestinations.slice(0, 10).map((dest) => {
          const isSelected = selectedDestination === dest.name;
          const isFavorited = wishlist?.includes(dest.id);

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination && onSelectDestination(dest.name)}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-white border border-slate-100 flex flex-col justify-between h-[340px] ${isSelected ? 'ring-2 ring-[#0058bc]' : ''
                }`}
            >
              {/* Card Image Area */}
              <div className="relative h-40 w-full overflow-hidden shrink-0 bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#003580] text-white px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-[10px]">star</span>
                  <span>{dest.rating}</span>
                </div>

                {/* Discount Badge */}
                {dest.discount && (
                  <div className="absolute top-2.5 right-11 bg-red-600 text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-sm">
                    {dest.discount}
                  </div>
                )}

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist && onToggleWishlist(dest.id);
                  }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${isFavorited ? 'bg-[#FF385C] text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#FF385C]'
                    }`}
                  title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <span className="material-symbols-outlined text-xs">
                    {isFavorited ? 'favorite' : 'favorite_border'}
                  </span>
                </button>

                {/* Stays Count Chip */}
                <div className="absolute bottom-2 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#0058bc]">location_city</span>
                  <span>{dest.stays}</span>
                </div>
              </div>

              {/* Card Details Area */}
              <div className="p-3 text-left flex flex-col justify-between flex-1 bg-white">
                <div>
                  {/* Reviews Count */}
                  <div className="text-[11px] text-slate-500 font-medium mb-1">
                    {dest.reviews ? `${dest.reviews} verified reviews` : 'Top Destination'}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0058bc] transition-colors mb-1">
                    {dest.name}
                  </h3>

                  {/* Description / Perk Badge */}
                  <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold mb-1">
                    <span className="material-symbols-outlined text-[12px]">local_offer</span>
                    <span className="truncate">{dest.offer || 'Hot City Deal'}</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Starts from</span>
                  <div className="text-right">
                    {dest.originalPrice && (
                      <span className="line-through text-slate-400 text-[10px] mr-1">{dest.originalPrice}</span>
                    )}
                    <span className="text-sm font-extrabold text-[#0058bc]">{dest.priceFrom || '$95'}</span>
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
