import React, { useState } from 'react';

export default function PropertyDetailView({
  property,
  onBack,
  selectedCurrency,
  onBookProperty,
  wishlist = [],
  onToggleWishlist,
  onAddToast
}) {
  const [selectedRoom, setSelectedRoom] = useState("deluxe");
  const [checkIn, setCheckIn] = useState("2026-10-12");
  const [checkOut, setCheckOut] = useState("2026-10-15");
  const [guestsCount, setGuestsCount] = useState("2 Adults, 0 Children");
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!property) return null;

  const isFavorited = wishlist.includes(property.id);
  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  const pricePerNight = Math.round((property.price || 450) * currencyRate);
  const nights = 3;
  const subtotal = pricePerNight * nights;
  const taxes = Math.round((property.taxes || 37.5) * nights * currencyRate);
  const totalEstimated = subtotal + taxes;

  const bentoPhotos = property.images && property.images.length >= 5 ? property.images : [
    property.images?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBzuBT4w39PhqaHsbEPn5zORMTij84gG4as8fS8T-rKDVKkAk4Ys8gLbyiK-40NmdBgogWjgcEbhKR0hYYm14C5IlF-oC6RWN-rFCXYLFty2XkiQ5gYhpvwwaFnSwiom_MDKXN6amweO4zxCl1b0MYJcuPEvw8bIIpTQ3foRJvlTn5xAYSGZQbB7sMYvDhxBpbHdYSp17KuADFFP_1myQpWqsVhSBgsc4YsX2DL1p_faXpMi7BtfoKg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2URQSBmTS3bK8n4ayXiGvkZzFgaFGvtYFDBMpyGgyWb6DI0jDjj8L4_RYF7zyHHl2v0l9GctomFmXcw3ioiuogNK-YaBJu3e1UM-x_L7JlOG6FkXMvgTdXFYKVobeTqf2G7ULGnftrq7pEqchkgVMjoUNoqgPs6w5wyFoR10i0NJ8BwYz0NugshjHxslVRwaAAwN8zTcxzQqxzdXa8aC2u4g1RDcKZm4iaHS8JsUo0PtlDWBbvNhN",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBdPq31Tk5MaUOKsOjD_B-oIXk9xiujhy1L8EA6u4wJI4N8TisbwXUEhn4bWWqlQ7XtA27n44A5N-bemr9fhmr-MZ6j95Iec7uV_su_y2XJlFR99r4SgIorAq3rfEcy7RTfH8HrbKvIZN7wC5PopAQVbxTIVMFCrHQyki_6lE1QiV59lGK3pPTvqqkLJvNm862D48UHAwYmWSa3o_jWruvxmVs6c-17Q75_SvoJZy7kLsNjAN5D0mwQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAshafKJ4LbWfreQvf2x0RcCO9l2vdW-FRkdl991I3qULcYfC3ens5oN1YCOzbozM1XKgPN8p4hktIzBk-AfmRWysFQiswr0BpGRRzcrwSJhDhqiGkDqzuXey5OjbDmGefpYKreX1hLp-LjjicBqqk0pAr1CK92Ufev_hzQpzV61zXzbBbQHoYNYaEjv5MBsOU4rhxGUY6f_Wh1ThnyVxVecdVqwfY_dKQEuBl_QfBNjlV3SB08B0X7",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDc0uAWKucD6p6bObbBnAsrrFdImmlPvNsQYZiRf2xoI5As2LXxIfa-u4PX-v1F-HJbrMYeRazQ605_L9hui6lLJAuhH0_V63DhNjAhw2Fd90Z7jRNBT6gPdBudigAyxzs2-PgiuypullD8XO_5J9djj16XtTm50ysPT98XV4ciFHVx8_eGEjm0nir7QEfFncORSrHbkLs4Qfuds5ixqvX0gE-tlkKx6VZWcmE8_AYaxIk32635Mtzf"
  ];

  const handleReserve = () => {
    if (onBookProperty) {
      onBookProperty(property, { nights, totalEstimated, checkIn, checkOut });
    } else {
      if (onAddToast) onAddToast("Proceeding to checkout...");
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
      {/* Top Navigation / Back */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 bg-surface-white px-3 py-1.5 rounded-xl border border-outline-variant shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to search results</span>
        </button>
        <span className="text-xs font-semibold text-on-surface-variant">StaySphere Exclusive Listing</span>
      </div>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rating-gold text-on-primary-fixed px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-sm">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {property.rating || 4.9}
            </span>
            <span className="text-body-sm font-body-sm text-on-surface-variant font-medium">
              {property.badge || "Top rated property"} ({property.reviewsCount || 124} reviews)
            </span>
          </div>

          <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl-mobile md:font-headline-xl text-primary font-bold mb-2">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <p>{property.location}</p>
            <button
              onClick={() => onAddToast && onAddToast("Map view focused")}
              className="text-secondary font-label-sm hover:underline ml-2 font-semibold cursor-pointer"
            >
              View on map
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAddToast && onAddToast("Listing link copied to clipboard!")}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-full text-label-md font-label-md hover:bg-surface-container-low transition-colors text-primary font-bold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined">ios_share</span>
            Share
          </button>

          <button
            onClick={() => onToggleWishlist && onToggleWishlist(property.id)}
            className={`flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-full text-label-md font-label-md transition-colors shadow-sm cursor-pointer ${
              isFavorited ? 'bg-error text-white border-error font-bold' : 'text-primary hover:bg-surface-container-low font-bold'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            {isFavorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      {/* Bento Grid Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 mb-8 h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 md:row-span-2 h-full relative group overflow-hidden bg-surface-container-high">
          <img
            src={bentoPhotos[0]}
            alt="Main property view"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="hidden md:block col-span-1 row-span-1 h-full overflow-hidden bg-surface-container-high">
          <img
            src={bentoPhotos[1]}
            alt="Ensuite bathroom"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="hidden md:block col-span-1 row-span-1 h-full overflow-hidden rounded-tr-xl bg-surface-container-high">
          <img
            src={bentoPhotos[2]}
            alt="Lounge area"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="hidden md:block col-span-1 row-span-1 h-full overflow-hidden bg-surface-container-high">
          <img
            src={bentoPhotos[3]}
            alt="Private balcony view"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div
          onClick={() => setShowAllPhotos(true)}
          className="hidden md:block col-span-1 row-span-1 h-full overflow-hidden relative rounded-br-xl group cursor-pointer bg-surface-container-high"
        >
          <img
            src={bentoPhotos[4]}
            alt="Infinity pool area"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <span className="text-on-primary font-label-md text-label-md flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">grid_view</span>
              Show all 32 photos
            </span>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary font-bold mb-4">About this property</h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-4">
              {property.description || "Experience unparalleled luxury at The Grand Horizon Suite, where modern elegance meets coastal serenity. Nestled along the pristine shores of Monterey, this premium accommodation offers panoramic ocean views, meticulous design, and world-class amenities tailored for the discerning traveler."}
            </p>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              Whether you are seeking a tranquil retreat or a high-efficiency base for corporate engagements, our property provides a sophisticated sanctuary. Enjoy direct beach access, a state-of-the-art wellness center, and bespoke concierge services designed to elevate your stay.
            </p>
          </section>

          {/* Popular Amenities */}
          <section>
            <h2 className="text-headline-sm font-headline-sm text-primary font-bold mb-4">Popular Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {(property.amenities || ["Free High-Speed WiFi", "Infinity Pool", "24/7 Gym", "Valet Parking", "On-site Dining"]).map((am, i) => {
                let icon = "check";
                const lower = am.toLowerCase();
                if (lower.includes("wifi")) icon = "wifi";
                else if (lower.includes("pool")) icon = "pool";
                else if (lower.includes("gym") || lower.includes("fitness")) icon = "fitness_center";
                else if (lower.includes("parking")) icon = "local_parking";
                else if (lower.includes("dining") || lower.includes("restaurant")) icon = "restaurant";
                else if (lower.includes("spa")) icon = "spa";

                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/30 font-medium">
                    <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span> {am}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Room Availability Section */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary font-bold mb-6">Availability</h2>
            <div className="bg-surface-white border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,53,128,0.04)]">
              {/* Date Picker Bar */}
              <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">Check-in - Check-out</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">calendar_month</span>
                    <input
                      type="text"
                      readOnly
                      value="Oct 12 - Oct 15"
                      className="w-full pl-10 pr-4 py-2 bg-surface-white border border-outline-variant rounded-md text-body-md font-medium outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">Guests</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full sm:w-48 pl-10 pr-8 py-2 bg-surface-white border border-outline-variant rounded-md text-body-md font-medium outline-none cursor-pointer"
                    >
                      <option>2 Adults, 0 Children</option>
                      <option>1 Adult, 0 Children</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => onAddToast && onAddToast("Dates & guest availability updated")}
                  className="w-full sm:w-auto px-6 py-2 bg-primary-container text-on-primary font-label-md rounded-md hover:bg-primary transition-colors h-[42px] font-bold cursor-pointer"
                >
                  Update
                </button>
              </div>

              {/* Room Types List */}
              <div className="divide-y divide-outline-variant/50">
                {/* Room 1 */}
                <div className="p-4 flex flex-col md:flex-row gap-4 hover:bg-surface-bright transition-colors">
                  <div className="w-full md:w-1/3">
                    <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-1">Oceanfront Deluxe</h3>
                    <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant mb-2">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">king_bed</span> 1 King</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">straighten</span> 450 sq ft</span>
                    </div>
                    <p className="text-label-sm font-label-sm text-success flex items-center gap-1 mb-2 font-bold">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Free cancellation before Oct 10
                    </p>
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col justify-center border-l-0 md:border-l border-outline-variant/50 md:pl-4">
                    <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded inline-block w-fit font-medium">Max 2 guests</span>
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col justify-end items-start md:items-end border-t md:border-t-0 border-outline-variant/50 pt-4 md:pt-0">
                    <div className="text-right mb-2 w-full md:w-auto flex md:block justify-between items-end">
                      <span className="text-label-sm font-label-sm text-on-surface-variant line-through block md:inline">{currencySymbol}{Math.round(520 * currencyRate)}</span>
                      <span className="text-headline-md font-headline-md text-primary font-bold">{currencySymbol}{pricePerNight} <span className="text-body-sm font-body-sm text-on-surface-variant font-normal">/night</span></span>
                    </div>
                    <button
                      onClick={() => { setSelectedRoom("deluxe"); handleReserve(); }}
                      className="w-full md:w-auto px-6 py-2 border-2 border-primary-container text-primary-container font-label-md rounded hover:bg-surface-container-low transition-colors font-bold cursor-pointer"
                    >
                      Select Room
                    </button>
                  </div>
                </div>

                {/* Room 2 */}
                <div className="p-4 flex flex-col md:flex-row gap-4 hover:bg-surface-bright transition-colors bg-inverse-on-surface/30">
                  <div className="w-full md:w-1/3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-1">Horizon Suite</h3>
                      <span className="bg-secondary-fixed-dim text-on-primary-fixed text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">Popular</span>
                    </div>
                    <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant mb-2">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">king_bed</span> 1 King</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">weekend</span> Living Area</span>
                    </div>
                    <p className="text-label-sm font-label-sm text-success flex items-center gap-1 mb-2 font-bold">
                      <span className="material-symbols-outlined text-[16px]">free_breakfast</span> Breakfast Included
                    </p>
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col justify-center border-l-0 md:border-l border-outline-variant/50 md:pl-4">
                    <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded inline-block w-fit font-medium">Max 3 guests</span>
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col justify-end items-start md:items-end border-t md:border-t-0 border-outline-variant/50 pt-4 md:pt-0">
                    <div className="text-right mb-2 w-full md:w-auto flex md:block justify-between items-end">
                      <span className="text-headline-md font-headline-md text-primary font-extrabold">{currencySymbol}{Math.round(890 * currencyRate)} <span className="text-body-sm font-body-sm text-on-surface-variant font-normal">/night</span></span>
                    </div>
                    <button
                      onClick={() => { setSelectedRoom("horizon"); handleReserve(); }}
                      className="w-full md:w-auto px-6 py-2 bg-secondary-container text-on-primary font-label-md rounded hover:bg-secondary transition-colors font-bold cursor-pointer"
                    >
                      Select Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Sentiment Summary & Guest Reviews */}
          <section className="pt-8 border-t border-outline-variant">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline-md font-headline-md text-primary font-bold">Guest Reviews</h2>
              <button onClick={() => onAddToast && onAddToast("Displaying all verified reviews")} className="text-secondary font-label-md hover:underline font-bold">
                Read all {property.reviewsCount || 124} reviews
              </button>
            </div>

            {/* AI Summary Banner */}
            <div className="bg-surface-container-low rounded-xl p-5 mb-8 border border-outline-variant/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <div>
                  <h3 className="text-label-md font-label-md text-primary font-bold">AI-Powered Review Summary</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Based on 124 reviews in the last 6 months.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-surface-white border border-success/30 text-success rounded-full text-label-sm font-label-sm flex items-center gap-1 shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">thumb_up</span> Spotless Rooms (98%)
                </span>
                <span className="px-3 py-1 bg-surface-white border border-success/30 text-success rounded-full text-label-sm font-label-sm flex items-center gap-1 shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">thumb_up</span> Great Views (92%)
                </span>
                <span className="px-3 py-1 bg-surface-white border border-outline-variant text-on-surface-variant rounded-full text-label-sm font-label-sm flex items-center gap-1 shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">info</span> Valet Busy Peak Hours
                </span>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-surface-white p-5 rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">S</div>
                    <div>
                      <p className="font-label-md text-primary font-bold">Sarah Jenkins</p>
                      <p className="text-label-sm text-on-surface-variant">Stayed Sept 2026</p>
                    </div>
                  </div>
                  <div className="bg-primary-container text-on-primary px-2.5 py-1 rounded text-label-sm font-bold">9.8</div>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  "Absolutely stunning property. The views from the Horizon Suite were breathtaking. The staff was incredibly attentive without being intrusive."
                </p>
              </div>

              <div className="space-y-3 bg-surface-white p-5 rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-tint text-on-primary flex items-center justify-center font-bold text-sm">M</div>
                    <div>
                      <p className="font-label-md text-primary font-bold">Michael T.</p>
                      <p className="text-label-sm text-on-surface-variant">Stayed Aug 2026</p>
                    </div>
                  </div>
                  <div className="bg-primary-container text-on-primary px-2.5 py-1 rounded text-label-sm font-bold">9.0</div>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  "The facilities are top-notch, especially the fitness center and pool area. Location is perfect for exploring the coastal region."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-white border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,53,128,0.04)]">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-headline-lg font-headline-lg text-primary font-extrabold">{currencySymbol}{pricePerNight}</span>
                <span className="text-body-md text-on-surface-variant">/ night</span>
              </div>

              <div className="border border-outline-variant rounded-lg mb-4 overflow-hidden flex divide-x divide-outline-variant">
                <div className="flex-1 p-3 bg-surface-container-lowest">
                  <p className="text-label-sm text-on-surface-variant uppercase font-bold mb-0.5">Check-in</p>
                  <p className="font-label-md text-primary font-bold">Oct 12, 2026</p>
                </div>
                <div className="flex-1 p-3 bg-surface-container-lowest">
                  <p className="text-label-sm text-on-surface-variant uppercase font-bold mb-0.5">Check-out</p>
                  <p className="font-label-md text-primary font-bold">Oct 15, 2026</p>
                </div>
              </div>

              <button
                onClick={handleReserve}
                className="w-full py-3.5 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg font-label-md transition-colors text-center mb-3 font-bold cursor-pointer shadow-md active:scale-95"
              >
                Reserve Now
              </button>
              <p className="text-label-sm text-center text-on-surface-variant">You won't be charged yet</p>
            </div>

            {/* Map Snippet */}
            <div className="bg-surface-white border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,53,128,0.04)]">
              <div className="h-48 w-full bg-surface-container-low relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoG-evZEsmuuQYkcyK1hKXzqJynTt7mW1jAl44XtCgzcQ13VaMWZ5h_ujZLJAKv4WYHhFAknEAKk0Xflz5PkAPVcbZ2CggMdnaovekVvL7Mp7ucqSOVBqunymN9Dl9f1B6gA1MfmkhfPPQBIkPEBQR1Fxe-D5qmqzwPjegJBaf_lQ5QdZ8jAltEsD7xhw61LC7HYM72ATzzRS3eY_GziSmwIOUETXX8ihfgs9YkkD9qq3dhQIqHIo3"
                  alt="Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <div className="text-on-primary">
                    <p className="font-label-md font-bold">{property.location}</p>
                    <button onClick={() => onAddToast && onAddToast("Exploring neighborhood...")} className="text-label-sm hover:underline text-inverse-primary font-semibold cursor-pointer">
                      Explore neighborhood
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-surface-white border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,53,128,0.04)]">
              <h3 className="font-headline-sm text-primary font-bold mb-4">Property Highlights</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">beach_access</span>
                  <div>
                    <p className="font-label-md text-primary font-bold">Private Beach Access</p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Direct path to secluded sands.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">spa</span>
                  <div>
                    <p className="font-label-md text-primary font-bold">Award-Winning Spa</p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Full service wellness treatments.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">local_bar</span>
                  <div>
                    <p className="font-label-md text-primary font-bold">Rooftop Lounge</p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">Craft cocktails with sunset views.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
