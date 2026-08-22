import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../data/api';
import AddPropertyModal from './AddPropertyModal';

export default function OwnerDashboard({ onBack, onNavigateToAddProperty }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await dashboardApi.getOwnerStats();
        setStats(data);
        if (data.recentBookings) {
          const mappedBookings = data.recentBookings.map(b => ({
            id: b.bookingReference,
            guest: b.guestName,
            property: b.propertyName,
            checkIn: new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            checkOut: new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            guests: 2,
            amount: `$${b.totalAmount}`,
            status: b.status
          }));
          setBookingsList(mappedBookings);
        }
      } catch (err) {
        console.warn("Failed to load owner stats from backend, using fallback mocks", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Mock data states
  const [hotelsList, setHotelsList] = useState([
    {
      id: "owner-prop-1",
      title: "The Grand Horizon Resort",
      location: "Colombo, Sri Lanka",
      occupancy: "92%",
      occColor: "bg-emerald-500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      revenue: "$64,200",
      rooms: "45 Rooms",
      price: "$280 / night",
      status: "Active"
    },
    {
      id: "owner-prop-2",
      title: "Urban Oasis Boutique Villa",
      location: "Galle, Sri Lanka",
      occupancy: "76%",
      occColor: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      revenue: "$42,800",
      rooms: "30 Rooms",
      price: "$320 / night",
      status: "Active"
    },
    {
      id: "owner-prop-3",
      title: "Alpine Crest Tea Sanctuary",
      location: "Ella, Sri Lanka",
      occupancy: "88%",
      occColor: "bg-emerald-500",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
      revenue: "$35,500",
      rooms: "25 Rooms",
      price: "$190 / night",
      status: "Active"
    }
  ]);

  const [bookingsList, setBookingsList] = useState([
    { id: "BK-9021", guest: "Kasun Perera", property: "The Grand Horizon Resort", checkIn: "Oct 15, 2026", checkOut: "Oct 18, 2026", guests: 2, amount: "$840", status: "Confirmed" },
    { id: "BK-8842", guest: "Elena Rostova", property: "Urban Oasis Villa", checkIn: "Oct 20, 2026", checkOut: "Oct 25, 2026", guests: 3, amount: "$1,600", status: "Pending" },
    { id: "BK-7721", guest: "David Miller", property: "Alpine Crest Sanctuary", checkIn: "Oct 12, 2026", checkOut: "Oct 14, 2026", guests: 1, amount: "$380", status: "Checked-In" },
    { id: "BK-6530", guest: "Nimali Fernando", property: "The Grand Horizon Resort", checkIn: "Nov 01, 2026", checkOut: "Nov 05, 2026", guests: 4, amount: "$1,120", status: "Confirmed" },
    { id: "BK-5412", guest: "James Wilson", property: "Urban Oasis Villa", checkIn: "Nov 10, 2026", checkOut: "Nov 12, 2026", guests: 2, amount: "$640", status: "Cancelled" }
  ]);

  const [staffList, setStaffList] = useState([
    { id: 1, name: "Sahan Wickramasinghe", role: "General Manager", hotel: "The Grand Horizon Resort", phone: "+94 77 123 4567", status: "Active" },
    { id: 2, name: "Dilini Jayawardena", role: "Front Desk Supervisor", hotel: "Urban Oasis Villa", phone: "+94 71 987 6543", status: "Active" },
    { id: 3, name: "Ruwan Kumara", role: "Head Housekeeper", hotel: "Alpine Crest Sanctuary", phone: "+94 75 456 7890", status: "Active" }
  ]);

  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Front Desk Agent");
  const [newStaffHotel, setNewStaffHotel] = useState("The Grand Horizon Resort");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const chartData = [
    { month: "Jan", amount: 80000, label: "$80,000", height: "40%" },
    { month: "Feb", amount: 110000, label: "$110,000", height: "55%" },
    { month: "Mar", amount: 140000, label: "$140,000", height: "70%" },
    { month: "Apr", amount: 130000, label: "$130,000", height: "65%" },
    { month: "May", amount: 170000, label: "$170,000", height: "85%" },
    { month: "Jun", amount: 142500, label: "$142,500", height: "75%", current: true }
  ];

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName) return;
    const newStaff = {
      id: Date.now(),
      name: newStaffName,
      role: newStaffRole,
      hotel: newStaffHotel,
      phone: "+94 77 000 0000",
      status: "Active"
    };
    setStaffList([...staffList, newStaff]);
    setNewStaffName("");
    setShowAddStaffModal(false);
  };

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="bg-background text-on-surface font-sans antialiased flex h-screen overflow-hidden w-full">
      {/* SideNavBar */}
      <nav className={`fixed md:static left-0 top-0 h-full w-64 border-r border-outline-variant bg-surface-white z-30 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1 group cursor-pointer focus:outline-none">
              <span className="font-black text-2xl tracking-tighter leading-none font-inter select-none">
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
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 pt-4 border-t border-outline-variant/40">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Owner headshot"
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-outline-variant shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface truncate font-bold">Property Partner</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold truncate">Hotel Owner Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-1.5 px-4 mt-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'hotels', label: 'My Hotels', icon: 'apartment' },
            { id: 'bookings', label: 'Guest Bookings', icon: 'calendar_month' },
            { id: 'revenue', label: 'Revenue & Payouts', icon: 'payments' },
            { id: 'staff', label: 'Staff Management', icon: 'group' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 font-label-md text-label-md rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold bg-primary-container/15 border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 mt-auto border-t border-outline-variant/30">
          <button
            onClick={() => onBack && onBack()}
            className="w-full py-2.5 bg-surface-container-high hover:bg-outline-variant/40 text-primary font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-2 mb-2 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Guest View
          </button>
          <button
            onClick={() => {
              if (onNavigateToAddProperty) onNavigateToAddProperty();
              else setShowAddPropertyModal(true);
            }}
            className="w-full py-3 bg-secondary text-white font-label-md text-label-md rounded-xl shadow-md hover:bg-secondary-container transition-colors font-bold cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span> Add New Hotel
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background min-w-0">
        {/* Top Header */}
        <header className="bg-surface-white w-full border-b border-outline-variant shadow-sm z-10 sticky top-0 flex justify-between items-center px-6 h-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-primary p-2 -ml-2 rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold text-primary hidden md:block capitalize">
              {activeTab === 'overview' ? 'Property Portfolio Overview' : activeTab === 'hotels' ? 'My Hotels & Estates' : activeTab === 'bookings' ? 'Guest Reservations' : activeTab === 'revenue' ? 'Revenue & Financial Payouts' : 'Staff & Team Management'}
            </h2>
            <h1 className="text-lg font-bold text-primary md:hidden">Owner Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setNotificationCount(0); }}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors relative rounded-full hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-white animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-white rounded-2xl shadow-xl border border-outline-variant p-4 z-50 animate-fadeIn">
                  <div className="flex justify-between items-center mb-3 border-b border-outline-variant/40 pb-2">
                    <h4 className="font-bold text-xs text-primary uppercase tracking-wider">Notifications</h4>
                    <span className="text-[11px] text-secondary font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 bg-surface-container-low rounded-xl flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg shrink-0">event_available</span>
                      <div>
                        <p className="font-bold text-on-surface">New Reservation</p>
                        <p className="text-on-surface-variant text-[11px]">The Grand Horizon Resort - 3 nights ($840)</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-surface-container-low rounded-xl flex gap-3">
                      <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">payments</span>
                      <div>
                        <p className="font-bold text-on-surface">Payout Processed</p>
                        <p className="text-on-surface-variant text-[11px]">$14,200 transferred to your bank account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Canvas Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-container-max mx-auto space-y-8 pb-12">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-white rounded-2xl p-6 border border-outline-variant/50 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <span className="flex items-center text-emerald-600 font-bold text-xs gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +14.2%
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Revenue (MTD)</h3>
                    <p className="text-2xl font-extrabold text-primary mt-1">
                      {stats ? `$${stats.totalRevenueEarned.toLocaleString()}` : "$142,500"}
                    </p>
                  </div>

                  <div className="bg-surface-white rounded-2xl p-6 border border-outline-variant/50 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                        <span className="material-symbols-outlined">bed</span>
                      </div>
                      <span className="flex items-center text-on-surface-variant font-bold text-xs gap-1 bg-surface-container px-2.5 py-1 rounded-full">
                        84% Capacity
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current Occupancy</h3>
                    <p className="text-2xl font-extrabold text-primary mt-1">
                      {stats ? `${stats.occupancyRate}%` : "84%"}
                    </p>
                    <div className="w-full h-2 bg-surface-container-high rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: stats ? `${stats.occupancyRate}%` : "84%" }}></div>
                    </div>
                  </div>

                  <div className="bg-surface-white rounded-2xl p-6 border border-outline-variant/50 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600">
                        <span className="material-symbols-outlined">event_available</span>
                      </div>
                      <span className="flex items-center text-emerald-600 font-bold text-xs gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +8.2%
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Bookings</h3>
                    <p className="text-2xl font-extrabold text-primary mt-1">
                      {stats ? `${stats.activeBookingsCount} Reservations` : "24 Reservations"}
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <section className="lg:col-span-2 bg-surface-white rounded-2xl border border-outline-variant/50 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base font-bold text-primary">Monthly Revenue Performance</h3>
                      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold px-3 py-1.5">
                        <option>Last 6 Months</option>
                        <option>This Year</option>
                      </select>
                    </div>

                    <div className="flex-1 min-h-[220px] relative flex items-end gap-4 pt-10">
                      <div className="flex-1 h-full flex items-end justify-between gap-3 pb-8 border-b border-outline-variant/30">
                        {chartData.map((bar, idx) => (
                          <div key={idx} className="relative w-full max-w-[48px] h-full flex flex-col justify-end group cursor-pointer">
                            <div style={{ height: bar.height }} className={`w-full rounded-t-lg transition-all ${bar.current ? 'bg-secondary' : 'bg-secondary/30 hover:bg-secondary/60'}`}>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow">
                                {bar.label}
                              </div>
                            </div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant">{bar.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface-white rounded-2xl border border-outline-variant/50 shadow-sm p-6 flex flex-col">
                    <h3 className="text-base font-bold text-primary mb-4">Active Hotels</h3>
                    <div className="space-y-4">
                      {hotelsList.map(prop => (
                        <div key={prop.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
                          <img src={prop.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-primary truncate">{prop.title}</h4>
                            <p className="text-[11px] text-on-surface-variant">{prop.location}</p>
                            <span className="text-[10px] font-extrabold text-emerald-600">{prop.occupancy} Occupancy</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            )}

            {/* MY HOTELS TAB */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Your Listed Hotels & Villas</h3>
                    <p className="text-xs text-on-surface-variant">Manage your property details, room pricing, and amenities.</p>
                  </div>
                  <button onClick={() => { if (onNavigateToAddProperty) onNavigateToAddProperty(); else setShowAddPropertyModal(true); }} className="bg-secondary text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow hover:bg-secondary-container cursor-pointer">
                    <span className="material-symbols-outlined text-base">add</span> Add New Hotel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hotelsList.map(hotel => (
                    <div key={hotel.id} className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-44 relative bg-surface-container">
                        <img src={hotel.image} alt={hotel.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 ${hotel.status === 'Active' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                          {hotel.status === 'Pending Verification' ? 'Under Review (24h)' : hotel.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="text-base font-bold text-primary mb-1">{hotel.title}</h4>
                        <p className="text-xs text-on-surface-variant mb-4 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                          {hotel.location}
                        </p>
                        {hotel.status === 'Pending Verification' && (
                          <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm text-amber-600 shrink-0 mt-0.5">verified_user</span>
                            <span>StaySphere compliance verification in progress. Admin approval pending.</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/50 text-xs">
                          <span className="font-bold text-primary">{hotel.price}</span>
                          <span className="text-on-surface-variant font-medium">{hotel.rooms}</span>
                        </div>
                        <button onClick={() => { if (onNavigateToAddProperty) onNavigateToAddProperty(); else setShowAddPropertyModal(true); }} className="w-full mt-4 py-2 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 text-xs font-bold transition-colors cursor-pointer">
                          Edit Property Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-primary">Guest Reservations</h3>
                  <p className="text-xs text-on-surface-variant">Review incoming reservations, check-in guests, or update booking status.</p>
                </div>

                <div className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Guest Name</th>
                          <th className="p-4">Property</th>
                          <th className="p-4">Check-In / Out</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40 text-xs font-medium">
                        {bookingsList.map(b => (
                          <tr key={b.id} className="hover:bg-surface-container-low/50">
                            <td className="p-4 font-bold text-primary">{b.id}</td>
                            <td className="p-4 font-bold text-on-surface">{b.guest}</td>
                            <td className="p-4 text-on-surface-variant">{b.property}</td>
                            <td className="p-4 text-on-surface-variant">{b.checkIn} - {b.checkOut}</td>
                            <td className="p-4 font-extrabold text-primary">{b.amount}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                                b.status === "Checked-In" ? "bg-blue-100 text-blue-800" :
                                b.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {b.status === "Pending" && (
                                <button onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")} className="text-xs font-bold text-emerald-600 hover:underline">Confirm</button>
                              )}
                              {b.status === "Confirmed" && (
                                <button onClick={() => handleUpdateBookingStatus(b.id, "Checked-In")} className="text-xs font-bold text-blue-600 hover:underline">Check-In</button>
                              )}
                              {b.status !== "Cancelled" && (
                                <button onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")} className="text-xs font-bold text-rose-600 hover:underline">Cancel</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* REVENUE TAB */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-primary">Financial Analytics & Payouts</h3>
                  <p className="text-xs text-on-surface-variant">Track your monthly earnings and direct bank payouts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Net Revenue (All Time)</span>
                    <p className="text-3xl font-extrabold text-primary mt-2">$674,800</p>
                    <span className="text-[11px] text-emerald-600 font-bold block mt-1">✓ 92% Payout Completed</span>
                  </div>
                  <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Next Payout (Oct 15)</span>
                    <p className="text-3xl font-extrabold text-secondary mt-2">$18,450</p>
                    <span className="text-[11px] text-on-surface-variant font-medium block mt-1">Commercial Bank of Ceylon (***4921)</span>
                  </div>
                  <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">StaySphere Platform Fee</span>
                    <p className="text-3xl font-extrabold text-primary mt-2">8.0%</p>
                    <span className="text-[11px] text-on-surface-variant font-medium block mt-1">Standard Partner Tier</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAFF MANAGEMENT TAB */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Hotel Staff & Team Members</h3>
                    <p className="text-xs text-on-surface-variant">Manage staff access and assign hotel roles.</p>
                  </div>
                  <button onClick={() => setShowAddStaffModal(true)} className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
                    <span className="material-symbols-outlined text-base">person_add</span> Add Team Member
                  </button>
                </div>

                {showAddStaffModal && (
                  <form onSubmit={handleAddStaff} className="bg-surface-white p-6 rounded-2xl border border-secondary/30 shadow-md space-y-4 max-w-lg">
                    <h4 className="font-bold text-primary text-base">Add New Staff Member</h4>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Full Name</label>
                      <input type="text" required value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="e.g. Kasun Fernando" className="w-full border border-outline-variant rounded-xl p-2.5 text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Assigned Role</label>
                      <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full border border-outline-variant rounded-xl p-2.5 text-xs font-semibold">
                        <option>General Manager</option>
                        <option>Front Desk Agent</option>
                        <option>Head Housekeeper</option>
                        <option>Executive Chef</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300">Cancel</button>
                      <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white">Save Staff</button>
                    </div>
                  </form>
                )}

                <div className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                  <div className="divide-y divide-outline-variant/40">
                    {staffList.map(member => (
                      <div key={member.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-primary">{member.name}</h4>
                            <p className="text-[11px] text-on-surface-variant font-medium">{member.role} • {member.hotel}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-on-surface-variant font-semibold">{member.phone}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {showAddPropertyModal && (
        <AddPropertyModal
          onClose={() => setShowAddPropertyModal(false)}
          onPropertyAdded={(newHotel) => {
            setHotelsList(prev => [newHotel, ...prev]);
          }}
        />
      )}
    </div>
  );
}
