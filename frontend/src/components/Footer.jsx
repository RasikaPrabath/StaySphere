import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest text-on-surface w-full border-t border-outline-variant mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-3 md:px-4 py-12 max-w-container-max mx-auto">

        {/* Col 1: Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">StaySphere</span>
          </div>
          <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
            Curating premium stays and unforgettable experiences worldwide with uncompromising quality.
          </p>
        </div>

        {/* Col 2: Company */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Company</h4>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">About Corporate</a>
          <a href="#destinations" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Trending Destinations</a>
          <a href="#collections" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Curated Collections</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Concierge Support</a>
        </div>

        {/* Col 3: Legal */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Legal</h4>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Guest Refund Guarantee</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Cookie Preferences</a>
        </div>

        {/* Col 4: Social */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Stay Connected</h4>
          <p className="text-xs text-on-surface-variant">Follow us for daily luxury destination inspiration.</p>
          <div className="flex gap-3 mt-1">
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:text-surface-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg" data-icon="share">share</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:text-surface-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:text-surface-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg" data-icon="travel_explore">travel_explore</span>
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-outline-variant/50 py-6 px-3 md:px-4 text-center bg-surface-container-low/40">
        <p className="text-xs text-on-surface-variant">
          © {new Date().getFullYear()} StaySphere Inc. All rights reserved. Designed with luxury and precision.
        </p>
      </div>
    </footer>
  );
}
