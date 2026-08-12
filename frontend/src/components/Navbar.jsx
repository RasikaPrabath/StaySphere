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
  onLogout
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
  const isOwner = userRole === 'HotelOwner' || userRole === 3 || userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;
  const isAdmin = userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs transition-all">
      <div className="max-w-container-max mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo (Trivago-like colorful styling) */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-1 group cursor-pointer focus:outline-none"
          >
            <span className="font-black text-2xl md:text-3xl tracking-tighter leading-none font-inter select-none">
              <span className="text-[#FF385C]">s</span>
              <span className="text-[#0058bc]">t</span>
              <span className="text-[#FABB05]">a</span>
              <span className="text-[#FF385C]">y</span>
              <span className="text-[#0058bc]">s</span>
              <span className="text-[#FABB05]">p</span>
              <span className="text-[#FF385C]">h</span>
              <span className="text-[#0058bc]">e</span>
              <span className="text-[#FABB05]">r</span>
              <span className="text-[#0058bc]">e</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            <button
              onClick={() => setCurrentView("search")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${currentView === 'search' ? 'text-[#0058bc] bg-[#0058bc]/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Stays & Resorts
            </button>
            <button
              onClick={() => {
                setCurrentView("home");
                setTimeout(() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Destinations
            </button>
            <button
              onClick={() => {
                if (isOwner) setCurrentView("owner-dashboard");
                else onOpenAuth();
              }}
              className="px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            >
              List Your Property
            </button>
          </nav>

          {/* Quick Header Search Bar - Only show when NOT on home view */}
          {currentView !== 'home' && (
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-secondary focus-within:bg-white focus-within:ring-2 focus-within:ring-secondary/10 transition-all shadow-inner w-64">
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

        {/* Right Utilities (Trivago Style: Language/Currency, Sign In, Menu Button) */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Language & Currency Merged Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowMenuDropdown(false);
              }}
              className="px-2 py-1.5 text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer font-bold text-xs uppercase"
              title="Change Language & Currency"
            >
              <span className="material-symbols-outlined text-lg">language</span>
              <span>{selectedLang.code} · {selectedCurrency.symbol || selectedCurrency.code}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-fadeIn grid grid-cols-2 gap-4">
                <div>
                  <div className="px-1 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Language</div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedLang.code === lang.code ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-700'
                        }`}
                    >
                      <span>{lang.name}</span>
                      {selectedLang.code === lang.code && <span className="material-symbols-outlined text-xs text-[#0058bc]">check</span>}
                    </button>
                  ))}
                </div>
                <div className="border-l border-gray-100 pl-3">
                  <div className="px-1 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currency</div>
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedCurrency.code === curr.code ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-700'
                        }`}
                    >
                      <span>{curr.code} ({curr.symbol})</span>
                      {selectedCurrency.code === curr.code && <span className="material-symbols-outlined text-xs text-[#0058bc]">check</span>}
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
              className="px-2.5 py-1.5 text-gray-700 hover:text-black font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              <span className="hidden sm:inline">Sign in</span>
            </button>
          ) : (
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0058bc] to-[#FF385C] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer select-none"
                onClick={() => {
                  setShowMenuDropdown(!showMenuDropdown);
                  setShowLangDropdown(false);
                }}
                title={`${user.firstName || user.FirstName || 'User'} Profile`}
              >
                {((user.firstName || user.FirstName || 'U')[0] + (user.lastName || user.LastName || '')[0] || 'U').toUpperCase()}
              </div>
            </div>
          )}

          {/* Menu Hamburger Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setShowMenuDropdown(!showMenuDropdown);
                setShowLangDropdown(false);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-transparent active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
              <span>Menu</span>
            </button>

            {/* Menu Dropdown Menu */}
            {showMenuDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn text-left">
                {/* User Info Section */}
                {user && (
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 mb-1 bg-gray-50/50">
                    <div className="w-8 h-8 rounded-lg bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold text-xs shrink-0">
                      {((user.firstName || user.FirstName || 'U')[0]).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-gray-800 truncate">
                        {user.firstName || user.FirstName || ''} {user.lastName || user.LastName || ''}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate font-semibold">{user.email || user.Email}</span>
                    </div>
                  </div>
                )}

                {/* Menu Real Items */}
                <button
                  onClick={() => { setCurrentView("home"); setShowMenuDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'home' ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-700'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg text-[#0058bc]">home</span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => { setCurrentView("search"); setShowMenuDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'search' ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-700'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg text-emerald-600">hotel</span>
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
                  <span className="material-symbols-outlined text-lg text-rose-500">location_on</span>
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
                  <span className="material-symbols-outlined text-lg text-amber-500">auto_awesome</span>
                  <span>Featured Collections</span>
                </button>

                <button
                  onClick={() => { onOpenWishlist(); setShowMenuDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-[#FF385C]">favorite</span>
                    <span>Saved Stays</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-[#FF385C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentView("home");
                    setShowMenuDropdown(false);
                    setTimeout(() => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg text-indigo-500">verified</span>
                  <span>Why StaySphere</span>
                </button>

                <div className="w-full h-px bg-gray-100 my-1.5" />

                {/* Property Owner Action */}
                <button
                  onClick={() => {
                    setShowMenuDropdown(false);
                    if (isOwner) {
                      setCurrentView("owner-dashboard");
                    } else if (!user) {
                      onOpenAuth();
                    } else {
                      setCurrentView("owner-dashboard");
                    }
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'owner-dashboard' ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-800 font-bold'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg text-purple-600">domain_add</span>
                  <span>List Your Hotel / Property</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => { setCurrentView("admin-panel"); setShowMenuDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer ${currentView === 'admin-panel' ? 'text-[#0058bc] font-bold bg-[#0058bc]/5' : 'text-gray-700'
                      }`}
                  >
                    <span className="material-symbols-outlined text-lg text-blue-600">verified_user</span>
                    <span>Admin Control Center</span>
                  </button>
                )}

                <div className="w-full h-px bg-gray-100 my-1.5" />

                {user ? (
                  <button
                    onClick={() => { onLogout(); setShowMenuDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#D4111E] hover:bg-[#D4111E]/5 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenAuth(); setShowMenuDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0058bc] hover:bg-[#0058bc]/5 transition-colors flex items-center gap-2.5 cursor-pointer"
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
