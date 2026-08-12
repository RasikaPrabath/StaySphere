import React, { useState } from 'react';

export default function PropertyModal({ property, onClose, selectedCurrency, onBookProperty }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [nights, setNights] = useState(3);

  if (!property) return null;

  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  const baseNightlyPrice = Math.round(property.price * currencyRate);
  const subtotal = baseNightlyPrice * nights;
  const cleaningFee = Math.round(150 * currencyRate);
  const serviceFee = Math.round(subtotal * 0.08);
  const totalEstimated = subtotal + cleaningFee + serviceFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-white w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-outline-variant relative animate-slideUp">
        
        {/* Top Header Bar */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-white sticky top-0 z-10">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block">
              {property.category.replace("-", " ")}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary line-clamp-1">{property.title}</h2>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 font-medium">
              <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
              {property.location} • <span className="text-primary font-bold">★ {property.rating}</span> ({property.reviewsCount} reviews)
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Slider */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-surface-container-high shadow-md">
              <img 
                src={property.images[activeImageIndex] || property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                {activeImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnails Bar */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-secondary ring-2 ring-secondary/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Property Overview */}
            <div>
              <h3 className="text-base font-bold text-primary mb-2">About this Property</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Specs */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex items-center justify-between text-xs font-bold text-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">king_bed</span>
                <span>{property.specs}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-base font-bold text-primary mb-3">Included Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-surface-white border border-outline-variant rounded-3xl p-6 shadow-xl sticky top-4 flex flex-col justify-between h-fit">
              <div>
                <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-outline-variant">
                  <div>
                    <span className="text-2xl font-extrabold text-primary">
                      {currencySymbol}{baseNightlyPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant"> / night</span>
                  </div>
                  <span className="text-xs font-bold text-success flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">verified</span> Best Price
                  </span>
                </div>

                {/* Duration Counter */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-on-surface-variant block mb-2">Duration of Stay</label>
                  <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant rounded-xl p-3">
                    <span className="text-xs font-bold text-primary">Nights to stay</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setNights(Math.max(1, nights - 1))}
                        className="w-7 h-7 rounded-lg border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{nights}</span>
                      <button 
                        onClick={() => setNights(nights + 1)}
                        className="w-7 h-7 rounded-lg border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary Breakdown */}
                <div className="space-y-2.5 text-xs text-on-surface-variant mb-6 pb-6 border-b border-outline-variant">
                  <div className="flex justify-between">
                    <span>{currencySymbol}{baseNightlyPrice.toLocaleString()} × {nights} nights</span>
                    <span className="font-semibold text-primary">{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning & Maintenance</span>
                    <span className="font-semibold text-primary">{currencySymbol}{cleaningFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>StaySphere Service Fee (8%)</span>
                    <span className="font-semibold text-primary">{currencySymbol}{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 text-sm font-extrabold text-primary border-t border-outline-variant">
                    <span>Total (Incl. Taxes)</span>
                    <span className="text-secondary">{currencySymbol}{totalEstimated.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={() => {
                  onBookProperty && onBookProperty(property, { nights, totalEstimated });
                }}
                className="w-full bg-secondary hover:bg-secondary-container text-white font-bold text-sm py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                <span>Reserve Stay Now</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
