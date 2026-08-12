import React, { useState } from 'react';

export default function OwnerDashboard({ onBack, onAddProperty }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeProperties = [
    {
      id: "owner-prop-1",
      title: "The Grand Horizon Resort",
      location: "Miami, FL",
      occupancy: "92%",
      occColor: "bg-success",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLXTpMDlBwFEjtXm_4SVf_8TtY4NOYhThaXfhhzN5uwsuxBZtav2KrEvDiMheryQDC7i63C9q1UpxOwh5qIOYxwNbG47IWyLshdcZ_T8CPDq3n3i_wxg10b2salPWn2nQ1cIPm3pclJ-wr9dCxza-Ao9XBpQ5YJYQj1HbpT4E9-z3c_eZL4JoU1kXPqm33M3TVaheLLHTA92gnvISsmy1gXkujGcYLX71Dc_xZLFCdoFxDHUj2D2JO",
      revenue: "$64,200",
      rooms: "45 Rooms"
    },
    {
      id: "owner-prop-2",
      title: "Urban Oasis Boutique",
      location: "Chicago, IL",
      occupancy: "76%",
      occColor: "bg-tertiary-fixed-dim",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE-0gX-FUA7jVMmOnvkWQPa1B6ns8HE03cr0Q1BKK2ks95ggGykqHt9lQ9dCYgwrYDR1z0pxMRCyteNELhyZELmE_2OWM2IienldzhpeNXfJ_e5nCcSEXIiAVA4ZcHlfcKK51gCUpGeOlwj2KMP8ld6SVuGT-xiitN3rF-zZ68CJWauKiz_FTgvcRCXyADACvnzJ6zncDfBHknIG2eTvFB5yOEVsKPX5s13C-dB7RGd43L7rxUuHTE",
      revenue: "$42,800",
      rooms: "30 Rooms"
    },
    {
      id: "owner-prop-3",
      title: "Alpine Crest Lodge",
      location: "Aspen, CO",
      occupancy: "88%",
      occColor: "bg-success",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAGAX57mn-PblNuX_wa427NgwiSvj9XEk3gAG98SNEIPdlzPBqXyCovs-jr81cp69wYKn9ZL_4GHl7UE0sEI1jdBK9vVADYQrsQLriNxMmxlS4XB_VzyH-vZ_O2Ko4eVjZBxx2VLjLsP8nJX7QZ1bjxEbUESaKolwG5MRaCS1-jUYIvQw-9lZxi0wBknNHB50sMF_2TyWrWBlex9AdeT9uhJFqVb0VqryHraGIvTOOfAR0p1G4zifF",
      revenue: "$35,500",
      rooms: "25 Rooms"
    }
  ];

  const chartData = [
    { month: "Jan", amount: 80000, label: "$80,000", height: "40%" },
    { month: "Feb", amount: 110000, label: "$110,000", height: "55%" },
    { month: "Mar", amount: 140000, label: "$140,000", height: "70%" },
    { month: "Apr", amount: 130000, label: "$130,000", height: "65%" },
    { month: "May", amount: 170000, label: "$170,000", height: "85%" },
    { month: "Jun", amount: 142500, label: "$142,500", height: "75%", current: true }
  ];

  return (
    <div className="bg-background text-on-surface font-sans antialiased flex h-screen overflow-hidden w-full">
      {/* SideNavBar (Desktop & Mobile) */}
      <nav className={`fixed md:static left-0 top-0 h-full w-64 border-r border-outline-variant bg-surface-white z-30 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        {/* Brand/Header */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-base">S</div>
              <span>StaySphere</span>
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 pt-4 border-t border-outline-variant/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLXbebGz8JTvKaAjKSj1dQxESnXmxXL5wSgGgCbgON7Vos-1UnegMb6GpY2JWngi6XPlU4huTDd90F9vCzaSpjGeWzV6OKe6dL0lwklapqybcud-JfragBg0UZvV2DZCozRHx3oO8W5z84DCjgtr_IWUwW4BrlvavCsU60DYm863vfso53_y0MBpjK1TgBHTW5X-2I84PkbKPec3Vba5fOMSGwi4ndmmzxVuesUe9mMY-zomVHQ7zi"
              alt="Owner headshot"
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-outline-variant shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface truncate">Welcome back</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold truncate">Owner Dashboard</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-1.5 px-4 mt-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'hotels', label: 'My Hotels', icon: 'apartment' },
            { id: 'bookings', label: 'Bookings', icon: 'calendar_month' },
            { id: 'revenue', label: 'Revenue', icon: 'payments' },
            { id: 'staff', label: 'Staff', icon: 'group' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 font-label-md text-label-md rounded-lg transition-all text-left ${
                  isActive
                    ? 'text-primary font-bold bg-primary-container/10 scale-95'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 mt-auto border-t border-outline-variant/30">
          <button
            onClick={() => onBack && onBack()}
            className="w-full py-2.5 bg-surface-container-high hover:bg-outline-variant/40 text-primary font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-2 mb-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Customer Site
          </button>
          <button
            onClick={() => onAddProperty && onAddProperty()}
            className="w-full py-3 bg-secondary text-on-primary font-label-md text-label-md rounded-lg shadow-[0_4px_12px_rgba(0,53,128,0.08)] hover:bg-secondary-container transition-colors font-bold cursor-pointer"
          >
            + Add Property
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background min-w-0">
        {/* TopAppBar */}
        <header className="bg-surface-white w-full border-b border-outline-variant shadow-[0_2px_8px_rgba(0,53,128,0.04)] z-10 sticky top-0 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-primary p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-headline-sm font-headline-sm font-semibold text-on-surface hidden md:block capitalize">
              {activeTab === 'overview' ? 'Property Overview' : activeTab === 'hotels' ? 'My Hotels & Estates' : activeTab === 'bookings' ? 'Guest Bookings & Reservations' : activeTab === 'revenue' ? 'Revenue Analytics' : 'Staff Management'}
            </h2>
            <h1 className="text-headline-md font-headline-md font-bold text-primary md:hidden">StaySphere</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setNotificationCount(0); }}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors relative rounded-full hover:bg-surface-container-low"
                title="Notifications"
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
                    <span className="text-[11px] text-secondary font-semibold">Mark all read</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 bg-surface-container-low rounded-xl flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg shrink-0">event_available</span>
                      <div>
                        <p className="font-bold text-on-surface">New Reservation</p>
                        <p className="text-on-surface-variant text-[11px]">The Grand Horizon Resort - 3 nights ($567)</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-surface-container-low rounded-xl flex gap-3">
                      <span className="material-symbols-outlined text-success text-lg shrink-0">payments</span>
                      <div>
                        <p className="font-bold text-on-surface">Payout Processed</p>
                        <p className="text-on-surface-variant text-[11px]">$14,200 transferred to your bank account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-outline-variant pl-4 ml-2">
              <span className="material-symbols-outlined text-on-surface-variant">language</span>
              <span className="font-label-md text-label-md text-on-surface-variant">EN</span>
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop">
          <div className="max-w-container-max mx-auto flex flex-col gap-8 pb-12">
            {/* Page Header (Mobile) */}
            <div className="md:hidden">
              <h2 className="text-headline-xl-mobile font-headline-xl-mobile font-bold text-on-surface capitalize">{activeTab}</h2>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">Manage your enterprise hotels and revenue.</p>
            </div>

            {/* Metrics Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Revenue Card */}
              <div className="bg-surface-white rounded-xl p-6 border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,53,128,0.03)] hover:shadow-[0_8px_24px_rgba(0,53,128,0.06)] transition-shadow flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-container/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <span className="flex items-center text-success font-label-md text-label-md gap-1 bg-success/10 px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> 12.5%
                    </span>
                  </div>
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Revenue (MTD)</h3>
                  <p className="text-headline-lg font-headline-lg font-bold text-on-surface mt-1">$142,500</p>
                </div>
              </div>

              {/* Current Occupancy Card */}
              <div className="bg-surface-white rounded-xl p-6 border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,53,128,0.03)] hover:shadow-[0_8px_24px_rgba(0,53,128,0.06)] transition-shadow flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-container/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined">bed</span>
                    </div>
                    <span className="flex items-center text-on-surface-variant font-label-md text-label-md gap-1 bg-surface-container-high px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[16px]">trending_flat</span> 0%
                    </span>
                  </div>
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Current Occupancy</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-headline-lg font-headline-lg font-bold text-on-surface">84%</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Across 3 properties</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-secondary w-[84%] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* New Bookings Card */}
              <div className="bg-surface-white rounded-xl p-6 border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,53,128,0.03)] hover:shadow-[0_8px_24px_rgba(0,53,128,0.06)] transition-shadow flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-container/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined">event_available</span>
                    </div>
                    <span className="flex items-center text-success font-label-md text-label-md gap-1 bg-success/10 px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> 8.2%
                    </span>
                  </div>
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">New Bookings (Today)</h3>
                  <p className="text-headline-lg font-headline-lg font-bold text-on-surface mt-1">24</p>
                </div>
              </div>
            </section>

            {/* Complex Section: Charts & Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Revenue Chart */}
              <section className="lg:col-span-2 bg-surface-white rounded-xl border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,53,128,0.03)] p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface">Revenue Trends</h3>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-surface-container-low border-none rounded-lg text-label-md font-label-md text-on-surface py-2 pl-4 pr-8 focus:ring-2 focus:ring-secondary cursor-pointer outline-none"
                  >
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                  </select>
                </div>

                {/* Bar Chart Area */}
                <div className="flex-1 min-h-[250px] relative flex items-end gap-2 sm:gap-6 pt-10">
                  {/* Y-Axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-label-sm font-label-sm text-on-surface-variant pr-4 border-r border-outline-variant/30 pb-8">
                    <span>$200k</span>
                    <span>$150k</span>
                    <span>$100k</span>
                    <span>$50k</span>
                    <span>$0</span>
                  </div>

                  {/* Chart Bars container */}
                  <div className="flex-1 h-full ml-14 flex items-end justify-between gap-2 pb-8 relative border-b border-outline-variant/30">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                      <div className="w-full h-px bg-outline-variant/20"></div>
                      <div className="w-full h-px bg-outline-variant/20"></div>
                      <div className="w-full h-px bg-outline-variant/20"></div>
                      <div className="w-full h-px bg-outline-variant/20"></div>
                      <div className="w-full h-px bg-transparent"></div>
                    </div>

                    {chartData.map((bar, idx) => (
                      <div key={idx} className="relative w-full max-w-[48px] h-full flex flex-col justify-end group cursor-pointer z-10">
                        <div
                          style={{ height: bar.height }}
                          className={`w-full rounded-t-sm transition-all duration-300 relative ${
                            bar.current
                              ? 'bg-secondary hover:bg-primary-container'
                              : 'bg-secondary-container/40 hover:bg-secondary-container/80'
                          }`}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary text-label-sm px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-30 font-bold">
                            {bar.label}
                          </div>
                        </div>
                        <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-label-sm font-label-sm ${
                          bar.current ? 'text-on-surface font-bold' : 'text-on-surface-variant'
                        }`}>
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Right Column: Active Properties List */}
              <section className="bg-surface-white rounded-xl border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,53,128,0.03)] p-6 flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface">Active Properties</h3>
                  <button className="text-secondary hover:text-primary transition-colors text-label-sm font-label-sm font-semibold uppercase tracking-wide cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                  {activeProperties.map((prop, idx) => (
                    <React.Fragment key={prop.id}>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30">
                        <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-surface-container">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-label-md font-label-md text-on-surface truncate font-bold">{prop.title}</h4>
                          <p className="text-label-sm font-label-sm text-on-surface-variant truncate">{prop.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${prop.occColor}`}></span>
                            <span className="text-label-sm font-label-sm text-on-surface-variant font-medium">{prop.occupancy} Occ.</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddProperty && onAddProperty(); }}
                          className="p-2 text-outline hover:text-secondary bg-surface-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-outline-variant/50 cursor-pointer"
                          title="Edit Property"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </div>
                      {idx < activeProperties.length - 1 && <div className="w-full h-px bg-outline-variant/30"></div>}
                    </React.Fragment>
                  ))}
                </div>
                <button
                  onClick={() => onAddProperty && onAddProperty()}
                  className="w-full mt-4 py-2 border-2 border-secondary text-secondary font-label-md text-label-md rounded-lg hover:bg-secondary/5 transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span> Add Property
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
