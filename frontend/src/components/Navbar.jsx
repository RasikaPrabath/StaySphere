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
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langRef = useRef(null);
  const currRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
      if (currRef.current && !currRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
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

  const navLinks = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'search', label: 'Search Stays', icon: 'search' },
    { id: 'detail', label: 'Property View', icon: 'domain' },
    { id: 'checkout', label: 'Checkout', icon: 'shopping_bag' },
    { id: 'owner-dashboard', label: 'Owner Portal', icon: 'space_dashboard' },
    { id: 'admin-panel', label: 'Super Admin', icon: 'verified_user' },
  ];

  const userRole = user?.role || user?.Role;
  const isOwner = userRole === 'HotelOwner' || userRole === 3 || userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;
  const isAdmin = userRole === 'Admin' || userRole === 4 || userRole === 'SuperAdmin' || userRole === 5;

  const filteredLinks = navLinks.filter((link) => {
    if (link.id === 'owner-dashboard') return isOwner;
    if (link.id === 'admin-panel') return isAdmin;
    if (link.id === 'checkout') return !!user;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-container-max mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Search */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-2xl tracking-tight text-primary leading-none">StaySphere</span>
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase mt-0.5">Luxury Living</span>
            </div>
          </button>

          {/* Quick Header Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-secondary focus-within:bg-white focus-within:ring-2 focus-within:ring-secondary/10 transition-all shadow-inner w-72">
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
              className="text-[11px] font-bold bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
            >
              Go
            </button>
          </div>
        </div>

        {/* Center / Right Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {filteredLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-secondary bg-secondary/10 font-extrabold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100/80'
                }`}
              >
                <span className={`material-symbols-outlined text-base ${isActive ? 'text-secondary' : 'text-gray-400'}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-secondary rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Utilities (Lang, Currency, Wishlist, Login) */}
        <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-4">
          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => { setShowLangDropdown(!showLangDropdown); setShowCurrencyDropdown(false); }}
              className="p-2 text-gray-600 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Change Language"
            >
              <span className="material-symbols-outlined text-lg">language</span>
              <span className="text-xs font-bold uppercase">{selectedLang.code}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Language</div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang); setShowLangDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${
                      selectedLang.code === lang.code ? 'text-secondary font-bold bg-secondary/5' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {selectedLang.code === lang.code && <span className="material-symbols-outlined text-sm text-secondary">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className="relative" ref={currRef}>
            <button
              onClick={() => { setShowCurrencyDropdown(!showCurrencyDropdown); setShowLangDropdown(false); }}
              className="p-2 text-gray-600 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Change Currency"
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              <span className="text-xs font-bold">{selectedCurrency.code}</span>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Currency</div>
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => { setSelectedCurrency(curr); setShowCurrencyDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCurrency.code === curr.code ? 'text-secondary font-bold bg-secondary/5' : 'text-gray-700'
                    }`}
                  >
                    <span>{curr.label} ({curr.symbol})</span>
                    {selectedCurrency.code === curr.code && <span className="material-symbols-outlined text-sm text-secondary">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-600 hover:text-error rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            title="Saved Stays"
          >
            <span className="material-symbols-outlined text-xl">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-error text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Auth/Profile */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="ml-2 font-bold text-xs bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">account_circle</span>
              Sign In
            </button>
          ) : (
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowLangDropdown(false);
                  setShowCurrencyDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                {/* User Avatar Circle */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary to-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {((user.firstName || user.FirstName || 'U')[0] + (user.lastName || user.LastName || '')[0] || 'U').toUpperCase()}
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3.5 z-50 animate-fadeIn">
                  {/* Profile Header */}
                  <div className="px-4 pb-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-base">
                      {((user.firstName || user.FirstName || 'U')[0]).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-gray-800 truncate">
                        {user.firstName || user.FirstName || ''} {user.lastName || user.LastName || ''}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate font-semibold">{user.email || user.Email}</span>
                    </div>
                  </div>

                  {/* Role Badge Section */}
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Role</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isAdmin 
                        ? 'bg-error/10 text-error' 
                        : isOwner 
                          ? 'bg-tertiary-fixed-dim/20 text-secondary' 
                          : 'bg-primary/10 text-primary'
                    }`}>
                      {isAdmin ? 'Super Admin' : isOwner ? 'Hotel Owner' : 'Customer'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-gray-100 my-1"></div>

                  {/* Profile Dropdown Actions */}
                  {isOwner && (
                    <button
                      onClick={() => {
                        setCurrentView('owner-dashboard');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-gray-400">space_dashboard</span>
                      <span>Owner Portal</span>
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setCurrentView('admin-panel');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base text-gray-400">verified_user</span>
                      <span>Admin Panel</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error/5 transition-colors flex items-center gap-2.5 cursor-pointer mt-1"
                  >
                    <span className="material-symbols-outlined text-base text-error">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-6 flex flex-col gap-3 shadow-2xl animate-fadeIn">
          {/* Mobile Search */}
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 mb-2">
            <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Search destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchSubmit && onSearchSubmit();
                  setMobileMenuOpen(false);
                }
              }}
              className="bg-transparent text-xs font-semibold outline-none w-full"
            />
            <button
              onClick={() => {
                onSearchSubmit && onSearchSubmit();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-secondary ml-2"
            >
              Search
            </button>
          </div>

          {filteredLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setCurrentView(link.id); setMobileMenuOpen(false); }}
                className={`text-left text-sm font-bold py-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  isActive ? 'bg-secondary/10 text-secondary font-extrabold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {isActive && <span className="material-symbols-outlined text-sm text-secondary">chevron_right</span>}
              </button>
            );
          })}

          <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
            <button
              onClick={() => { onOpenWishlist(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between text-sm font-bold text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">favorite</span>
                <span>Saved Stays</span>
              </div>
              <span className="bg-error text-white text-xs px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>
            </button>

            {!user ? (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold shadow-md text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Sign In / Register
              </button>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-primary text-white flex items-center justify-center font-bold text-sm">
                    {((user.firstName || user.FirstName || 'U')[0]).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-gray-800 truncate">
                      {user.firstName || user.FirstName || ''} {user.lastName || user.LastName || ''}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate font-semibold">{user.email || user.Email}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100/50 pt-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Role</span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAdmin 
                      ? 'bg-error/10 text-error' 
                      : isOwner 
                        ? 'bg-tertiary-fixed-dim/20 text-secondary' 
                        : 'bg-primary/10 text-primary'
                  }`}>
                    {isAdmin ? 'Super Admin' : isOwner ? 'Hotel Owner' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-1.5 border border-error/20 text-error hover:bg-error/5 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
