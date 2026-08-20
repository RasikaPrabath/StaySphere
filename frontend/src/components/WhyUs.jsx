import React from 'react';

export default function WhyUs() {
  const benefits = [
    {
      icon: "verified",
      title: "Direct Price Guarantee",
      stat: "100% Direct Rates",
      description: "Book directly with verified property owners for guaranteed lowest rates with zero hidden fees."
    },
    {
      icon: "support_agent",
      title: "24/7 Concierge Support",
      stat: "Round-the-Clock",
      description: "Personal VIP assistance for airport transfers, private drivers, guided safaris, and villa bookings."
    },
    {
      icon: "verified_user",
      title: "Vetted Luxury Properties",
      stat: "500+ Luxury Stays",
      description: "Every hotel, tea estate, and oceanfront villa is strictly inspected for 5-star hospitality standards."
    },
    {
      icon: "shield",
      title: "Instant Secure Confirmation",
      stat: "Bank-Grade SSL",
      description: "Encrypted multi-currency checkout with flexible cancellation and instant digital vouchers."
    }
  ];

  return (
    <section id="why-us" className="w-full bg-[#f8fafc] py-12 md:py-16 relative select-none border-y border-slate-100">
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="bg-sky-50 text-sky-800 border border-sky-200/80 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
            The StaySphere Difference
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Why Book With StaySphere
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience seamless luxury travel across Sri Lanka with direct owner rates, verified properties, and 24/7 concierge support.
          </p>
        </div>

        {/* 4-Column Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:bg-[#0058bc] transition-colors">
                    <span className="material-symbols-outlined text-xl text-[#0058bc] group-hover:text-white transition-colors">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-sky-800 bg-sky-50/80 px-2 py-0.5 rounded-full border border-sky-100">
                    {item.stat}
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-1.5 text-slate-900 group-hover:text-[#0058bc] transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
