import React, { useState } from 'react';
import { authApi } from '../data/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Split name into First and Last
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Guest";
        const lastName = nameParts.slice(1).join(" ") || "User";
        const dummyPhone = "0771234567";

        const user = await authApi.register(email, password, firstName, lastName, dummyPhone);
        onLoginSuccess && onLoginSuccess(user);
      } else {
        const user = await authApi.login(email, password);
        onLoginSuccess && onLoginSuccess(user);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-outline-variant relative animate-slideUp">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">S</div>
            <h2 className="text-lg font-extrabold text-primary">{isSignUp ? "Create StaySphere Account" : "Welcome Back"}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-error text-xs rounded-xl font-medium border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-primary block mb-1">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Lord Byron"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-primary block mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="user@staysphere.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-primary block mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-container disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md mt-2"
          >
            {loading ? "Processing..." : isSignUp ? "Register Account" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-secondary font-bold hover:underline ml-1"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
