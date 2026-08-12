import React, { useState } from 'react';

export default function BookingModal({ bookingDetails, onClose, selectedCurrency, onConfirmBooking }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "card"
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  if (!bookingDetails) return null;

  const { property, nights, totalEstimated } = bookingDetails;
  const currencySymbol = selectedCurrency?.symbol || "$";

  const handleSubmit = (e) => {
    e.preventDefault();
    const ref = "SPH-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setIsConfirmed(true);
    if (onConfirmBooking) {
      onConfirmBooking(property, ref);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-outline-variant relative animate-slideUp">
        
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-white">
          <div>
            <h2 className="text-xl font-extrabold text-primary">
              {isConfirmed ? "Booking Confirmed! 🎉" : "Complete Your Reservation"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isConfirmed ? `Reference Code: ${bookingRef}` : `${property.title} • ${nights} nights`}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        {isConfirmed ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-primary mb-1">Your Luxury Stay is Locked In</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                A detailed booking itinerary and access code have been sent to your email. StaySphere 24/7 Concierge will contact you prior to arrival.
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Property:</span>
                <span className="font-bold text-primary">{property.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Location:</span>
                <span className="font-bold text-primary">{property.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Total Paid:</span>
                <span className="font-extrabold text-secondary">{currencySymbol}{totalEstimated.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-container text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md"
            >
              Done & Return to Homepage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Summary Banner */}
            <div className="flex items-center gap-4 bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30">
              <img src={property.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-grow">
                <div className="text-xs font-bold text-primary line-clamp-1">{property.title}</div>
                <div className="text-[11px] text-on-surface-variant">{property.location}</div>
                <div className="text-xs font-extrabold text-secondary mt-0.5">
                  Total: {currencySymbol}{totalEstimated.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-primary block mb-1">Full Guest Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-outline-variant rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-outline-variant rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-outline-variant rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">Payment Options</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "card", label: "Credit Card", icon: "credit_card" },
                    { id: "apple", label: "Apple Pay", icon: "account_balance_wallet" },
                    { id: "bank", label: "Wire Transfer", icon: "account_balance" }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${formData.paymentMethod === method.id ? 'border-secondary bg-secondary-fixed/20 text-secondary' : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}
                    >
                      <span className="material-symbols-outlined text-lg">{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirm Submit Button */}
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-container text-white font-bold text-sm py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>Confirm & Complete Reservation ({currencySymbol}{totalEstimated.toLocaleString()})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
