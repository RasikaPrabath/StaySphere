import React, { useState, useEffect } from 'react';
import { PROPERTIES } from '../data/mockData';
import { hotelApi } from '../data/api';

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
  const [sortBy, setSortBy] = useState("recommended");
  const [backendProperties, setBackendProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const data = await hotelApi.getHotels();
        const mapped = data.map(h => ({
          id: h.id,
          title: h.name,
          location: `${h.city}, ${h.country}`,
          price: h.priceFrom || 150,
          rating: h.starRating || 4.5,
          reviewsCount: h.reviews?.length || 24,
          images: h.imageUrls && h.imageUrls.length > 0 ? h.imageUrls : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
          category: h.amenities?.some(a => a.toLowerCase().includes("beach")) ? "beachfront" : "luxury-villas",
          amenities: h.amenities || [],
          freeCancellation: h.amenities?.some(a => a.toLowerCase().includes("cancel")) || true,
          description: h.description || ""
        }));
        setBackendProperties(mapped);
      } catch (err) {
        console.warn("Failed to fetch hotels from API, falling back to mock properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const displayProperties = backendProperties.length > 0 ? backendProperties : PROPERTIES;

  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  const filteredProperties = displayProperties.filter((prop) => {
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

  // Standard Sorting Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
    return 0;
  });

  const resetAllGridFilters = () => {
    setPriceFilter("all");
    setAmenityFilter("all");
    setMinRatingFilter(0);
    setSortBy("recommended");
  };

  const hasActiveGridFilters = priceFilter !== "all" || amenityFilter !== "all" || minRatingFilter > 0 || sortBy !== "recommended";

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
            Showing {sortedProperties.length} hand-picked luxury spaces available for booking.
          </p>
        </div>

        {/* Filter Tabs Container & Sort Dropdown */}
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

          <div className="w-[1px] h-4 bg-gray-200 hidden sm:block" />

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#0058bc] cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated (★)</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>

          {hasActiveGridFilters && (
            <button
              onClick={resetAllGridFilters}
              className="text-xs font-bold text-error hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Property Grid Cards */}
      {sortedProperties.length === 0 ? (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
          {sortedProperties.map((property) => {
            const isFavorited = wishlist.includes(property.id);
            const convertedPrice = Math.round(property.price * currencyRate);

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-[380px]"
              >
                {/* Image Gallery Container */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 shrink-0 cursor-pointer" onClick={() => onSelectProperty(property)}>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  {/* Category Tag */}
                  <span className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider border border-white/20">
                    {property.category.replace("-", " ")}
                  </span>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist && onToggleWishlist(property.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${isFavorited ? 'bg-[#FF385C] text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#FF385C]'}`}
                    title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isFavorited ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-3 flex-grow flex flex-col justify-between text-left">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-sky-700 flex items-center gap-0.5 truncate max-w-[130px]">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span className="truncate">{property.location}</span>
                      </span>
                      <div className="flex items-center gap-0.5 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                        <span className="material-symbols-outlined text-amber-500 text-[10px]">star</span>
                        <span>{property.rating}</span>
                        <span className="text-[9px] text-gray-500 font-normal">({property.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0058bc] transition-colors cursor-pointer line-clamp-1 mb-1"
                    >
                      {property.title}
                    </h3>

                    <p className="text-[10px] text-slate-500 font-medium mb-2 line-clamp-1">
                      {property.specs}
                    </p>

                    {/* Top Amenities Pills */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {property.amenities.slice(0, 2).map((amenity, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 2 && (
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          +{property.amenities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-extrabold text-[#0058bc] tracking-tight">
                        {currencySymbol}{convertedPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-normal text-slate-500"> /night</span>
                    </div>

                    <button
                      onClick={() => onSelectProperty(property)}
                      className="bg-[#0058bc] hover:bg-[#003580] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Explore</span>
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
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
