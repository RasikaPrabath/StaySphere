import React, { useState } from 'react';

export default function AdminPanel({ onBack, onAddToast }) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [pendingHotels, setPendingHotels] = useState([
    {
      id: "req-1",
      title: "The Azure Coastal Retreat",
      type: "Resort",
      typeColor: "bg-primary-fixed text-on-primary-fixed",
      location: "Amalfi Coast, Italy",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPbOwZyrlPsCu7m8hO7pS1XUkDPLtHZ1enxGmLuT7ybSDCzP5DH46lXzBu3mKWG-1Fl9CQd15885r0a0nnprrMkEn2sIZiR_GHXlMPj9Jan8TnsNkCD8bnF4ET7M_V1mVd_taF8EbBd_qpoRj5kBzBa9vUV19V3CzylNyOf2HSaMxTRLuYO3W6x5dlmFRLDrFH8mpMSQ0AIyJAMOLbuWFirig002MHlMfYueWwj-mz0W-rG9_GpsPo",
      kycVerified: true,
      docsComplete: true,
      missingTaxId: false,
      status: "pending"
    },
    {
      id: "req-2",
      title: "Urban Loft Suites",
      type: "Boutique",
      typeColor: "bg-secondary-fixed text-on-secondary-fixed",
      location: "Berlin, Germany",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCytkW5pwv8b6pyL5I6V6EVtATXuc5f8-Ro-x6VhXEf8GW2mnJHc1jMKcvPpoChJQTEdsLbclhUrgTGA91rx1K7heo5sQ1daS0-vx-TsGySzBwe9avLgOWMjjTBIakASJH7oCDITAxVJmWlsWzfPMBqkwH89LRGHiFt3yeP8jNszZ-qO1ShIJh3dfTjySAz0MHmV41RCP5bgYhgpBD-yW9f1M7qjLiRIVkJOdKQUiiRrMfQ0ADEetv2",
      kycVerified: true,
      docsComplete: false,
      missingTaxId: true,
      status: "pending"
    },
    {
      id: "req-3",
      title: "Serene Alpine Chalet",
      type: "Villa",
      typeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      location: "Zermatt, Switzerland",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
      kycVerified: true,
      docsComplete: true,
      missingTaxId: false,
      status: "pending"
    }
  ]);

  const handleApprove = (id, title) => {
    setPendingHotels(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
    onAddToast && onAddToast(`Approved listing for "${title}"`);
  };

  const handleReject = (id, title) => {
    setPendingHotels(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
    onAddToast && onAddToast(`Rejected request for "${title}"`);
  };

  const handleRequestInfo = (title) => {
    onAddToast && onAddToast(`Information request sent to owner of "${title}"`);
  };

  const activeRequests = pendingHotels.filter(h => h.status === 'pending');

  return (
    <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex flex-col antialiased w-full">
      {/* TopNavBar */}
      <header className="bg-surface-white text-primary border-b border-outline-variant shadow-sm docked full-width top-0 z-50 shrink-0">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-20">
          {/* Brand & Search */}
          <div className="flex items-center gap-gutter">
            <button onClick={onBack} className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-secondary filled-icon text-3xl">travel_explore</span>
              <span>StaySphere</span>
            </button>
            <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:border-secondary transition-colors">
              <span className="material-symbols-outlined text-outline mr-2">search</span>
              <input
                type="text"
                placeholder="Search system..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-body-md text-on-surface w-64 placeholder-outline focus:ring-0"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={onBack} className="text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md font-bold">
              Customer Site
            </button>
            <span className="text-secondary font-label-md text-label-md font-extrabold border-b-2 border-secondary pb-1">
              Super Admin Panel
            </span>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="font-label-md text-label-md font-bold text-secondary hidden md:block hover:text-primary transition-colors">
              Exit Admin
            </button>
            <div className="h-10 w-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh-WC6_wqZQmR12dxqAICFTNqcr6W_7dPt5Es0LTN3h-q6yw5JOW9laivn3ortxHfFMONeWFUxZMSkhFGeT5woDRUJGLr7w1_NcH3ML88BYveRv8fMqePpkWWr0EiS81EaM3yHQhw35RhMqKx6_FU84Nq5qXwscC54-Fx5STzvIHTsoRW0boQRzjnhAAZlT0DbKjHY93YIWsH2349-Yf7-PEVRkbnZ9RqiOf4_x0QHFjhGc8Ef01Wv"
                alt="Super Admin profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-surface-white text-primary border-r border-outline-variant h-full w-64 shrink-0 hidden md:flex flex-col gap-4 py-8 px-4 z-40">
          <div className="flex items-center gap-4 px-4 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-surface-container shrink-0 border border-outline-variant">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQolVUCYaWkpVreiLTytg-rtGzMqNXX4dIy-r5qy-ncGlB_EhEgdkCAd1QbgrtDAPoyDnXUhggyxm--obzB41pitnBEMPxAfI9AVWnktwfUm6e7qdD_LN1d9m_LCYDUYbS_48MY6GJuPEppo2I03Bo0d9wCBFXWnDUyK4EIdhIPSoUy4VvWaD9VMw5Gabs2y2u88rWVDERbpN3lJJKa84P0YjkHsslPOBidOwmRHK9GkWf2M6fhMdh"
                alt="Super Admin avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-headline-sm text-headline-sm text-primary truncate">Welcome back</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-bold truncate">Super Admin</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {[
              { id: 'users', label: 'User Management', icon: 'group' },
              { id: 'approvals', label: 'Hotel Approvals', icon: 'domain_verification' },
              { id: 'analytics', label: 'System Analytics', icon: 'monitoring' },
              { id: 'settings', label: 'Global Settings', icon: 'settings' }
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all text-left ${
                    isActive
                      ? 'text-on-primary font-bold bg-secondary-container shadow-sm scale-95'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto px-4">
            <button
              onClick={() => onAddToast && onAddToast("System log download initialized.")}
              className="w-full py-3 border border-outline text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors font-bold cursor-pointer"
            >
              View All Activity
            </button>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop">
          <div className="max-w-container-max mx-auto space-y-gutter">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-primary mb-1">
                  {activeTab === 'approvals' ? 'Pending Hotel Approvals' : activeTab === 'users' ? 'User & Partner Management' : activeTab === 'analytics' ? 'Global Platform Analytics' : 'Global System Settings'}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {activeTab === 'approvals' ? 'Review and manage incoming property listings across all regions.' : 'Control user privileges, owner verification status, and security compliance.'}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => onAddToast && onAddToast("Filter options opened")}
                  className="bg-surface-white px-4 py-2 rounded-lg border border-outline-variant flex items-center gap-2 shadow-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary">filter_list</span>
                  <span>Filter Requests</span>
                </button>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
              {/* Main Content Area: Approvals Table (Spans 2 columns) */}
              <div className="xl:col-span-2 space-y-gutter">
                <div className="bg-surface-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                    <h2 className="font-headline-sm text-headline-sm text-primary">Requires Action</h2>
                    <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                      {activeRequests.length} Pending
                    </span>
                  </div>

                  {/* Pending Hotel Cards */}
                  {activeRequests.length === 0 ? (
                    <div className="p-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-5xl text-success mb-2">task_alt</span>
                      <h4 className="font-headline-sm text-headline-sm text-primary">All Caught Up!</h4>
                      <p className="font-body-sm text-body-sm mt-1">There are currently no pending hotel approval requests.</p>
                    </div>
                  ) : (
                    activeRequests.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="p-6 border-b border-outline-variant hover:bg-surface-container-low transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center"
                      >
                        <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container border border-outline-variant">
                          <img
                            src={hotel.image}
                            alt={hotel.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">{hotel.title}</h3>
                            <span className={`${hotel.typeColor} px-2 py-0.5 rounded font-label-sm text-label-sm font-bold`}>
                              {hotel.type}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {hotel.location}
                          </p>
                          <div className="flex flex-wrap gap-4 font-label-sm text-label-sm text-on-surface-variant">
                            {hotel.kycVerified && (
                              <span className="flex items-center gap-1 text-success font-semibold">
                                <span className="material-symbols-outlined text-[16px]">verified_user</span> KYC Verified
                              </span>
                            )}
                            {hotel.docsComplete ? (
                              <span className="flex items-center gap-1 text-success font-semibold">
                                <span className="material-symbols-outlined text-[16px]">description</span> Docs Complete
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-tertiary-fixed-dim font-semibold">
                                <span className="material-symbols-outlined text-[16px]">warning</span> Missing Tax ID
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto shrink-0">
                          {hotel.missingTaxId ? (
                            <>
                              <button
                                onClick={() => handleRequestInfo(hotel.title)}
                                className="flex-1 md:flex-none px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors font-bold text-center cursor-pointer"
                              >
                                Request Info
                              </button>
                              <button
                                disabled
                                className="flex-1 md:flex-none px-4 py-2 bg-success text-on-primary font-label-md text-label-md rounded-lg font-bold text-center opacity-50 cursor-not-allowed"
                              >
                                Approve
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleReject(hotel.id, hotel.title)}
                                className="flex-1 md:flex-none px-4 py-2 border border-error text-error font-label-md text-label-md rounded-lg hover:bg-error-container transition-colors font-bold text-center cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleApprove(hotel.id, hotel.title)}
                                className="flex-1 md:flex-none px-4 py-2 bg-success text-on-primary font-label-md text-label-md rounded-lg hover:bg-opacity-90 transition-colors font-bold text-center cursor-pointer"
                              >
                                Approve
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  <div className="p-4 bg-surface-bright text-center">
                    <button
                      onClick={() => onAddToast && onAddToast("Loaded all pending requests.")}
                      className="text-secondary font-label-md text-label-md font-bold hover:underline cursor-pointer"
                    >
                      View All Pending Requests ({activeRequests.length}+)
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Panel: Analytics & Health */}
              <div className="space-y-gutter">
                {/* System Health Cards */}
                <div className="bg-surface-white rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,53,128,0.06)]">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">memory</span>
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-success text-[18px]">database</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface">Database Status</span>
                      </div>
                      <span className="text-success font-label-md text-label-md font-bold">Optimal</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-success text-[18px]">speed</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface">Caching Active</span>
                      </div>
                      <span className="text-success font-label-md text-label-md font-bold">99.8% Hit Rate</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">router</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface">API Latency</span>
                      </div>
                      <span className="text-tertiary-fixed-dim font-label-md text-label-md font-bold">142ms</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="bg-surface-white rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,53,128,0.06)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-white z-0"></div>
                  <div className="relative z-10">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Revenue Distribution</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Across active regions (30 Days)</p>

                    {/* Chart Bars */}
                    <div className="h-48 flex items-end gap-2 justify-between">
                      <div className="w-1/4 bg-primary-container rounded-t-sm h-[80%] hover:opacity-80 transition-opacity"></div>
                      <div className="w-1/4 bg-secondary-container rounded-t-sm h-[60%] hover:opacity-80 transition-opacity"></div>
                      <div className="w-1/4 bg-tertiary-fixed-dim rounded-t-sm h-[40%] hover:opacity-80 transition-opacity"></div>
                      <div className="w-1/4 bg-outline-variant rounded-t-sm h-[30%] hover:opacity-80 transition-opacity"></div>
                    </div>
                    <div className="flex justify-between mt-4 font-label-sm text-label-sm text-on-surface-variant font-bold">
                      <span>EU</span>
                      <span>NA</span>
                      <span>APAC</span>
                      <span>LATAM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
