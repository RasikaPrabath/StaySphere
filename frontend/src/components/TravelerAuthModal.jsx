import React, { useState } from 'react';
import { authApi } from '../data/api';

export default function TravelerAuthModal({ isOpen, onClose, onLoginSuccess, initialIsSignUp = false }) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);

  if (!isOpen) return null;

  const DEMO_USERS = {
    "customer@staysphere.com": { id: "u-cust", email: "customer@staysphere.com", firstName: "Kasun", lastName: "Perera", role: "Customer", isEmailVerified: true },
    "admin@staysphere.com": { id: "u-admin", email: "admin@staysphere.com", firstName: "System", lastName: "Admin", role: "Admin", isEmailVerified: true }
  };

  const getTargetRole = () => {
    return isAdminMode ? 'Admin' : 'Customer';
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
          const user = await authApi.register(email, password, firstName, lastName, dummyPhone, targetRole === 'Admin' ? 3 : 1);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-slideUp text-left select-none">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter leading-none font-inter">
              <span className="text-[#0058bc]">s</span>
              <span className="text-[#0058bc]">t</span>
              <span className="text-[#0058bc]">a</span>
              <span className="text-[#0058bc]">y</span>
              <span className="text-slate-900 font-bold">Sphere</span>
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {isAdminMode ? 'Admin Portal' : 'Traveler'}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs leading-relaxed text-slate-700">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl shrink-0">travel_explore</span>
            <div>
              <span className="font-extrabold text-blue-950 block mb-0.5">
                {isSignUp ? 'Create your traveler account' : 'Sign in to plan your next stay'}
              </span>
              <p className="text-slate-600 text-[11px]">
                Unlock member-only luxury hotel deals, earn staysphere reward points, and manage bookings seamlessly with 24/7 priority traveler support.
              </p>
            </div>
          </div>
        </div>

        {!isSignUp && (
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Demo Fill:</span>
            <button
              type="button"
              onClick={() => { setEmail('customer@staysphere.com'); setPassword('Password123!'); setIsAdminMode(false); }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
            >
              Kasun (Traveler)
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@staysphere.com'); setPassword('Password123!'); setIsAdminMode(true); }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
            >
              Admin System
            </button>
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
                placeholder="e.g. Eleanor Vance"
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
              placeholder="name@domain.com"
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
                <span>{isSignUp ? 'Create Traveler Account' : 'Sign In as Traveler'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="text-xs text-slate-500 font-medium">
            {isSignUp ? "Already registered?" : "New to StaySphere?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#0058bc] font-bold hover:underline ml-1 cursor-pointer"
            >
              {isSignUp ? "Sign In Now" : "Create Account"}
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold mt-2 cursor-pointer transition-colors"
          >
            {isAdminMode ? "Switch to Traveler Sign In" : "Are you an Administrator?"}
          </button>
        </div>
      </div>
    </div>
  );
}
