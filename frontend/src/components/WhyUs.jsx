import React from 'react';

export default function WhyUs() {
  const benefits = [
    {
      icon: "verified",
      title: "Best Price Guarantee",
      description: "Find a lower price for the same stay and we'll match it, ensuring you receive the ultimate value for luxury."
    },
    {
      icon: "support_agent",
      title: "24/7 Premium Support",
      description: "Dedicated personal concierges available around the clock to assist with airport transfers, yacht charters, and private chefs."
    },
    {
      icon: "auto_awesome",
      title: "AI-Powered Picks",
      description: "Smart tailored recommendations calibrated to your unique travel aesthetics, preferences, and itinerary."
    },
    {
      icon: "shield",
      title: "Secure Global Payments",
      description: "Bank-level encryption with multi-currency checkout, flexible cancellation options, and instant confirmation."
    }
  ];

  return (
    <section id="why-us" className="w-full bg-primary text-surface-white py-20 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-tertiary-fixed/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold text-tertiary-fixed uppercase tracking-widest block mb-2">The StaySphere Standard</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Why Choose StaySphere</h2>
          <p className="text-sm md:text-base text-surface-white/80 max-w-2xl mx-auto font-medium">
            Experience the pinnacle of luxury travel with our exclusive benefits, curated villas, and world-class concierge service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface-white/10 hover:bg-surface-white/15 transition-all duration-300 border border-surface-white/10 group transform hover:-translate-y-1 shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-tertiary-fixed" data-icon={item.icon}>{item.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-tertiary-fixed transition-colors">{item.title}</h3>
              <p className="text-surface-white/75 text-xs leading-relaxed font-normal">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
