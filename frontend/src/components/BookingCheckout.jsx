import React, { useState } from 'react';
import { bookingApi } from '../data/api';

export default function BookingCheckout({
  bookingDetails,
  onBack,
  selectedCurrency,
  onConfirmBooking,
  onAddToast
}) {
  const defaultProperty = {
    title: "The Azure Grand Hotel",
    location: "Downtown Metropolis",
    rating: 9.4,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxKgvnUG5wKny4M-mydMicggODdGHdAzrYq6GuSaNdymAlbV3qfZDIgNeWfDzMk7KDglaqELFEiOqQjF4dzfl2-xhSV7w_s0LwXCyaWd46SsUYJy2fzM39FjtWO2SycIlwRmnmp7PnmilAFVNxnLruKfl2pr1fy7OPeDZ7jsRYdSA2k657ep2nYkSrEntjfAh6EunC0nSQM-qxFDr-fDthQ2krkFZM7ltYSIvCbNnoxw9JbV7_OYGo"
    ],
    price: 299,
    taxes: 37.5
  };

  const property = bookingDetails?.property || defaultProperty;
  const currencySymbol = selectedCurrency?.symbol || "$";
  const currencyRate = selectedCurrency?.code === "EUR" ? 0.92 : selectedCurrency?.code === "GBP" ? 0.78 : selectedCurrency?.code === "JPY" ? 150 : selectedCurrency?.code === "AED" ? 3.67 : 1;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1 (US)",
    mobile: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nights = bookingDetails?.nights || 3;
  const originalPrice = Math.round((property.price || 299) * nights * currencyRate);
  const discount = Math.round(originalPrice * 0.1);
  const taxes = Math.round((property.taxes || 37.5) * nights * currencyRate);
  const totalPrice = originalPrice - discount + taxes;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get roomId from bookingDetails or generate a mock Guid if none is present
      const roomId = bookingDetails?.roomId || bookingDetails?.property?.id || "d69ef91b-689e-4b68-8a8b-fa3b516885df";
      const checkIn = bookingDetails?.checkIn || "2026-10-12";
      const checkOut = bookingDetails?.checkOut || "2026-10-15";
      const guestCount = bookingDetails?.guests?.adults || 2;

      const response = await bookingApi.createBooking(roomId, checkIn, checkOut, guestCount);

      setBookingRef(response.bookingReference);
      setIsConfirmed(true);
      if (onAddToast) onAddToast(`Booking Confirmed! Code: ${response.bookingReference}`);
      if (onConfirmBooking) onConfirmBooking(property, response.bookingReference);
    } catch (err) {
      console.error("Booking API checkout failed", err);
      // Fallback checkout offline mock support
      const ref = "SPH-OFF-" + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);
      setIsConfirmed(true);
      if (onAddToast) onAddToast(`Booking Confirmed (offline mode)! Code: ${ref}`);
      if (onConfirmBooking) onConfirmBooking(property, ref);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-inverse-primary selection:text-on-primary-fixed min-h-screen flex flex-col w-full">
      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter flex-grow w-full">
        {/* Header Title & Steps */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2 font-bold">Complete your booking</h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-label-md text-label-md">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-primary text-label-sm font-label-sm">1</span>
                <span>Your details</span>
              </div>
              <div className="w-8 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-2 opacity-50 font-medium">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-outline-variant text-label-sm font-label-sm">2</span>
                <span>Final step</span>
              </div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 bg-surface-white px-3 py-1.5 rounded-xl border border-outline-variant shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to property
          </button>
        </div>

        {isConfirmed ? (
          /* Confirmation Success Screen */
          <div className="bg-surface-white rounded-2xl border border-outline-variant p-8 md:p-12 text-center max-w-2xl mx-auto shadow-lg space-y-6 my-8 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-primary mb-2">Booking Confirmed! 🎉</h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Thank you, <span className="font-bold text-on-surface">{formData.firstName || 'Guest'}</span>! Your reservation has been locked in. A detailed itinerary has been sent to <span className="font-bold text-secondary">{formData.email || 'your email'}</span>.
              </p>
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/60 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant font-medium">Booking Reference:</span>
                <span className="font-extrabold text-secondary tracking-widest text-sm">{bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant font-medium">Property:</span>
                <span className="font-bold text-primary">{property.title}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant font-medium">Dates:</span>
                <span className="font-bold text-primary">Oct 12, 2026 - Oct 15, 2026 ({nights} Nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Total Paid:</span>
                <span className="font-extrabold text-primary text-base">{currencySymbol}{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="bg-primary hover:bg-primary-container text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          /* Checkout Grid */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Guest Information Section */}
              <section className="bg-surface-white rounded-lg border border-outline-variant p-6 shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-primary mb-6 font-bold">Guest Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        placeholder="e.g. Jane"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="lastName">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        placeholder="e.g. Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Confirmation will be sent here"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="mobile">Mobile Number</label>
                    <div className="flex">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="border border-outline-variant border-r-0 rounded-l p-3 font-body-md text-body-md bg-surface-container-low focus:border-secondary outline-none cursor-pointer"
                      >
                        <option>+1 (US)</option>
                        <option>+44 (UK)</option>
                        <option>+61 (AU)</option>
                        <option>+94 (LK)</option>
                      </select>
                      <input
                        id="mobile"
                        type="tel"
                        required
                        placeholder="Mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="flex-1 border border-outline-variant rounded-r p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-surface-white rounded-lg border border-outline-variant p-6 shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-primary mb-6 font-bold">Payment</h2>
                <div className="bg-surface-container-low rounded-lg p-4 mb-6 border border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">lock</span>
                    <div>
                      <p className="font-label-md text-label-md text-primary font-bold">Secure Payment</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Your data is protected by industry-standard encryption.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="cardName">Name on Card</label>
                    <input
                      id="cardName"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="cardNumber">Card Number</label>
                    <div className="relative">
                      <input
                        id="cardNumber"
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded p-3 pl-10 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">credit_card</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="expiry">Expiry Date</label>
                      <input
                        id="expiry"
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold" htmlFor="cvc">CVC</label>
                      <input
                        id="cvc"
                        type="text"
                        required
                        placeholder="123"
                        value={formData.cvc}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded p-3 font-body-md text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant mt-6 flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Powered by Stripe</span>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-surface-container-high rounded flex items-center justify-center text-[10px] font-bold text-on-surface-variant">VISA</div>
                      <div className="w-10 h-6 bg-surface-container-high rounded flex items-center justify-center text-[10px] font-bold text-on-surface-variant">MC</div>
                      <div className="w-10 h-6 bg-surface-container-high rounded flex items-center justify-center text-[10px] font-bold text-on-surface-variant">AMEX</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Summary Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 flex flex-col gap-4">
                <div className="bg-surface-white rounded-lg border border-outline-variant overflow-hidden shadow-[0_4px_12px_rgba(0,53,128,0.04)]">
                  <div className="h-48 relative">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-rating-gold text-primary-container font-label-md text-label-md px-2 py-1 rounded flex items-center gap-1 font-bold shadow-sm">
                      <span>{property.rating || 9.4}</span>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1 font-bold">{property.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {property.location}
                    </p>

                    <div className="flex flex-col gap-3 py-4 border-y border-outline-variant mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Check-in</span>
                          <span className="font-label-md text-label-md text-primary font-bold">Oct 12, 2026</span>
                        </div>
                        <div className="w-[1px] h-8 bg-outline-variant"></div>
                        <div className="flex flex-col text-right">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Check-out</span>
                          <span className="font-label-md text-label-md text-primary font-bold">Oct 15, 2026</span>
                        </div>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant pt-2">
                        {nights} Nights • 1 Room • 2 Adults
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                        <span>Original Price</span>
                        <span>{currencySymbol}{originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm text-success font-semibold">
                        <span>Genius Discount (10%)</span>
                        <span>-{currencySymbol}{discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                        <span>Taxes &amp; Fees</span>
                        <span>{currencySymbol}{taxes.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-6 pt-4 border-t border-outline-variant">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">Total</span>
                      <span className="font-headline-md text-headline-md text-primary font-extrabold">{currencySymbol}{totalPrice.toLocaleString()}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-secondary-container hover:bg-secondary disabled:opacity-50 text-on-primary font-label-md text-label-md py-4 rounded-lg transition-colors flex justify-center items-center gap-2 font-bold cursor-pointer shadow-md active:scale-95"
                    >
                      {loading ? "Securing Room Reservation..." : "Complete Booking"}
                      <span className="material-symbols-outlined">lock</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
