import React from 'react';
import { PROPERTIES, TRENDING_DESTINATIONS } from '../data/mockData';

export default function WishlistDrawer({ isOpen, onClose, wishlist, onToggleWishlist, onSelectProperty, selectedCurrency }) {
  if (!isOpen) return null;

  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  // Filter properties and destinations in wishlist
  const savedProperties = PROPERTIES.filter(p => wishlist.includes(p.id));
  const savedDestinations = TRENDING_DESTINATIONS.filter(d => wishlist.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-outline-variant animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">favorite</span>
            <h2 className="text-xl font-extrabold text-primary">Saved Stays ({wishlist.length})</h2>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="material-symbols-outlined text-5xl text-outline">favorite_border</span>
              <h3 className="text-base font-bold text-primary">Your Wishlist is Empty</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Explore destinations or stays and tap the heart icon to save your favorite luxury escapes.
              </p>
            </div>
          ) : (
            <>
              {savedProperties.map(property => {
                const convertedPrice = Math.round(property.price * currencyRate);
                return (
                  <div key={property.id} className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/40 flex items-center gap-3 relative group">
                    <img src={property.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-primary line-clamp-1">{property.title}</h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1">{property.location}</p>
                      <div className="text-xs font-extrabold text-secondary mt-1">
                        {currencySymbol}{convertedPrice.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">/ night</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => { onSelectProperty(property); onClose(); }}
                        className="text-[11px] font-bold bg-secondary text-white px-3 py-1.5 rounded-lg hover:bg-secondary-container transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onToggleWishlist(property.id)}
                        className="text-[10px] font-bold text-error hover:underline text-center"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {savedDestinations.map(dest => (
                <div key={dest.id} className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/40 flex items-center gap-3">
                  <img src={dest.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-primary line-clamp-1">{dest.name}</h4>
                    <p className="text-[11px] text-on-surface-variant">{dest.stays} • ★ {dest.rating}</p>
                  </div>
                  <button 
                    onClick={() => onToggleWishlist(dest.id)}
                    className="text-[10px] font-bold text-error hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
