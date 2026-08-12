import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import TrendingDestinations from './components/TrendingDestinations';
import PropertyGrid from './components/PropertyGrid';
import SearchResults from './components/SearchResults';
import PropertyDetailView from './components/PropertyDetailView';
import BookingCheckout from './components/BookingCheckout';
import OwnerDashboard from './components/OwnerDashboard';
import AdminPanel from './components/AdminPanel';
import PropertyModal from './components/PropertyModal';
import BookingModal from './components/BookingModal';
import WishlistDrawer from './components/WishlistDrawer';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { CURRENCIES, PROPERTIES } from './data/mockData';

export default function App() {
  // Navigation View State: 'home' | 'search' | 'detail'
  const [currentView, setCurrentView] = useState("home");

  // Search state
  const [searchQuery, setSearchQuery] = useState("Colombo, Sri Lanka");
  const [locationQuery, setLocationQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("2026-10-12");
  const [checkOutDate, setCheckOutDate] = useState("2026-10-15");
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState("");

  // Detailed selected property
  const [activePropertyDetail, setActivePropertyDetail] = useState(null);

  // Modals state
  const [selectedPropertyModal, setSelectedPropertyModal] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // App settings & wishlist
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [wishlist, setWishlist] = useState(["prop-colombo-1", "prop-grand-horizon"]);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Wishlist toggle
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      addToast("Removed from saved stays");
    } else {
      setWishlist([...wishlist, id]);
      addToast("Saved to your wishlist!");
    }
  };

  // Search submit trigger
  const handleSearchSubmit = (overrideLocation) => {
    if (overrideLocation) {
      setLocationQuery(overrideLocation);
      setSearchQuery(overrideLocation);
    }
    setCurrentView("search");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Property detail select
  const handleSelectProperty = (property) => {
    setActivePropertyDetail(property);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const defaultProperty = PROPERTIES.find(p => p.id === "prop-grand-horizon") || PROPERTIES[0];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col selection:bg-secondary-fixed selection:text-primary">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => handleSearchSubmit()}
      />

      {/* Main View Router */}
      <main className="flex-grow w-full">
        {currentView === "checkout" ? (
          <BookingCheckout
            bookingDetails={bookingDetails}
            onBack={() => setCurrentView("detail")}
            selectedCurrency={selectedCurrency}
            onConfirmBooking={(property, ref) => {
              addToast(`Reservation ${ref} confirmed!`);
            }}
            onAddToast={addToast}
          />
        ) : currentView === "admin-panel" ? (
          <AdminPanel
            onBack={() => setCurrentView("home")}
            onAddToast={addToast}
          />
        ) : currentView === "owner-dashboard" ? (
          <OwnerDashboard
            onBack={() => setCurrentView("home")}
            onAddProperty={() => {
              setSelectedPropertyModal({});
              addToast("Owner Property Editor opened");
            }}
          />
        ) : currentView === "search" ? (
          <SearchResults
            searchQuery={searchQuery || locationQuery}
            onSelectProperty={handleSelectProperty}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            selectedCurrency={selectedCurrency}
          />
        ) : currentView === "detail" ? (
          <PropertyDetailView
            property={activePropertyDetail || defaultProperty}
            onBack={() => setCurrentView("search")}
            selectedCurrency={selectedCurrency}
            onBookProperty={(property, details) => setBookingDetails({ property, ...details })}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToast={addToast}
          />
        ) : (
          /* Home View */
          <>
            <Hero
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              guests={guests}
              setGuests={setGuests}
              onSearchSubmit={() => handleSearchSubmit(locationQuery || searchQuery)}
            />

            <FeaturedCollections
              activeCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentView("search");
              }}
            />

            <TrendingDestinations
              selectedDestination={selectedDestination}
              onSelectDestination={(destName) => {
                setSelectedDestination(destName);
                handleSearchSubmit(destName);
              }}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />

            <PropertyGrid
              selectedCategory={selectedCategory}
              locationQuery={locationQuery}
              selectedDestination={selectedDestination}
              selectedCurrency={selectedCurrency}
              onSelectProperty={handleSelectProperty}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />

            <WhyUs />
            <Testimonials onAddToast={addToast} />
            <Newsletter onAddToast={addToast} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick Preview Modal */}
      {selectedPropertyModal && (
        <PropertyModal
          property={selectedPropertyModal}
          onClose={() => setSelectedPropertyModal(null)}
          selectedCurrency={selectedCurrency}
          onBookProperty={(property, details) => {
            setSelectedPropertyModal(null);
            setBookingDetails({ property, ...details });
          }}
        />
      )}

      {/* Booking Checkout Modal */}
      {bookingDetails && (
        <BookingModal
          bookingDetails={bookingDetails}
          onClose={() => setBookingDetails(null)}
          selectedCurrency={selectedCurrency}
          onConfirmBooking={(property, ref) => {
            addToast(`Reservation confirmed for ${property.title}! Ref: ${ref}`);
          }}
        />
      )}

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onSelectProperty={handleSelectProperty}
        selectedCurrency={selectedCurrency}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userName) => {
          setUser(userName);
          addToast(`Welcome back, ${userName}!`);
        }}
      />

      {/* Notification Toast */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
