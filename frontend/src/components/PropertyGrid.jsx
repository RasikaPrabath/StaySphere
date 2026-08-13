import React, { useState } from 'react';
import { PROPERTIES } from '../data/mockData';

export default function PropertyGrid({
  selectedCategory,
  locationQuery,
  selectedDestination,
  selectedCurrency,
  onSelectProperty,
  wishlist,
  onToggleWishlist
}) {
  const [priceFilter, setPriceFilter] = useState("all");
  const [amenityFilter, setAmenityFilter] = useState("all");
  const [minRatingFilter, setMinRatingFilter] = useState(0);

  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  const filteredProperties = PROPERTIES.filter((prop) => {
    // Category match
    if (selectedCategory && selectedCategory !== "all" && prop.category !== selectedCategory) {
      return false;
    }
    // Destination match
    if (selectedDestination && !prop.location.toLowerCase().includes(selectedDestination.toLowerCase())) {
      return false;
    }
    // Location Search Query match
    if (locationQuery) {
      const q = locationQuery.toLowerCase();
      const matchLoc = prop.location.toLowerCase().includes(q);
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchCat = prop.category.toLowerCase().includes(q);
      if (!matchLoc && !matchTitle && !matchCat) return false;
    }
    // Price filter
    if (priceFilter === "under-1000" && prop.price >= 1000) return false;
    if (priceFilter === "1000-2000" && (prop.price < 1000 || prop.price > 2000)) return false;
    if (priceFilter === "over-2000" && prop.price <= 2000) return false;

    // Amenity filter
    if (amenityFilter === "pool" && !prop.amenities.some(a => a.toLowerCase().includes("pool"))) return false;
    if (amenityFilter === "spa" && !prop.amenities.some(a => a.toLowerCase().includes("spa"))) return false;
    if (amenityFilter === "wifi" && !prop.amenities.some(a => a.toLowerCase().includes("wifi"))) return false;
    if (amenityFilter === "cancellation" && !prop.freeCancellation) return false;

    // Rating filter
    if (minRatingFilter > 0 && prop.rating < minRatingFilter) return false;

    return true;
  });

  const resetAllGridFilters = () => {
    setPriceFilter("all");
    setAmenityFilter("all");
    setMinRatingFilter(0);
  };

  const hasActiveGridFilters = priceFilter !== "all" || amenityFilter !== "all" || minRatingFilter > 0;

  return (
    <section id="properties" className="w-full max-w-[1400px] mx-auto px-3 md:px-4 py-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-outline-variant/40">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#111827] tracking-tight font-sans flex items-center gap-2">
            <span>Exclusive Stays & Villas</span>
            {hasActiveGridFilters && (
              <span className="text-[10px] font-extrabold bg-secondary text-white px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">
            Showing {filteredProperties.length} hand-picked luxury spaces available for booking.
          </p>
        </div>

        {/* Filter Tabs Container */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Price Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price:</span>
            {[
              { id: "all", label: "All Prices" },
              { id: "under-1000", label: `Under ${currencySymbol}${Math.round(1000 * currencyRate)}` },
              { id: "1000-2000", label: `${currencySymbol}${Math.round(1000 * currencyRate)} - ${currencySymbol}${Math.round(2000 * currencyRate)}` },
              { id: "over-2000", label: `${currencySymbol}${Math.round(2000 * currencyRate)}+` },
            ].map(btn => {
              const isSelected = priceFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setPriceFilter(btn.id)}
                  className={`pb-1 text-xs font-bold transition-all relative cursor-pointer ${isSelected ? 'text-primary font-extrabold' : 'text-gray-500 hover:text-gray-900 font-medium'
                    }`}
                >
                  {btn.label}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-4 bg-gray-200 hidden sm:block" />

          {/* Quick Amenity Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Features:</span>
            {[
              { id: "all", label: "All Features", icon: "tune" },
              { id: "pool", label: "Pool", icon: "pool" },
              { id: "spa", label: "Spa", icon: "spa" },
              { id: "cancellation", label: "Free Cancel", icon: "task_alt" },
            ].map(btn => {
              const isSelected = amenityFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setAmenityFilter(btn.id)}
                  className={`pb-1 text-xs font-bold flex items-center gap-1 transition-all relative cursor-pointer ${isSelected ? 'text-secondary font-extrabold' : 'text-gray-500 hover:text-gray-900 font-medium'
                    }`}
                >
                  <span className={`material-symbols-outlined text-xs ${isSelected ? 'text-secondary' : 'text-gray-400'}`}>{btn.icon}</span>
                  <span>{btn.label}</span>
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>

          {hasActiveGridFilters && (
            <button
              onClick={resetAllGridFilters}
              className="text-xs font-bold text-error hover:underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Property Grid Cards */}
      {filteredProperties.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-12 text-center max-w-lg mx-auto border border-outline-variant">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">search_off</span>
          <h3 className="text-lg font-bold text-primary mb-1">No Properties Found</h3>
          <p className="text-xs text-on-surface-variant mb-6">
            Try adjusting your search criteria or price filters to see more luxury stays.
          </p>
          <button
            onClick={() => setPriceFilter("all")}
            className="bg-secondary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-secondary-container transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            const isFavorited = wishlist.includes(property.id);
            const convertedPrice = Math.round(property.price * currencyRate);

            return (
              <div
                key={property.id}
                className="bg-surface-white rounded-3xl overflow-hidden border border-outline-variant/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Gallery Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high cursor-pointer" onClick={() => onSelectProperty(property)}>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider">
                    {property.category.replace("-", " ")}
                  </span>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist && onToggleWishlist(property.id);
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md ${isFavorited ? 'bg-error text-white' : 'bg-surface-white/80 text-on-surface hover:bg-surface-white hover:text-error'}`}
                    title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isFavorited ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {property.location}
                      </span>
                      <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-bold text-primary">
                        <span className="material-symbols-outlined text-rating-gold text-sm">star</span>
                        <span>{property.rating}</span>
                        <span className="text-[10px] text-on-surface-variant font-normal">({property.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="text-lg font-bold text-primary hover:text-secondary transition-colors cursor-pointer line-clamp-1 mb-2"
                    >
                      {property.title}
                    </h3>

                    <p className="text-xs text-on-surface-variant font-medium mb-4 line-clamp-1">
                      {property.specs}
                    </p>

                    {/* Top Amenities Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {property.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2.5 py-1 rounded-md">
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="pt-4 border-t border-outline-variant/40 flex justify-between items-center">
                    <div>
                      <span className="text-xl font-extrabold text-primary tracking-tight">
                        {currencySymbol}{convertedPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-normal text-on-surface-variant"> / night</span>
                    </div>

                    <button
                      onClick={() => onSelectProperty(property)}
                      className="bg-secondary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-secondary-container transition-all shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
