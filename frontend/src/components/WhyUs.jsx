import React from 'react';

export default function WhyUs() {
  const benefits = [
    {
      icon: "verified",
      title: "Direct Price Guarantee",
      description: "Book directly with property owners for the best guaranteed rates with no middleman markups."
    },
    {
      icon: "support_agent",
      title: "24/7 Concierge Support",
      description: "Dedicated personal assistance for airport transfers, itinerary planning, and villa arrangements."
    },
    {
      icon: "verified_user",
      title: "Handpicked Luxury Stays",
      description: "Every hotel, villa, and eco-resort is strictly vetted for world-class quality and hospitality."
    },
    {
      icon: "shield",
      title: "Instant Secure Booking",
      description: "Bank-level encryption with multi-currency checkout, flexible cancellation options, and immediate voucher."
    }
  ];

  return (
    <section id="why-us" className="w-full bg-[#F8FAFC] py-12 md:py-16 relative select-none border-y border-gray-100">
      <div className="max-w-container-max mx-auto px-3 md:px-4 relative z-10">
        
        {/* Flat Minimalist Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold text-[#0058bc] uppercase tracking-widest block mb-2">The StaySphere Difference</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Why Book With StaySphere</h2>
          <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience seamless luxury travel across Sri Lanka with direct owner rates, verified properties, and round-the-clock concierge service.
          </p>
        </div>

        {/* 4-Column Flat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-200 border border-gray-200/80 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0058bc]/10 border border-[#0058bc]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-[#0058bc]">{item.icon}</span>
              </div>
              <h3 className="text-base font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed font-normal">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
