import React, { useState, useEffect } from 'react';
import { PROPERTIES } from '../data/mockData';
import { searchApi } from '../data/api';

export default function SearchResults({ 
  searchQuery, 
  onSelectProperty, 
  wishlist, 
  onToggleWishlist,
  selectedCurrency 
}) {
  const [budgetMax, setBudgetMax] = useState(1000);
  const [ratingFilter, setRatingFilter] = useState({ 9: false, 8: true, 7: false });
  const [amenityFilter, setAmenityFilter] = useState({ wifi: false, pool: false, gym: false, spa: false });
  const [sortBy, setSortBy] = useState("top-picks");
  const [currentPage, setCurrentPage] = useState(1);
  const [backendProperties, setBackendProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSource, setSearchSource] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const queryParts = searchQuery ? searchQuery.split(",") : [];
        const city = queryParts[0]?.trim();
        const country = queryParts[1]?.trim();

        const response = await searchApi.searchHotels({
          city: city || undefined,
          country: country || undefined,
          sortBy: sortBy === "lowest-price" ? "pricelowtohigh" : "rating"
        });

        // Map API response to UI format
        const mapped = response.items.map(item => ({
          id: item.id,
          title: item.name,
          location: `${item.city}, ${item.country}`,
          price: item.minRoomPrice || 120, // default if no rooms
          rating: item.starRating,
          reviewsCount: 45,
          image: item.imageUrls[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          images: item.imageUrls,
          amenities: item.amenities,
          description: item.description,
          category: "beachfront"
        }));

        setBackendProperties(mapped);
        setSearchSource(response.source);
      } catch (err) {
        console.warn("Backend API search offline, falling back to mockData", err);
        setBackendProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, sortBy]);

  const displayProperties = backendProperties.length > 0 ? backendProperties : PROPERTIES;

  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  // Filter properties
  let filtered = displayProperties.filter((prop) => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchLoc = prop.location.toLowerCase().includes(q);
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchDest = prop.destinationId?.toLowerCase().includes(q);
      if (!matchLoc && !matchTitle && !matchDest) return false;
    }

    // Budget match
    if (prop.price > budgetMax) return false;

    // Rating filter
    const activeRatings = Object.keys(ratingFilter).filter(r => ratingFilter[r]);
    if (activeRatings.length > 0) {
      const passes = activeRatings.some(minR => prop.rating >= parseFloat(minR));
      if (!passes) return false;
    }

    // Amenities filter
    if (amenityFilter.wifi && !prop.amenities.some(a => a.toLowerCase().includes("wifi"))) return false;
    if (amenityFilter.pool && !prop.amenities.some(a => a.toLowerCase().includes("pool"))) return false;
    if (amenityFilter.gym && !prop.amenities.some(a => a.toLowerCase().includes("gym") || a.toLowerCase().includes("fitness"))) return false;
    if (amenityFilter.spa && !prop.amenities.some(a => a.toLowerCase().includes("spa"))) return false;

    return true;
  });

  // Sort logic
  if (sortBy === "lowest-price") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highest-rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const locationTitle = searchQuery ? searchQuery.split(",")[0] : "Colombo";

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-4 md:px-12 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left Sidebar: Filters */}
      <aside className="md:col-span-3 hidden md:block">
        <div className="bg-surface-white rounded-2xl border border-outline-variant p-6 sticky top-28 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-on-surface">Filters</h2>
            <button 
              onClick={() => {
                setBudgetMax(1000);
                setRatingFilter({ 9: false, 8: false, 7: false });
                setAmenityFilter({ wifi: false, pool: false, gym: false, spa: false });
              }}
              className="text-secondary font-bold text-xs hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="border-t border-outline-variant/60 pt-4">
              <h3 className="text-xs font-bold text-on-surface mb-3">Your budget (per night)</h3>
              <div className="px-1">
                <input 
                  type="range"
                  min="0"
                  max="1000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold text-on-surface-variant">
                <span>{currencySymbol}0</span>
                <span>{currencySymbol}{Math.round(budgetMax * currencyRate)}{budgetMax >= 1000 ? '+' : ''}</span>
              </div>
            </div>

            {/* Guest Rating */}
            <div className="border-t border-outline-variant/60 pt-4">
              <h3 className="text-xs font-bold text-on-surface mb-3">Guest rating</h3>
              <div className="space-y-2">
                {[
                  { min: 9, label: "Wonderful: 9+", count: 124 },
                  { min: 8, label: "Very Good: 8+", count: 256 },
                  { min: 7, label: "Good: 7+", count: 89 },
                ].map(item => (
                  <label key={item.min} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                    <input 
                      type="checkbox"
                      checked={ratingFilter[item.min]}
                      onChange={(e) => setRatingFilter({ ...ratingFilter, [item.min]: e.target.checked })}
                      className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4"
                    />
                    <span>{item.label}</span>
                    <span className="ml-auto text-on-surface-variant font-normal">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t border-outline-variant/60 pt-4">
              <h3 className="text-xs font-bold text-on-surface mb-3">Amenities</h3>
              <div className="space-y-2">
                {[
                  { key: "wifi", label: "Free WiFi" },
                  { key: "pool", label: "Swimming Pool" },
                  { key: "gym", label: "Fitness Center" },
                  { key: "spa", label: "Spa & Wellness" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                    <input 
                      type="checkbox"
                      checked={amenityFilter[item.key]}
                      onChange={(e) => setAmenityFilter({ ...amenityFilter, [item.key]: e.target.checked })}
                      className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area: Search Results */}
      <section className="col-span-1 md:col-span-9 flex flex-col gap-6">
        {/* Summary and Sorting Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-extrabold text-primary">
                {locationTitle}: {filtered.length > 0 ? `${filtered.length} properties found` : "0 properties found"}
              </h1>
              {searchSource && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  searchSource === "Cache" 
                    ? "bg-secondary-fixed/20 text-secondary border-secondary/20" 
                    : "bg-primary-fixed/20 text-primary border-primary/20"
                }`}>
                  <span className="material-symbols-outlined text-[12px]">{searchSource === "Cache" ? "bolt" : "database"}</span>
                  {searchSource === "Cache" ? "Redis Cache" : "PostgreSQL"}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">
              Oct 12 - Oct 15 • 2 Adults, 1 Room
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-on-surface-variant">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-none bg-transparent text-xs font-bold text-primary focus:ring-0 cursor-pointer outline-none"
            >
              <option value="top-picks">Our top picks</option>
              <option value="lowest-price">Lowest price first</option>
              <option value="highest-rating">Guest rating (highest first)</option>
            </select>
          </div>
        </div>

        {/* Results List Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-on-surface-variant mt-4 font-medium">Searching best available stays...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface-white rounded-3xl p-12 text-center border border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">search_off</span>
            <h3 className="text-base font-bold text-primary mb-1">No Properties Found in {locationTitle}</h3>
            <p className="text-xs text-on-surface-variant mb-6">
              Try adjusting your price budget or clearing filters to view available stays.
            </p>
            <button 
              onClick={() => {
                setBudgetMax(1000);
                setRatingFilter({ 9: false, 8: false, 7: false });
                setAmenityFilter({ wifi: false, pool: false, gym: false, spa: false });
              }}
              className="bg-secondary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-secondary-container transition-colors shadow"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((property) => {
              const isFavorited = wishlist.includes(property.id);
              const convertedPrice = Math.round(property.price * currencyRate);
              const convertedOrig = property.originalPrice ? Math.round(property.originalPrice * currencyRate) : null;
              const convertedTaxes = property.taxes ? Math.round(property.taxes * currencyRate) : 35;

              return (
                <div 
                  key={property.id}
                  onClick={() => onSelectProperty(property)}
                  className="bg-surface-white rounded-2xl border border-outline-variant shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group cursor-pointer"
                >
                  {/* Property Image & Heart */}
                  <div className="w-full sm:w-1/3 h-52 sm:h-auto relative bg-surface-container-high shrink-0">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist && onToggleWishlist(property.id);
                      }}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all shadow ${isFavorited ? 'bg-error text-white' : 'bg-inverse-surface/30 text-white hover:text-error'}`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isFavorited ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                            {property.title}
                          </h2>
                          <p className="text-xs text-secondary hover:underline flex items-center gap-1 mt-1 font-semibold">
                            <span>{property.location}</span>
                            {property.distance && (
                              <span className="text-on-surface-variant font-normal">· {property.distance}</span>
                            )}
                          </p>

                          {/* Amenity Pills */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {property.amenities.slice(0, 3).map((am, i) => (
                              <span key={i} className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-md text-[11px] font-semibold">
                                <span className="material-symbols-outlined text-xs text-primary">check</span> {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Guest Rating Score Badge */}
                        <div className="flex items-center gap-2 text-right shrink-0">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-primary">{property.ratingText || "Excellent"}</span>
                            <span className="text-[11px] text-on-surface-variant font-medium">{property.reviewsCount} reviews</span>
                          </div>
                          <div className="bg-primary-container text-white font-extrabold text-base px-2.5 py-1.5 rounded-xl flex items-center justify-center min-w-[42px] min-h-[42px] shadow-sm">
                            {property.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Cancellation & Pricing Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4 pt-4 border-t border-surface-container-high gap-4">
                      <div>
                        {property.freeCancellation && (
                          <p className="text-xs font-bold text-success flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Free cancellation</span>
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {property.cancellationNote || "You can cancel later, so lock in this great price today."}
                        </p>
                        {property.urgentNote && (
                          <p className="text-xs font-bold text-error mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            <span>{property.urgentNote}</span>
                          </p>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end w-full sm:w-auto shrink-0">
                        {convertedOrig && (
                          <p className="text-xs text-on-surface-variant line-through font-semibold">
                            {currencySymbol}{convertedOrig.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xl font-extrabold text-primary">
                          {currencySymbol}{convertedPrice.toLocaleString()}{" "}
                          <span className="text-xs text-on-surface-variant font-normal">/ night</span>
                        </p>
                        <p className="text-[11px] text-on-surface-variant mb-2">
                          +{currencySymbol}{convertedTaxes} taxes and charges
                        </p>
                        <button 
                          onClick={() => onSelectProperty(property)}
                          className="bg-secondary hover:bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm w-full sm:w-auto active:scale-95"
                        >
                          See availability
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-outline-variant rounded-xl bg-surface-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-3 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors border-r border-outline-variant"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className={`px-4 py-2 font-bold text-xs ${currentPage === 1 ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container-low'}`}>1</button>
            <button className={`px-4 py-2 font-bold text-xs ${currentPage === 2 ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container-low'}`} onClick={() => setCurrentPage(2)}>2</button>
            <button className={`px-4 py-2 font-bold text-xs ${currentPage === 3 ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container-low'}`} onClick={() => setCurrentPage(3)}>3</button>
            <span className="px-2 text-xs text-on-surface-variant">...</span>
            <button className="px-4 py-2 font-bold text-xs text-on-surface hover:bg-surface-container-low">15</button>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors border-l border-outline-variant"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
