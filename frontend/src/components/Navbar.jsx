import React, { useState, useRef, useEffect } from 'react';
import { CURRENCIES, LANGUAGES } from '../data/mockData';

export default function Navbar({
  currentView,
  setCurrentView,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenAuth,
  selectedCurrency,
  setSelectedCurrency,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  user,
  onLogout,
  onOpenMyBookings
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  const langRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit && onSearchSubmit();
    }
  };

  const userRole = user?.role || user?.Role;
  const isStaff = userRole === 'HotelStaff' || userRole === 2;
  const isOwner = userRole === 'HotelOwner' || userRole === 3 || userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;
  const isAdmin = userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;

  const getUserInitials = (u) => {
    if (!u) return 'U';
    const first = (u.firstName || u.FirstName || u.name || u.email || 'U').toString().trim();
    const last = (u.lastName || u.LastName || '').toString().trim();
    const fChar = (first && first.toLowerCase() !== 'undefined') ? first[0].toUpperCase() : 'U';
    const lChar = (last && last.toLowerCase() !== 'undefined') ? last[0].toUpperCase() : '';
    return (fChar + lChar).slice(0, 2) || 'U';
  };

  const getUserFullName = (u) => {
    if (!u) return 'Traveler';
    const first = (u.firstName || u.FirstName || u.name || '').toString().trim();
    const last = (u.lastName || u.LastName || '').toString().trim();
    const cleanFirst = (first && first.toLowerCase() !== 'undefined') ? first : '';
    const cleanLast = (last && last.toLowerCase() !== 'undefined') ? last : '';
    const name = `${cleanFirst} ${cleanLast}`.trim();
    return name || u.email || 'Traveler';
  };

  return (
    <header className="relative z-50 w-full bg-[#0a2540] transition-all">
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-1 group cursor-pointer focus:outline-none"
          >
            <span className="font-black text-2xl md:text-3xl tracking-tighter leading-none font-inter select-none">
              <span className="text-[#FF385C]">s</span>
              <span className="text-[#38bdf8]">t</span>
              <span className="text-[#FABB05]">a</span>
              <span className="text-[#FF385C]">y</span>
              <span className="text-[#38bdf8]">s</span>
              <span className="text-[#FABB05]">p</span>
              <span className="text-[#FF385C]">h</span>
              <span className="text-[#38bdf8]">e</span>
              <span className="text-[#FABB05]">r</span>
              <span className="text-[#38bdf8]">e</span>
            </span>
          </button>

          {/* World-Standard Travel Platform Category Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            <button
              onClick={() => setCurrentView("search")}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${currentView === 'search' || currentView === 'home'
                  ? 'text-white bg-white/15 border border-white/20 shadow-sm'
                  : 'text-sky-100/90 hover:text-white hover:bg-white/10'
                }`}
            >
              <span className="material-symbols-outlined text-base">bed</span>
              <span>Stays</span>
            </button>

            <button
              onClick={() => alert("✈️ Flights Booking Feature - Connecting to SriLankan Airlines & Global Carriers!")}
              className="px-3 py-1.5 text-xs font-bold text-sky-100/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">flight</span>
              <span>Flights</span>
            </button>

            <button
              onClick={() => alert("🚗 Car Rental & Chauffeur Services across Sri Lanka!")}
              className="px-3 py-1.5 text-xs font-bold text-sky-100/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 hidden lg:flex"
            >
              <span className="material-symbols-outlined text-base">directions_car</span>
              <span>Car Rentals</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("home");
                setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="px-3 py-1.5 text-xs font-bold text-sky-100/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 hidden xl:flex"
            >
              <span className="material-symbols-outlined text-base">attractions</span>
              <span>Attractions</span>
            </button>

            <button
              onClick={() => alert("🚖 Airport Taxi & BIA Transfer Direct Booking")}
              className="px-3 py-1.5 text-xs font-bold text-sky-100/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 hidden xl:flex"
            >
              <span className="material-symbols-outlined text-base">local_taxi</span>
              <span>Airport Taxis</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("home");
                setTimeout(() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="px-3 py-1.5 text-xs font-bold text-sky-100/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>Destinations</span>
            </button>

            <button
              onClick={() => {
                if (isOwner) setCurrentView("owner-dashboard");
                else onOpenAuth();
              }}
              className="px-2.5 py-1 text-xs font-bold text-white hover:text-sky-300 underline underline-offset-4 decoration-sky-400 hover:decoration-sky-300 transition-all cursor-pointer ml-1 whitespace-nowrap"
            >
              List Your Property
            </button>
          </nav>

          {/* Quick Header Search Bar - Only show when NOT on home view */}
          {currentView !== 'home' && (
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-[#0058bc] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0058bc]/10 transition-all shadow-inner w-64">
              <span className="material-symbols-outlined text-gray-400 text-xl mr-2">search</span>
              <input
                type="text"
                placeholder="Search destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent border-none outline-none text-xs font-semibold text-gray-800 w-full placeholder-gray-400"
              />
              <button
                onClick={() => onSearchSubmit && onSearchSubmit()}
                className="text-[11px] font-bold bg-[#0058bc] hover:bg-[#003580] text-[#FFFFFF] px-3 py-1 rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
              >
                Go
              </button>
            </div>
          )}
        </div>

        {/* Right Utilities (Language/Currency, Sign In, Menu Button) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">

          {/* Language & Currency Merged Selector */}
          <div className="relative shrink-0" ref={langRef}>
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowMenuDropdown(false);
              }}
              className="px-2 py-1.5 text-sky-100/90 hover:text-white rounded-lg hover:bg-blue-900/50 transition-colors flex items-center gap-1 cursor-pointer font-bold text-xs uppercase whitespace-nowrap"
              title="Change Language & Currency"
            >
              <span className="material-symbols-outlined text-lg">language</span>
              <span>{(selectedLang?.code || 'EN').toUpperCase()} · {typeof selectedCurrency === 'object' ? (selectedCurrency?.code || selectedCurrency?.symbol || 'LKR') : (selectedCurrency || 'LKR')}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0a244d] rounded-2xl shadow-2xl border border-blue-800/60 p-4 z-50 animate-fadeIn grid grid-cols-2 gap-4 text-white">
                <div>
                  <div className="px-1 pb-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider">Language</div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-blue-900/50 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedLang.code === lang.code ? 'text-white font-bold bg-blue-800/40' : 'text-sky-100/90'
                        }`}
                    >
                      <span>{lang.name}</span>
                      {selectedLang.code === lang.code && <span className="material-symbols-outlined text-xs text-sky-300">check</span>}
                    </button>
                  ))}
                </div>
                <div className="border-l border-blue-900/60 pl-3">
                  <div className="px-1 pb-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider">Currency</div>
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-blue-900/50 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedCurrency.code === curr.code ? 'text-white font-bold bg-blue-800/40' : 'text-sky-100/90'
                        }`}
                    >
                      <span>{curr.code} ({curr.symbol})</span>
                      {selectedCurrency.code === curr.code && <span className="material-symbols-outlined text-xs text-sky-300">check</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign In Button / User Avatar */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 text-sky-100/90 hover:text-white font-bold text-xs rounded-lg hover:bg-blue-900/50 transition-colors flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              <span className="hidden sm:inline">Sign in</span>
            </button>
          ) : (
            <div className="flex items-center shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0058bc] to-[#FF385C] text-white flex items-center justify-center font-extrabold text-xs shadow-sm cursor-pointer select-none shrink-0 overflow-hidden"
                onClick={() => {
                  setShowMenuDropdown(!showMenuDropdown);
                  setShowLangDropdown(false);
                }}
                title={`${getUserFullName(user)} Profile`}
              >
                {getUserInitials(user)}
              </div>
            </div>
          )}

          {/* Menu Hamburger Button */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => {
                setShowMenuDropdown(!showMenuDropdown);
                setShowLangDropdown(false);
              }}
              className="bg-blue-900/50 hover:bg-blue-900/80 text-sky-100 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
              <span>Menu</span>
            </button>

            {/* Menu Dropdown Menu */}
            {showMenuDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn text-left">
                {/* User Info & Role Badge Section */}
                {user && (
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2.5 mb-1 bg-gray-50/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-extrabold text-xs shrink-0 overflow-hidden">
                        {getUserInitials(user)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-gray-800 truncate">
                          {getUserFullName(user)}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate font-semibold">{user.email || user.Email || ''}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${isAdmin ? "bg-sky-100 text-sky-900" :
                      isOwner ? "bg-cyan-100 text-cyan-900" :
                        isStaff ? "bg-sky-50 text-sky-800" : "bg-sky-100 text-sky-800"
                      }`}>
                      {userRole === 'SuperAdmin' || userRole === 5 ? "SuperAdmin" :
                        userRole === 'Admin' || userRole === 4 ? "Admin" :
                          userRole === 'HotelOwner' || userRole === 3 ? "Partner" :
                            userRole === 'HotelStaff' || userRole === 2 ? "Staff" : "Traveler"}
                    </span>
                  </div>
                )}

                {/* Menu Real Items */}
                <button
                  onClick={() => { setCurrentView("home"); setShowMenuDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'home' ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-gray-700'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg text-[#0284c7]">home</span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => { setCurrentView("search"); setShowMenuDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'search' ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-gray-700'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg text-[#00b4d8]">hotel</span>
                  <span>Explore Stays & Resorts</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView("home");
                    setShowMenuDropdown(false);
                    setTimeout(() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg text-[#0284c7]">location_on</span>
                  <span>Trending Destinations</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView("home");
                    setShowMenuDropdown(false);
                    setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg text-[#00b4d8]">auto_awesome</span>
                  <span>Featured Collections</span>
                </button>

                <button
                  onClick={() => { onOpenWishlist(); setShowMenuDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-[#0284c7]">favorite</span>
                    <span>Saved Stays</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-[#0284c7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {user && (
                  <button
                    onClick={() => {
                      onOpenMyBookings && onOpenMyBookings();
                      setShowMenuDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-[#0284c7]">confirmation_number</span>
                    <span>My Stay Reservations</span>
                  </button>
                )}

                <div className="w-full h-px bg-gray-100 my-1.5" />

                {/* Role-Restricted Portals */}
                {isOwner ? (
                  <button
                    onClick={() => {
                      setCurrentView("owner-dashboard");
                      setShowMenuDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'owner-dashboard' ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-[#0284c7]'}`}
                  >
                    <span className="material-symbols-outlined text-lg text-[#0284c7]">domain_add</span>
                    <span>Hotel Owner Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenuDropdown(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0284c7] hover:bg-sky-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-[#0284c7]">add_business</span>
                    <span>List Hotel (Partner Login)</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setCurrentView("admin-panel");
                      setShowMenuDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'admin-panel' ? 'text-[#0284c7] font-bold bg-sky-50' : 'text-[#0284c7]'}`}
                  >
                    <span className="material-symbols-outlined text-lg text-[#0284c7]">admin_panel_settings</span>
                    <span>{userRole === 'SuperAdmin' || userRole === 5 ? "Super Admin Control Center" : "Admin Control Panel"}</span>
                  </button>
                )}

                <div className="w-full h-px bg-gray-100 my-1.5" />

                {user ? (
                  <button
                    onClick={() => { onLogout(); setShowMenuDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenAuth(); setShowMenuDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0284c7] hover:bg-sky-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
