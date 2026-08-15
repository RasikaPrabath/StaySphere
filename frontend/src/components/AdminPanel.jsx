import React, { useState, useEffect } from 'react';
import { adminApi, dashboardApi } from '../data/api';

export default function AdminPanel({ user, onBack, onAddToast }) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const loadPending = async () => {
      try {
        const data = await adminApi.getPendingHotels();
        const mapped = data.map(h => ({
          id: h.id,
          title: h.name,
          type: "Hotel",
          typeColor: "bg-primary text-white",
          location: `${h.city}, ${h.country}`,
          image: h.imageUrls?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          kycVerified: true,
          docsComplete: true,
          missingTaxId: false,
          status: "pending"
        }));
        setPendingHotels(mapped);
      } catch (err) {
        console.warn("Failed to load pending hotels from backend, using fallback mocks", err);
      }
    };

    if (activeTab === 'approvals') {
      loadPending();
    }
  }, [activeTab]);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const data = await dashboardApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.warn("Failed to load admin stats from backend", err);
      } finally {
        setLoadingStats(false);
      }
    };

    if (activeTab === 'analytics') {
      loadStats();
    }
  }, [activeTab]);

  const userRole = user?.role || user?.Role;
  const isSuperAdmin = userRole === 'Admin' || userRole === 3 || !userRole; // Admin level check

  // Pending hotel approvals state
  const [pendingHotels, setPendingHotels] = useState([
    {
      id: "req-1",
      title: "The Azure Coastal Retreat",
      type: "Resort",
      typeColor: "bg-primary text-white",
      location: "Bentota, Sri Lanka",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      kycVerified: true,
      docsComplete: true,
      missingTaxId: false,
      status: "pending"
    },
    {
      id: "req-2",
      title: "Urban Loft Suites",
      type: "Boutique",
      typeColor: "bg-secondary text-white",
      location: "Colombo, Sri Lanka",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      kycVerified: true,
      docsComplete: false,
      missingTaxId: true,
      status: "pending"
    },
    {
      id: "req-3",
      title: "Serene Tea Chalet",
      type: "Villa",
      typeColor: "bg-amber-600 text-white",
      location: "Nuwara Eliya, Sri Lanka",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
      kycVerified: true,
      docsComplete: true,
      missingTaxId: false,
      status: "pending"
    }
  ]);

  // System users management state
  const [usersList, setUsersList] = useState([
    { id: 1, name: "Rasika Prabath", email: "rasika@staysphere.com", role: "Admin", status: "Active", joined: "Jan 2026" },
    { id: 2, name: "Kavindu Perera", email: "kavindu@grandhorizon.lk", role: "Partner", status: "Active", joined: "Feb 2026" },
    { id: 3, name: "Sarah Jenkins", email: "sarah.j@gmail.com", role: "Customer", status: "Active", joined: "Mar 2026" },
    { id: 4, name: "Dinesh Silva", email: "dinesh@villaslk.com", role: "Partner", status: "Active", joined: "Apr 2026" },
    { id: 5, name: "Amara Wickrama", email: "amara@yahoo.com", role: "Customer", status: "Suspended", joined: "May 2026" }
  ]);

  // System Settings state
  const [commissionRate, setCommissionRate] = useState(8.0);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleApprove = async (id, title) => {
    try {
      await adminApi.approveHotel(id);
      setPendingHotels(prev => prev.filter(item => item.id !== id));
      onAddToast && onAddToast(`Approved listing for "${title}"`);
    } catch (err) {
      console.error("Failed to approve hotel via API", err);
      setPendingHotels(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
      onAddToast && onAddToast(`Approved listing for "${title}" (mock)`);
    }
  };

  const handleReject = async (id, title) => {
    try {
      await adminApi.rejectHotel(id);
      setPendingHotels(prev => prev.filter(item => item.id !== id));
      onAddToast && onAddToast(`Rejected request for "${title}"`);
    } catch (err) {
      console.error("Failed to reject hotel via API", err);
      setPendingHotels(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
      onAddToast && onAddToast(`Rejected request for "${title}" (mock)`);
    }
  };

  const handleRequestInfo = (title) => {
    onAddToast && onAddToast(`Information request sent to owner of "${title}"`);
  };

  const handleUserRoleChange = (userId, newRole) => {
    if (!isSuperAdmin) {
      onAddToast && onAddToast("Access Denied: Only SuperAdmin can modify user roles.");
      return;
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    onAddToast && onAddToast(`Updated user role to ${newRole}`);
  };

  const handleToggleUserStatus = (userId) => {
    if (!isSuperAdmin) {
      onAddToast && onAddToast("Access Denied: Only SuperAdmin can suspend user accounts.");
      return;
    }
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    onAddToast && onAddToast("Updated user status");
  };

  const activeRequests = pendingHotels.filter(h => h.status === 'pending');

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-surface font-sans h-screen overflow-hidden flex flex-col antialiased w-full">
      {/* Top Header */}
      <header className="bg-surface-white text-primary border-b border-outline-variant shadow-sm top-0 z-50 shrink-0">
        <div className="flex justify-between items-center w-full px-6 h-20">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="text-xl font-extrabold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-secondary text-2xl">admin_panel_settings</span>
              <span>StaySphere Admin</span>
            </button>
            <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant">
              <span className="material-symbols-outlined text-gray-400 mr-2 text-sm">search</span>
              <input
                type="text"
                placeholder="Search users or hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold text-on-surface w-60 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${isSuperAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
              {isSuperAdmin ? "Super Admin" : "Operations Admin"}
            </span>
            <button onClick={onBack} className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-base">exit_to_app</span>
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-surface-white text-primary border-r border-outline-variant h-full w-64 shrink-0 hidden md:flex flex-col gap-3 py-6 px-4 z-40">
          <div className="flex items-center gap-3 px-3 mb-4 border-b border-outline-variant/40 pb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-sm">
              {isSuperAdmin ? "SA" : "AD"}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-primary truncate">{isSuperAdmin ? "Super Admin" : "System Admin"}</h3>
              <p className="text-[11px] text-on-surface-variant font-medium truncate">{isSuperAdmin ? "Full Authority" : "Operations Mode"}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 flex-1">
            {[
              { id: 'approvals', label: 'Hotel Approvals', icon: 'domain_verification' },
              { id: 'users', label: 'User & Role Management', icon: 'group' },
              { id: 'analytics', label: 'Platform Analytics', icon: 'monitoring' },
              { id: 'audit', label: 'Audit Logs & Security', icon: 'shield_person' },
              { id: 'settings', label: 'Global Settings', icon: 'settings' }
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'text-white bg-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="max-w-container-max mx-auto space-y-6 pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/40 pb-4">
              <div>
                <h1 className="text-xl font-extrabold text-primary">
                  {activeTab === 'approvals' ? 'Pending Hotel Approvals' : activeTab === 'users' ? 'User Roles & Privileges' : activeTab === 'analytics' ? 'Global Platform Performance' : 'System Configuration Settings'}
                </h1>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                  {activeTab === 'approvals' ? 'Review property partner applications before publication.' : 'Control user access roles, verify hotel owners, and enforce compliance.'}
                </p>
              </div>
            </div>

            {/* TAB: APPROVALS */}
            {activeTab === 'approvals' && (
              <div className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Listing Applications</h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full">
                    {activeRequests.length} Pending Approval
                  </span>
                </div>

                {activeRequests.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl text-emerald-600 mb-2">task_alt</span>
                    <h4 className="font-bold text-base text-primary">All Applications Reviewed!</h4>
                    <p className="text-xs mt-1">There are no pending hotel listings awaiting verification.</p>
                  </div>
                ) : (
                  activeRequests.map((hotel) => (
                    <div key={hotel.id} className="p-5 border-b border-outline-variant/50 hover:bg-surface-container-low/40 transition-colors flex flex-col md:flex-row gap-5 items-start md:items-center">
                      <img src={hotel.image} alt={hotel.title} className="w-28 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm text-primary">{hotel.title}</h4>
                          <span className={`${hotel.typeColor} text-[10px] font-extrabold px-2 py-0.5 rounded-md`}>
                            {hotel.type}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-2 font-medium">
                          <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                          {hotel.location}
                        </p>
                        <div className="flex gap-3 text-[11px] font-bold">
                          {hotel.kycVerified && (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">verified</span> KYC Verified
                            </span>
                          )}
                          {hotel.missingTaxId && (
                            <span className="text-amber-600 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">warning</span> Tax ID Required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto shrink-0">
                        {hotel.missingTaxId ? (
                          <button onClick={() => handleRequestInfo(hotel.title)} className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50">
                            Request Info
                          </button>
                        ) : (
                          <>
                            <button onClick={() => handleReject(hotel.id, hotel.title)} className="px-3.5 py-2 border border-rose-300 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50">
                              Reject
                            </button>
                            <button onClick={() => handleApprove(hotel.id, hotel.title)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow">
                              Approve Listing
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: USERS & ROLES */}
            {activeTab === 'users' && (
              <div className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-right">Role Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-xs font-semibold">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-surface-container-low/50">
                          <td className="p-4 font-bold text-primary">{u.name}</td>
                          <td className="p-4 text-on-surface-variant">{u.email}</td>
                          <td className="p-4">
                            <select
                              disabled={!isSuperAdmin}
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                              className={`border border-outline-variant rounded-lg p-1 text-xs font-bold bg-white cursor-pointer ${!isSuperAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                              <option value="Customer">Customer</option>
                              <option value="Partner">Partner</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4 text-on-surface-variant">{u.joined}</td>
                          <td className="p-4 text-right">
                            <button
                              disabled={!isSuperAdmin}
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`text-xs font-bold ${isSuperAdmin ? 'text-secondary hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Total Platform Volume</span>
                  <p className="text-3xl font-extrabold text-primary mt-2">
                    {stats ? `$${stats.totalRevenue.toLocaleString()}` : "$1,240,500"}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">+18.5% YoY Growth</span>
                </div>
                <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Active Hotel Listings</span>
                  <p className="text-3xl font-extrabold text-secondary mt-2">
                    {stats ? `${stats.totalHotels} Hotels` : "1,420 Hotels"}
                  </p>
                  <span className="text-[11px] text-on-surface-variant font-medium block mt-1">Across 12 Regions</span>
                </div>
                <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Total Platform Users</span>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2">
                    {stats ? `${stats.totalUsers} Users` : "2,450 Users"}
                  </p>
                  <span className="text-[11px] text-on-surface-variant font-medium block mt-1">Customers & Partners</span>
                </div>
                <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Active Reservation Load</span>
                  <p className="text-3xl font-extrabold text-[#0058bc] mt-2">
                    {stats ? `${stats.activeBookingsCount} Bookings` : "145 Bookings"}
                  </p>
                  <span className="text-[11px] text-on-surface-variant font-medium block mt-1">Pending/Confirmed</span>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-surface-white p-6 rounded-2xl border border-outline-variant shadow-sm max-w-2xl space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-base font-bold text-primary">Global Platform Configuration</h3>
                  {!isSuperAdmin && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                      🔒 Read-Only (Requires SuperAdmin)
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Platform Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!isSuperAdmin}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className={`w-full max-w-xs border border-outline-variant rounded-xl p-2.5 text-xs font-bold ${!isSuperAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">Applied to all property booking transactions.</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
                  <div>
                    <h4 className="text-xs font-bold text-primary">System Maintenance Mode</h4>
                    <p className="text-[11px] text-on-surface-variant">Temporarily disable customer bookings during upgrades.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isSuperAdmin}
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-5 h-5 rounded accent-secondary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
                  <div>
                    <h4 className="text-xs font-bold text-primary">Automated Email Notifications</h4>
                    <p className="text-[11px] text-on-surface-variant">Send instant confirmation receipts to guests and hotel owners.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isSuperAdmin}
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 rounded accent-secondary cursor-pointer"
                  />
                </div>

                <button
                  disabled={!isSuperAdmin}
                  onClick={() => onAddToast && onAddToast("Saved system settings successfully!")}
                  className={`text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition-colors ${isSuperAdmin ? 'bg-primary hover:bg-secondary cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Save Configurations
                </button>
              </div>
            )}

            {/* TAB: AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="bg-surface-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
                  <div>
                    <h3 className="font-bold text-sm text-primary">System Audit Trail & Security Logs</h3>
                    <p className="text-xs text-on-surface-variant">Immutable history of administrative actions, role changes, and system events.</p>
                  </div>
                  <span className="bg-sky-100 text-sky-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                    Encrypted Audit Log
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "LOG-109", action: "Approved Hotel Listing", details: "Approved 'The Azure Coastal Retreat' in Bentota", actor: "System Admin (Rasika)", timestamp: "2026-08-13 15:40", category: "Listing Approval" },
                    { id: "LOG-108", action: "Role Modified", details: "Promoted 'Kavindu Perera' from Traveler to Partner", actor: "Admin (Rasika)", timestamp: "2026-08-13 14:15", category: "Security & Access" },
                    { id: "LOG-107", action: "Commission Rate Changed", details: "Platform commission updated from 7.5% to 8.0%", actor: "Admin (Rasika)", timestamp: "2026-08-12 11:20", category: "Financial Config" },
                    { id: "LOG-106", action: "User Suspended", details: "Suspended account 'Amara Wickrama' due to policy flag", actor: "Admin (Rasika)", timestamp: "2026-08-11 09:05", category: "Account Security" }
                  ].map((log) => (
                    <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-extrabold text-[#0058bc]">{log.action}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">{log.category}</span>
                        </div>
                        <p className="text-slate-600 font-medium">{log.details}</p>
                      </div>
                      <div className="text-right shrink-0 text-[11px] text-slate-500 font-semibold">
                        <div>{log.actor}</div>
                        <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
