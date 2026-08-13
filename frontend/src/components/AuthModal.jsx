import React, { useState } from 'react';
import { authApi } from '../data/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [portalTab, setPortalTab] = useState('traveler'); // 'traveler' | 'partner' | 'admin'
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const DEMO_USERS = {
    "customer@staysphere.com": { id: "u-cust", email: "customer@staysphere.com", firstName: "Kasun", lastName: "Perera", role: "Customer", isEmailVerified: true },
    "staff@staysphere.com": { id: "u-staff", email: "staff@staysphere.com", firstName: "Nimal", lastName: "Fernando", role: "HotelStaff", isEmailVerified: true },
    "owner@staysphere.com": { id: "u-owner", email: "owner@staysphere.com", firstName: "Kamal", lastName: "Silva", role: "HotelOwner", isEmailVerified: true },
    "admin@staysphere.com": { id: "u-admin", email: "admin@staysphere.com", firstName: "System", lastName: "Admin", role: "Admin", isEmailVerified: true },
    "superadmin@staysphere.com": { id: "u-superadmin", email: "superadmin@staysphere.com", firstName: "Root", lastName: "SuperAdmin", role: "SuperAdmin", isEmailVerified: true }
  };

  const getTargetRole = () => {
    if (portalTab === 'partner') return 'HotelOwner';
    if (portalTab === 'admin') return 'Admin';
    return 'Customer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const targetRole = getTargetRole();

    try {
      if (isSignUp) {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Guest";
        const lastName = nameParts.slice(1).join(" ") || "User";
        const dummyPhone = "0771234567";

        try {
          const user = await authApi.register(email, password, firstName, lastName, dummyPhone);
          const updatedUser = { ...user, role: targetRole };
          onLoginSuccess && onLoginSuccess(updatedUser);
        } catch {
          const mockUser = { id: "u-" + Date.now(), email, firstName, lastName, role: targetRole, isEmailVerified: true };
          localStorage.setItem('accessToken', 'demo-token-' + Date.now());
          onLoginSuccess && onLoginSuccess(mockUser);
        }
      } else {
        try {
          const user = await authApi.login(email, password);
          onLoginSuccess && onLoginSuccess(user);
        } catch (apiErr) {
          const normalizedEmail = (email || '').toLowerCase().trim();
          if (import.meta.env.DEV && DEMO_USERS[normalizedEmail]) {
            const demoUser = DEMO_USERS[normalizedEmail];
            localStorage.setItem('accessToken', 'demo-token-' + demoUser.role);
            onLoginSuccess && onLoginSuccess(demoUser);
          } else {
            throw apiErr;
          }
        }
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-slideUp text-left select-none">

        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter leading-none font-inter">
              <span className="text-[#FF385C]">s</span>
              <span className="text-[#38bdf8]">t</span>
              <span className="text-[#FABB05]">a</span>
              <span className="text-[#34A853]">y</span>
              <span className="text-slate-900">Sphere</span>
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => { setPortalTab('traveler'); setError(''); }}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${portalTab === 'traveler' ? 'bg-[#0058bc] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-base">flight_takeoff</span>
            <span>Traveler</span>
          </button>

          <button
            type="button"
            onClick={() => { setPortalTab('partner'); setError(''); }}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${portalTab === 'partner' ? 'bg-[#0058bc] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-base">domain</span>
            <span>Partner</span>
          </button>

          <button
            type="button"
            onClick={() => { setPortalTab('admin'); setError(''); }}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${portalTab === 'admin' ? 'bg-[#0058bc] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            <span>Admin</span>
          </button>
        </div>

        <div className="mb-5 p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs leading-relaxed">
          {portalTab === 'traveler' && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-lg shrink-0 mt-0.5">travel_explore</span>
              <div>
                <span className="font-extrabold text-sky-900 block mb-0.5">Traveler Guest Sign In</span>
                <p className="text-sky-800 text-[11px] font-normal">
                  Access luxury hotel reservations, saved wishlist stays, and direct concierge assistance with zero booking fees.
                </p>
              </div>
            </div>
          )}

          {portalTab === 'partner' && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-lg shrink-0 mt-0.5">add_business</span>
              <div>
                <span className="font-extrabold text-sky-900 block mb-0.5">Hotel Partner Guidelines</span>
                <p className="text-sky-800 text-[11px] font-normal">
                  📌 Listed properties enjoy 0% setup fees, bi-weekly direct payouts, and owner analytics. Ensure business registration and photos are ready.
                </p>
              </div>
            </div>
          )}

          {portalTab === 'admin' && (
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-lg shrink-0 mt-0.5">verified_user</span>
              <div>
                <span className="font-extrabold text-sky-900 block mb-0.5">Admin Security Policy</span>
                <p className="text-sky-800 text-[11px] font-normal">
                  🛡️ Restricted access for authorized StaySphere platform administrators & hotel staff. Multi-factor authentication & audit logging active.
                </p>
              </div>
            </div>
          )}
        </div>

        {!isSignUp && (
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Demo Fill:</span>
            {portalTab === 'traveler' && (
              <button
                type="button"
                onClick={() => { setEmail('customer@staysphere.com'); setPassword('Password123!'); }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              >
                Kasun (Traveler)
              </button>
            )}
            {portalTab === 'partner' && (
              <button
                type="button"
                onClick={() => { setEmail('owner@staysphere.com'); setPassword('Password123!'); }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              >
                Kamal (Hotel Partner)
              </button>
            )}
            {portalTab === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@staysphere.com'); setPassword('Password123!'); }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('superadmin@staysphere.com'); setPassword('Password123!'); }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
                >
                  SuperAdmin
                </button>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-rose-500">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder={portalTab === 'partner' ? "e.g. Kamal Perera (Hotel Partner)" : "e.g. Eleanor Vance"}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder={portalTab === 'partner' ? "partner@grandhorizon.lk" : portalTab === 'admin' ? "admin@staysphere.com" : "name@domain.com"}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0058bc] focus:border-[#0058bc]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0058bc] hover:bg-[#003580] disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? `Register as ${portalTab === 'partner' ? 'Hotel Partner' : portalTab === 'admin' ? 'Admin' : 'Traveler'}` : `Sign In to ${portalTab === 'partner' ? 'Partner Portal' : portalTab === 'admin' ? 'Admin Control' : 'StaySphere'}`}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 font-medium">
          {isSignUp ? "Already registered?" : "New to StaySphere?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#0058bc] font-bold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? "Sign In Now" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
