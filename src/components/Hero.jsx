import React, { useState } from 'react';
import { TRENDING_DESTINATIONS } from '../data/mockData';

export default function Hero({ 
  locationQuery, 
  setLocationQuery, 
  checkInDate, 
  setCheckInDate, 
  checkOutDate, 
  setCheckOutDate, 
  guests, 
  setGuests, 
  onSearchSubmit 
}) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredLocations = TRENDING_DESTINATIONS.filter(item => 
    item.name.toLowerCase().includes((locationQuery || '').toLowerCase()) ||
    item.country.toLowerCase().includes((locationQuery || '').toLowerCase())
  );

  const totalGuests = guests.adults + guests.children;

  return (
    <section className="relative w-full h-[640px] md:h-[780px] flex items-center justify-center px-4 md:px-12 overflow-hidden select-none">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="bg-cover bg-center w-full h-full transform scale-105 transition-transform duration-1000 ease-out" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80 mix-blend-multiply" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1150px] mx-auto text-center flex flex-col items-center mt-6">
        <span className="inline-flex items-center gap-2 bg-surface-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-6 border border-white/30 shadow-sm animate-pulse">
          <span className="material-symbols-outlined text-rating-gold text-base">star</span> Exquisite Stays Worldwide
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-[56px] leading-[1.1] font-extrabold text-surface-white mb-6 drop-shadow-lg max-w-4xl tracking-tight">
          Discover Your Next Extraordinary Stay
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-medium text-surface-white/95 mb-10 max-w-2xl drop-shadow">
          Book luxury villas, beachfront retreats, boutique hotels, and unique spaces for an unforgettable experience.
        </p>

        {/* Search Widget - Glassmorphism Container */}
        <div className="w-full glassmorphism rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row items-center gap-2 relative border border-white/40">
          
          {/* Location Input & Autocomplete */}
          <div className="flex-1 w-full relative">
            <div 
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center bg-surface-white/95 rounded-xl px-4 py-3.5 hover:bg-surface-white transition-all cursor-pointer border border-transparent focus-within:border-secondary shadow-sm"
            >
              <span className="material-symbols-outlined text-primary mr-3 text-2xl" data-icon="location_on">location_on</span>
              <div className="flex flex-col text-left w-full">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer">Location</label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={locationQuery}
                  onChange={(e) => { setLocationQuery(e.target.value); setShowLocationDropdown(true); }}
                  onFocus={() => setShowLocationDropdown(true)}
                  className="bg-transparent border-none outline-none p-0 focus:ring-0 text-sm font-bold text-on-surface placeholder-on-surface-variant/70 w-full"
                />
              </div>
            </div>

            {/* Location Autocomplete Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-white rounded-2xl shadow-2xl border border-outline-variant py-2 z-50 max-h-64 overflow-y-auto text-left animate-fadeIn">
                <div className="px-4 py-2 text-[10px] font-extrabold uppercase text-outline tracking-wider border-b border-surface-container">
                  Popular Destinations
                </div>
                {filteredLocations.map(dest => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => { setLocationQuery(dest.name); setShowLocationDropdown(false); }}
                    className="w-full px-4 py-3 hover:bg-surface-container transition-colors flex items-center gap-3 border-b border-surface-container-low last:border-none"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${dest.image})` }} />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-primary">{dest.name}</span>
                      <span className="text-xs text-on-surface-variant">{dest.stays} • ★ {dest.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-[1px] h-[1px] md:h-12 bg-outline-variant/30 hidden md:block mx-0.5" />

          {/* Dates Input Picker */}
          <div className="flex-1 w-full relative">
            <div 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center bg-surface-white/95 rounded-xl px-4 py-3.5 hover:bg-surface-white transition-all cursor-pointer border border-transparent focus-within:border-secondary shadow-sm"
            >
              <span className="material-symbols-outlined text-primary mr-3 text-2xl" data-icon="calendar_month">calendar_month</span>
              <div className="flex flex-col text-left w-full">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer">Check In - Out</label>
                <span className="text-sm font-bold text-on-surface">
                  {checkInDate && checkOutDate ? `${checkInDate} to ${checkOutDate}` : "Select dates"}
                </span>
              </div>
            </div>

            {/* Quick Date Range Selector */}
            {showDatePicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-white rounded-2xl shadow-2xl border border-outline-variant p-4 z-50 animate-fadeIn text-left min-w-[280px]">
                <div className="text-xs font-bold text-primary mb-3">Select Stay Dates</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold text-outline uppercase block mb-1">Check In</label>
                    <input 
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full border border-outline-variant rounded-lg p-2 text-xs font-semibold focus:ring-secondary focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-outline uppercase block mb-1">Check Out</label>
                    <input 
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full border border-outline-variant rounded-lg p-2 text-xs font-semibold focus:ring-secondary focus:border-secondary outline-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setShowDatePicker(false)}
                  className="w-full bg-secondary text-white text-xs font-bold py-2 rounded-lg hover:bg-secondary-container transition-colors"
                >
                  Apply Dates
                </button>
              </div>
            )}
          </div>

          <div className="w-full md:w-[1px] h-[1px] md:h-12 bg-outline-variant/30 hidden md:block mx-0.5" />

          {/* Guest Count Selector */}
          <div className="flex-1 w-full relative">
            <div 
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="flex items-center bg-surface-white/95 rounded-xl px-4 py-3.5 hover:bg-surface-white transition-all cursor-pointer border border-transparent focus-within:border-secondary shadow-sm"
            >
              <span className="material-symbols-outlined text-primary mr-3 text-2xl" data-icon="group">group</span>
              <div className="flex flex-col text-left w-full">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer">Guests</label>
                <span className="text-sm font-bold text-on-surface">
                  {totalGuests} guest{totalGuests > 1 ? 's' : ''}, {guests.rooms} room{guests.rooms > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Guest Popover Counter */}
            {showGuestPicker && (
              <div className="absolute top-full right-0 mt-2 bg-surface-white rounded-2xl shadow-2xl border border-outline-variant p-4 z-50 w-72 animate-fadeIn text-left">
                <div className="flex justify-between items-center py-2 border-b border-surface-container">
                  <div>
                    <div className="text-xs font-bold text-primary">Adults</div>
                    <div className="text-[10px] text-on-surface-variant">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.adults}</span>
                    <button 
                      onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-surface-container">
                  <div>
                    <div className="text-xs font-bold text-primary">Children</div>
                    <div className="text-[10px] text-on-surface-variant">Ages 0-12</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.children}</span>
                    <button 
                      onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 mb-3">
                  <div>
                    <div className="text-xs font-bold text-primary">Rooms</div>
                    <div className="text-[10px] text-on-surface-variant">Private suites</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.rooms}</span>
                    <button 
                      onClick={() => setGuests(g => ({ ...g, rooms: g.rooms + 1 }))}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center font-bold text-primary hover:bg-surface-container"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full bg-secondary text-white text-xs font-bold py-2 rounded-xl hover:bg-secondary-container transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Submit Search Button */}
          <button 
            type="button"
            onClick={() => {
              setShowLocationDropdown(false);
              setShowDatePicker(false);
              setShowGuestPicker(false);
              onSearchSubmit && onSearchSubmit();
            }}
            className="w-full md:w-auto bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl md:rounded-2xl px-8 py-4 transition-all shadow-xl hover:shadow-2xl h-full flex items-center justify-center min-h-[58px] active:scale-95 shrink-0 gap-2"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            <span>Search</span>
          </button>

        </div>
      </div>
    </section>
  );
}
