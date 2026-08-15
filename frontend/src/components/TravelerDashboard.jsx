import React, { useState, useEffect } from 'react';
import { aiApi, bookingApi } from '../data/api';

export default function TravelerDashboard({
  user,
  onBack,
  userBookings = [],
  wishlist = [],
  onToggleWishlist,
  selectedCurrency,
  onAddToast,
  allProperties = []
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: `Ayubowan ${user?.firstName || 'Valued Guest'}! I am your StaySphere Virtual Concierge. How can I assist you with your travels in Sri Lanka today?` }
  ]);

  
  // Profile Form States
  const [profileName, setProfileName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [profilePhone, setProfilePhone] = useState(user?.phoneNumber || "0771234567");
  const [profilePref, setProfilePref] = useState("Ocean View, High Floors");

  const [backendBookings, setBackendBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const data = await bookingApi.getMyBookings();
        const mapped = data.map(b => ({
          id: b.id,
          reference: b.bookingReference,
          propertyName: b.propertyName || "Luxury Hotel Stay",
          roomType: b.roomType || "Standard Room",
          city: b.city || "Sri Lanka",
          image: b.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          checkIn: b.checkInDate?.split('T')[0] || "2026-10-12",
          checkOut: b.checkOutDate?.split('T')[0] || "2026-10-15",
          guests: `${b.guestCount} Guests`,
          totalPrice: b.totalAmount,
          status: b.status.toString(),
          bookedOn: b.createdAtUtc?.split('T')[0] || "2026-08-15"
        }));
        setBackendBookings(mapped);
      } catch (err) {
        console.warn("Failed to load user bookings from backend, using fallback mocks", err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  // Mock Bookings list fallback
  const displayBookings = backendBookings.length > 0 ? backendBookings : (userBookings.length > 0 ? userBookings : [
    {
      id: "bk-982145",
      reference: "STAY-982145",
      propertyName: "The Grand Horizon Resort & Spa",
      roomType: "Deluxe Ocean View Suite",
      city: "Colombo, Sri Lanka",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      checkIn: "2026-10-12",
      checkOut: "2026-10-15",
      guests: "2 Adults, 1 Room",
      totalPrice: 480.00,
      status: "Confirmed",
      bookedOn: "2026-08-10"
    },
    {
      id: "bk-661204",
      reference: "STAY-661204",
      propertyName: "Ceylon Tea Trails Chalet",
      roomType: "Heritage Garden Suite",
      city: "Ella, Sri Lanka",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
      checkIn: "2026-06-12",
      checkOut: "2026-06-15",
      guests: "2 Adults",
      totalPrice: 390.00,
      status: "Completed",
      bookedOn: "2026-06-01"
    }
  ]);

  // Resolve properties in wishlist
  const resolvedWishlist = allProperties.length > 0
    ? allProperties.filter(p => wishlist.includes(p.id))
    : [
        {
          id: "prop-colombo-1",
          title: "The Grand Horizon Resort",
          location: "Colombo, Sri Lanka",
          price: 280,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "prop-grand-horizon",
          title: "Urban Oasis Boutique Villa",
          location: "Galle, Sri Lanka",
          price: 320,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
        }
      ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");

    try {
      const response = await aiApi.chatWithAssistant(currentInput);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.message,
        suggestedHotels: response.suggestedHotels || []
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("AI Chat API failed, using fallback simulated chatbot responses", err);
      // Simple auto-replies for virtual assistant
      setTimeout(() => {
        let replyText = "I have received your request. Our support team will get in touch shortly.";
        const lower = currentInput.toLowerCase();
        if (lower.includes("airport") || lower.includes("pickup") || lower.includes("cab") || lower.includes("taxi")) {
          replyText = "🚖 Sure! We can arrange an airport pickup from Bandaranaike International Airport (BIA). Standard luxury sedan transfer to Colombo is $40 USD. Would you like me to book it for your upcoming stay?";
        } else if (lower.includes("cancel") || lower.includes("refund")) {
          replyText = "📅 Cancellation policies vary by hotel. For your active booking (STAY-982145), you can cancel for free up to 48 hours prior to check-in. Please select 'Cancel Stay' or contact our support.";
        } else if (lower.includes("wifi") || lower.includes("internet")) {
          replyText = "📶 All StaySphere premium resorts offer high-speed, complimentary Wi-Fi in guest rooms and common areas.";
        } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("ayubowan")) {
          replyText = "Hello! I can help you with airport transfers, local guides, checking your booking status, or hotel amenities. What would you like to know?";
        }
        setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: replyText }]);
      }, 800);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onAddToast && onAddToast("Profile settings updated successfully!");
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans flex h-screen overflow-hidden w-full">
      
      {/* Sidebar Navigation */}
      <nav className={`fixed md:static left-0 top-0 h-full w-64 border-r border-slate-200 bg-white z-30 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-2xl font-black text-[#0058bc] flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#0058bc] text-white flex items-center justify-center font-bold text-base">s</div>
              <span>staySphere</span>
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:text-slate-900 cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0058bc] to-[#0284c7] text-white flex items-center justify-center font-extrabold text-sm shadow-sm select-none shrink-0">
              {(user?.firstName || 'U')[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-slate-800 truncate">
                {user?.firstName || 'Traveler'} {user?.lastName || ''}
              </span>
              <span className="text-[10px] text-slate-400 font-bold truncate">Silver Explorer Rank</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col gap-1 px-4 mt-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: 'dashboard' },
            { id: 'bookings', label: 'My Reservations', icon: 'luggage' },
            { id: 'wishlist', label: 'Saved Wishlist', icon: 'favorite' },
            { id: 'concierge', label: 'Virtual Concierge', icon: 'chat_bubble' },
            { id: 'profile', label: 'Profile Settings', icon: 'manage_accounts' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'text-[#0058bc] bg-blue-50/70 border-l-4 border-[#0058bc]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Back and Action */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <button
            onClick={onBack}
            className="w-full py-3 bg-[#0058bc] hover:bg-[#003580] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Book Another Stay
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc] min-w-0">
        
        {/* Top Header */}
        <header className="bg-white w-full border-b border-slate-200 shadow-sm z-10 sticky top-0 flex justify-between items-center px-6 h-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[#0058bc] p-2 -ml-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden md:block capitalize">
              {activeTab === 'overview' ? 'Traveler Dashboard' : activeTab === 'bookings' ? 'Your Reservations & Bookings' : activeTab === 'wishlist' ? 'Saved Wishlist stays' : activeTab === 'concierge' ? 'AI Concierge Support' : 'Edit Account Details'}
            </h2>
            <h1 className="text-base font-bold text-[#0058bc] md:hidden">Guest Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              ⭐ 450 Points
            </span>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-grow overflow-y-auto p-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-[#0058bc] to-[#0284c7] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <h3 className="text-xl md:text-2xl font-black font-inter">Ayubowan, {user?.firstName || 'Traveler'}!</h3>
                  <p className="text-xs md:text-sm text-sky-100 font-medium max-w-xl">
                    Welcome back to your luxury travel space. You have one upcoming trip to Colombo next week. Check details or contact concierge below!
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
                  <span className="material-symbols-outlined text-[200px]">flight_takeoff</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0058bc] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">luggage</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked Stays</span>
                    <h4 className="text-xl font-bold text-slate-800">{displayBookings.length} Trips</h4>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">favorite</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wishlisted Hotels</span>
                    <h4 className="text-xl font-bold text-slate-800">{wishlist.length} Saved</h4>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">military_tech</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loyalty Rank</span>
                    <h4 className="text-xl font-bold text-slate-800">Silver Tier</h4>
                  </div>
                </div>
              </div>

              {/* Recent Bookings & Concierge Quick panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Booking highlight */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-800">Upcoming Reservation</h4>
                    <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#0058bc] font-bold hover:underline cursor-pointer">View All</button>
                  </div>
                  {displayBookings.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={displayBookings[0].image}
                          alt="hotel"
                          className="w-20 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{displayBookings[0].propertyName}</h5>
                          <p className="text-[11px] text-slate-400 font-semibold">{displayBookings[0].roomType}</p>
                          <p className="text-[11px] text-slate-500 font-bold mt-0.5">{displayBookings[0].checkIn} → {displayBookings[0].checkOut}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-400">Ref: {displayBookings[0].reference}</span>
                        <span className="font-extrabold text-[#0058bc]">{displayBookings[0].status}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Concierge assistant */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[230px]">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h4 className="font-bold text-sm text-slate-800">Virtual Assistant Concierge</h4>
                    </div>
                    <button onClick={() => setActiveTab('concierge')} className="text-xs text-[#0058bc] font-bold hover:underline cursor-pointer">Full Chat</button>
                  </div>
                  <div className="flex-1 py-3 text-xs text-slate-600 font-medium overflow-y-auto">
                    💬 "Need help arranging airport luxury cars, local tour guides or cancellations? Ask me right away!"
                  </div>
                  <button
                    onClick={() => setActiveTab('concierge')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs text-[#0058bc] rounded-xl transition-all cursor-pointer text-center"
                  >
                    Open Virtual Assistant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MY BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 max-w-4xl">
              {displayBookings.map((bk) => (
                <div key={bk.id} className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row gap-5">
                  <div
                    className="w-full md:w-48 h-36 rounded-2xl bg-cover bg-center shrink-0 shadow-inner"
                    style={{ backgroundImage: `url(${bk.image})` }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                          ID: {bk.reference}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${bk.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-700'}`}>
                          {bk.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-800">{bk.propertyName}</h4>
                      <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-sm text-slate-400">location_on</span>
                        {bk.city} • {bk.roomType}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-sm text-slate-400">calendar_month</span>
                          {bk.checkIn} → {bk.checkOut}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-slate-500">{bk.guests}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-base text-slate-800">
                          ${bk.totalPrice?.toFixed(2)}
                        </span>
                        <button
                          onClick={() => onAddToast && onAddToast(`Stay Voucher ${bk.reference} PDF successfully saved!`)}
                          className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#0058bc] font-bold text-xs hover:bg-[#0058bc] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">download</span>
                          <span>Voucher</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="max-w-5xl">
              {resolvedWishlist.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto">
                  <span className="material-symbols-outlined text-slate-300 text-6xl">favorite_border</span>
                  <h4 className="font-extrabold text-slate-800">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-500 font-medium">Find properties you love and click the heart icon to save them here for your next luxury Sri Lanka tour.</p>
                  <button onClick={onBack} className="px-5 py-2.5 bg-[#0058bc] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#003580] transition-colors cursor-pointer">Explore Stays</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resolvedWishlist.map((prop) => (
                    <div key={prop.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div
                        className="w-full h-44 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${prop.image})` }}
                      >
                        <button
                          onClick={() => onToggleWishlist && onToggleWishlist(prop.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-pink-600 flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        >
                          <span className="material-symbols-outlined text-lg font-bold">favorite</span>
                        </button>
                      </div>
                      <div className="p-4 space-y-2 flex-grow">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#0058bc] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{prop.location}</span>
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">⭐ {prop.rating || 4.8}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 truncate">{prop.title}</h4>
                      </div>
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs shrink-0">
                        <span className="font-semibold text-slate-500">From <span className="font-black text-slate-800">${prop.price}</span> / night</span>
                        <span className="text-[#0058bc] font-bold hover:underline cursor-pointer">View Hotel</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI CONCIERGE TAB */}
          {activeTab === 'concierge' && (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[550px] max-w-3xl mx-auto overflow-hidden">
              {/* Chat Header */}
              <div className="bg-[#0a2540] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#38bdf8] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold font-inter text-white">Virtual StaySphere Concierge</h4>
                    <p className="text-[10px] text-sky-200 font-medium">Online • Instantly responsive</p>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0058bc] text-white rounded-tr-none'
                        : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-sm'
                    }`}>
                      <div>{msg.text}</div>
                      {msg.suggestedHotels && msg.suggestedHotels.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-2">
                          <p className="font-extrabold text-[10px] text-secondary uppercase tracking-wider">Recommendations:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.suggestedHotels.map(hotel => (
                              <div key={hotel.id} className="flex gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                <img src={hotel.imageUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80"} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                <div className="min-w-0 flex-1 text-left">
                                  <h5 className="font-bold text-[11px] text-slate-800 truncate">{hotel.name}</h5>
                                  <p className="text-[10px] text-slate-400 truncate">{hotel.city}, {hotel.country}</p>
                                  <p className="text-[10px] font-extrabold text-primary">From ${hotel.minRoomPrice || 120} / night</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 shrink-0 bg-white">
                <input
                  type="text"
                  placeholder="Ask about airport transfers, amenities, local tours..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#0058bc] text-white flex items-center justify-center hover:bg-[#003580] transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            </div>
          )}

          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-2xl mx-auto shadow-sm">
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "customer@staysphere.com"}
                    className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-xl p-3 text-xs font-semibold outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stay Preferences</label>
                  <textarea
                    value={profilePref}
                    onChange={e => setProfilePref(e.target.value)}
                    rows="3"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
                    placeholder="e.g. Non-smoking rooms, vegan meals..."
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#0058bc] hover:bg-[#003580] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
