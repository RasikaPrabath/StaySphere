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
    <section className="relative z-30 w-full bg-gradient-to-b from-[#0a2540] via-[#0f3460] to-[#143e70] pt-6 pb-16 md:pt-8 md:pb-20 flex items-center justify-center px-3 md:px-4 select-none transition-all duration-500 overflow-visible">

      {/* Subtle Geometric Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none overflow-hidden" />

      {/* Ultra-soft Luminous Ambient Glow (No Harsh Glare) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto text-center flex flex-col items-center">

        {/* Main StaySphere Titles */}
        <h1
          className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] leading-tight font-semibold text-slate-100 mb-3 max-w-5xl tracking-tight"
          style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif" }}
        >
          Find & Book Premium <span className="text-white font-bold">Luxury Hotels</span> in Sri Lanka
        </h1>

        <p
          className="text-xs sm:text-sm font-medium text-slate-400 mb-6 max-w-xl leading-relaxed"
          style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif" }}
        >
          Direct hotel reservations, handpicked boutique villas, and luxury beach resorts with StaySphere.
        </p>

        {/* Search Widget - Clean Borderless Container */}
        <div className="w-full bg-white rounded-2xl md:rounded-full p-2 shadow-[0_20px_60px_rgba(0,10,30,0.4)] hover:shadow-[0_25px_70px_rgba(0,10,30,0.5)] transition-all flex flex-col md:flex-row items-stretch gap-1 relative z-40 border-none outline-none">

          {/* Destination Segment */}
          <div className="flex-[1.6] min-w-0 relative flex items-center pl-5 pr-4 py-3 md:py-0 md:h-14 hover:bg-slate-50 rounded-xl md:rounded-l-full cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sky-600 mr-3 text-xl select-none">search</span>
            <div className="flex flex-col text-left w-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none">Hotel</label>
              <input
                type="text"
                placeholder="Destination, city or hotel in Sri Lanka..."
                value={locationQuery}
                onChange={(e) => { setLocationQuery(e.target.value); setShowLocationDropdown(true); }}
                onFocus={() => setShowLocationDropdown(true)}
                className="bg-transparent border-none outline-none p-0 focus:ring-0 text-sm font-bold text-slate-800 placeholder-slate-400 w-full truncate"
              />
            </div>

            {/* Destination Autocomplete Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-[105%] left-0 w-full md:w-96 bg-white rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto text-left animate-fadeIn border-none">
                <div className="px-4 py-2 text-[10px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-100">
                  Popular Destinations
                </div>
                {filteredLocations.map(dest => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => { setLocationQuery(dest.name); setShowLocationDropdown(false); }}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-none cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${dest.image})` }} />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-gray-800">{dest.name}</span>
                      <span className="text-xs text-gray-500">{dest.stays} • ★ {dest.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-[1px] h-[1px] md:h-8 bg-gray-200 self-center hidden md:block" />

          {/* Date Picker Segment */}
          <div
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowLocationDropdown(false);
              setShowGuestPicker(false);
            }}
            className="flex-1 min-w-0 relative flex items-center px-5 py-3.5 md:py-0 md:h-14 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sky-600 mr-3 text-xl select-none">calendar_month</span>
            <div className="flex flex-col text-left w-full select-none">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer">Check-in/out</label>
              <span className="text-sm font-bold text-slate-800 truncate">
                {checkInDate && checkOutDate ? `${checkInDate} to ${checkOutDate}` : "Select dates"}
              </span>
            </div>

            {/* Date Range Selector Dropdown */}
            {showDatePicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[105%] left-0 md:left-[10%] w-full md:w-80 bg-white rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-left border-none"
              >
                <div className="text-xs font-bold text-gray-800 mb-3">Select Stay Dates</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Check In</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full border-none bg-slate-100 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-[#0058bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Check Out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full border-none bg-slate-100 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-[#0058bc] outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-full bg-[#0058bc] hover:bg-[#003580] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer shadow-sm border-none outline-none"
                >
                  Apply Dates
                </button>
              </div>
            )}
          </div>

          <div className="w-full md:w-[1px] h-[1px] md:h-8 bg-gray-200 self-center hidden md:block" />

          {/* Guests and Rooms Segment */}
          <div
            onClick={() => {
              setShowGuestPicker(!showGuestPicker);
              setShowLocationDropdown(false);
              setShowDatePicker(false);
            }}
            className="flex-1 min-w-0 relative flex items-center px-5 py-3.5 md:py-0 md:h-14 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sky-600 mr-3 text-xl select-none">group</span>
            <div className="flex flex-col text-left w-full select-none">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer">Guests and rooms</label>
              <span className="text-sm font-bold text-slate-800 truncate">
                {totalGuests} guest{totalGuests > 1 ? 's' : ''}, {guests.rooms} room{guests.rooms > 1 ? 's' : ''}
              </span>
            </div>

            {/* Guest Popover Counter Dropdown */}
            {showGuestPicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[105%] right-0 w-full md:w-72 bg-white rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-left border-none"
              >
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="text-xs font-bold text-gray-800">Adults</div>
                    <div className="text-[10px] text-gray-400 font-medium">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.adults}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <div className="text-xs font-bold text-gray-800">Children</div>
                    <div className="text-[10px] text-gray-400 font-medium">Ages 0-12</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.children}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 mb-3">
                  <div>
                    <div className="text-xs font-bold text-gray-800">Rooms</div>
                    <div className="text-[10px] text-gray-400 font-medium">Private suites</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests.rooms}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(g => ({ ...g, rooms: g.rooms + 1 }))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full bg-[#0058bc] hover:bg-[#003580] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm border-none outline-none"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              setShowLocationDropdown(false);
              setShowDatePicker(false);
              setShowGuestPicker(false);
              onSearchSubmit && onSearchSubmit();
            }}
            className="w-full md:w-auto bg-[#0058bc] hover:bg-[#003580] text-white font-bold text-sm rounded-xl md:rounded-full px-8 py-3.5 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer font-inter select-none border-none outline-none"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span>Search</span>
          </button>

        </div>

        {/* Sleek Minimalist Typography Row */}
        <div className="mt-4 mb-2 relative z-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 select-none text-xs font-medium text-slate-200 font-inter">
          <span className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block shrink-0" />
            Verified Luxury Stays
          </span>
          <span className="text-slate-600 hidden sm:inline select-none">•</span>
          <span className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-sky-600 inline-block shrink-0" />
            Instant Direct Confirmation
          </span>
          <span className="text-slate-600 hidden sm:inline select-none">•</span>
          <span className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-amber-600 inline-block shrink-0" />
            Best Price Guarantee
          </span>
          <span className="text-slate-600 hidden sm:inline select-none">•</span>
          <span className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block shrink-0" />
            24/7 Concierge Support
          </span>
        </div>

      </div>

      {/* Multi-layered Elegant Ocean Wave Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          className="relative block w-full h-10 sm:h-12 md:h-14 lg:h-16 text-slate-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Ambient Luminous Cyan Crest Wave */}
          <path
            d="M0,15 C300,90 600,0 900,60 C1050,90 1150,30 1200,20 L1200,120 L0,120 Z"
            fill="rgba(56, 189, 248, 0.15)"
          />
          {/* Layer 2: Deep Ocean Royal Blue Wave Accent */}
          <path
            d="M0,32 C200,80 450,20 700,70 C950,110 1100,40 1200,50 L1200,120 L0,120 Z"
            fill="rgba(2, 132, 199, 0.25)"
          />
          {/* Layer 3: Main Smooth Bottom Foreground Wave matching page background */}
          <path
            d="M0,52 C180,95 380,30 550,72 C720,110 960,45 1200,65 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
