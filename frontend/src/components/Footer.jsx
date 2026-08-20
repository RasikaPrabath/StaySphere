import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full border-t border-slate-800 mt-auto select-none">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-3 md:px-4 py-12 max-w-[1400px] mx-auto text-left">

        {/* Col 1: Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <span className="font-black text-2xl tracking-tighter leading-none font-inter text-white">
              <span className="text-[#FF385C]">s</span>
              <span className="text-[#38bdf8]">t</span>
              <span className="text-[#FABB05]">a</span>
              <span className="text-[#34A853]">y</span>
              <span className="text-white">Sphere</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-normal">
            Sri Lanka's premier luxury travel & booking platform. Direct hotel reservations, handpicked boutique villas, and 24/7 concierge support.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-emerald-400 text-base">verified_user</span>
            <span className="text-[11px] font-bold text-slate-300">Bank-Grade 256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs text-white font-extrabold uppercase tracking-wider mb-1">Destinations</h4>
          <a href="#destinations" className="text-xs text-slate-400 hover:text-white transition-colors">Colombo & Galle Fort</a>
          <a href="#destinations" className="text-xs text-slate-400 hover:text-white transition-colors">Kandy & Nuwara Eliya</a>
          <a href="#destinations" className="text-xs text-slate-400 hover:text-white transition-colors">Ella & Highland Tea Chalets</a>
          <a href="#destinations" className="text-xs text-slate-400 hover:text-white transition-colors">Weligama & Bentota Beach</a>
        </div>

        {/* Col 3: Legal & Trust */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs text-white font-extrabold uppercase tracking-wider mb-1">Trust & Legal</h4>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Best Price Guarantee</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Guest Refund Policy</a>
        </div>

        {/* Col 4: Payments & Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs text-white font-extrabold uppercase tracking-wider mb-1">Accepted Payments</h4>
          <p className="text-xs text-slate-400">Multi-currency instant booking with zero foreign transaction markup.</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {['VISA', 'Mastercard', 'AMEX', 'PayPal', 'Apple Pay'].map((pay, i) => (
              <span key={i} className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-extrabold px-2 py-1 rounded">
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="border-t border-slate-800/80 py-5 px-3 md:px-4 text-center bg-slate-950">
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} StaySphere Inc. All rights reserved. Sri Lanka Luxury Hotel & Resort Collection.
        </p>
      </div>
    </footer>
  );
}
