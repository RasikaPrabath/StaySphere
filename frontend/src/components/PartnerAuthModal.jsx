import React, { useState } from 'react';
import { authApi } from '../data/api';

export default function PartnerAuthModal({ isOpen, onClose, onLoginSuccess, initialIsSignUp = false }) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const DEMO_USERS = {
    "owner@staysphere.com": { id: "u-owner", email: "owner@staysphere.com", firstName: "Kamal", lastName: "Silva", role: "Partner", isEmailVerified: true }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Partner";
        const lastName = nameParts.slice(1).join(" ") || "Host";
        const dummyPhone = "0771234567";

        try {
          const user = await authApi.register(email, password, firstName, lastName, dummyPhone, 2); // 2 is Partner
          const updatedUser = { ...user, role: 'Partner' };
          onLoginSuccess && onLoginSuccess(updatedUser);
        } catch {
          const mockUser = { id: "u-" + Date.now(), email, firstName, lastName, role: 'Partner', isEmailVerified: true };
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
      setError(err.response?.data?.message || "Partner portal authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1b3d] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900 relative animate-slideUp text-left select-none">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 w-8 h-8 rounded-full bg-blue-950 hover:bg-blue-900 text-sky-200 flex items-center justify-center transition-colors cursor-pointer border border-blue-800">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Brand/Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-2xl tracking-tighter leading-none font-inter text-white">
              s<span className="text-[#38bdf8]">t</span>aySphere
            </span>
            <span className="text-[10px] bg-blue-500/20 text-[#38bdf8] border border-blue-500/30 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Partner Hub
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold">Join thousands of premier hotels, resorts, and villas in Sri Lanka.</p>
        </div>

        {/* Benefits Card */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-950/60 border border-blue-900 text-xs leading-relaxed text-sky-100">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#38bdf8] text-xl shrink-0 mt-0.5">add_business</span>
            <div>
              <span className="font-extrabold text-white block mb-0.5">
                {isSignUp ? 'List your luxury property' : 'Sign in to Partner Control Center'}
              </span>
              <ul className="text-slate-300 text-[11px] space-y-1 mt-1">
                <li>• 0% Setup Fees & Commission-free bookings for 3 months</li>
                <li>• Bi-weekly direct bank payouts in LKR / USD</li>
                <li>• Unified guest management dashboard & staff allocation tool</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo filler */}
        {!isSignUp && (
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider shrink-0">Demo Fill:</span>
            <button
              type="button"
              onClick={() => { setEmail('owner@staysphere.com'); setPassword('Password123!'); }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[#38bdf8] cursor-pointer shrink-0"
            >
              Kamal (Hotel Partner)
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-rose-400">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Company / Host Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kamal Perera (Grand Horizon Group)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#071128] border border-blue-800/80 rounded-xl p-3 text-xs font-medium text-white outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-[#38bdf8] placeholder-slate-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Business Email Address</label>
            <input
              type="email"
              required
              placeholder="partner@yourhotel.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#071128] border border-blue-800/80 rounded-xl p-3 text-xs font-medium text-white outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-[#38bdf8] placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Secure Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#071128] border border-blue-800/80 rounded-xl p-3 text-xs font-medium text-white outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-[#38bdf8] placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Authenticating Portal...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Register as StaySphere Partner' : 'Sign In to Partner Portal'}</span>
                <span className="material-symbols-outlined text-sm">business_center</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-400 font-medium">
          {isSignUp ? "Already a registered partner?" : "Want to register your property?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#38bdf8] font-bold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? "Sign In Now" : "Create Partner Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
