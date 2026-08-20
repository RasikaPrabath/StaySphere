import React from 'react';

export default function MyBookingsModal({ isOpen, onClose, user, userBookings = [], selectedCurrency, onAddToast }) {
  if (!isOpen) return null;

  
  const mockBookings = userBookings.length > 0 ? userBookings : [
    {
      id: "bk-982145",
      reference: "STAY-982145",
      propertyName: "The Grand Horizon Resort & Spa",
      roomType: "Deluxe Ocean View Suite",
      city: "Bentota, Sri Lanka",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      checkIn: "2026-08-20",
      checkOut: "2026-08-24",
      guests: "2 Adults, 1 Room",
      totalPrice: 480.00,
      status: "Confirmed",
      bookedOn: "2026-08-10"
    },
    {
      id: "bk-661204",
      reference: "STAY-661204",
      propertyName: "Ceylon Tea Trails Chalet",
      roomType: "Heritage Garden Suite",
      city: "Nuwara Eliya, Sri Lanka",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
      checkIn: "2026-06-12",
      checkOut: "2026-06-15",
      guests: "2 Adults",
      totalPrice: 390.00,
      status: "Completed",
      bookedOn: "2026-06-01"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-gray-150 relative max-h-[90vh] flex flex-col animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">confirmation_number</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 font-inter">My Stay Reservations</h2>
              <p className="text-xs text-gray-500 font-medium">View and manage your confirmed trips and vouchers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {mockBookings.map((bk) => (
            <div key={bk.id} className="border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-all flex flex-col md:flex-row gap-4 bg-gray-50/50">
              <div
                className="w-full md:w-44 h-32 rounded-xl bg-cover bg-center shrink-0 shadow-sm"
                style={{ backgroundImage: `url(${bk.image})` }}
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      Ref: {bk.reference}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${bk.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                      {bk.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-800">{bk.propertyName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                    {bk.city} • {bk.roomType}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm text-gray-400">calendar_month</span>
                      {bk.checkIn} → {bk.checkOut}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium text-gray-500">{bk.guests}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-gray-900">
                      ${bk.totalPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onAddToast && onAddToast(`Booking voucher ${bk.reference} downloaded`)}
                      className="px-3 py-1.5 bg-[#0058bc] hover:bg-[#003580] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      Voucher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
