import React, { useState } from 'react';
import { hotelApi } from '../data/api';

export default function AddPropertyPage({ onBackToDashboard, onPropertyCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Hotel',
    name: '',
    starRating: 4,
    description: '',
    address: '',
    city: 'Colombo',
    postalCode: '',
    country: 'Sri Lanka',

    roomType: 'Deluxe Room',
    roomQuantity: 5,
    bedType: '1 King Bed',
    maxOccupancy: 2,
    pricePerNight: 150,

    amenities: ['Free High-Speed WiFi', 'Air Conditioning', 'Breakfast Included', 'Swimming Pool'],

    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80'
    ],
    newImageUrl: '',

    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Flexible (Free cancellation up to 24h before check-in)',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const propertyTypes = [
    { id: 'Hotel', label: 'Hotel', icon: 'hotel', desc: 'Standard hotel with reception, room service and guest amenities' },
    { id: 'Resort', label: 'Resort & Spa', icon: 'resort', desc: 'Luxury destination resort with pools, restaurants and spa' },
    { id: 'Villa', label: 'Villa / Luxury Chalet', icon: 'villa', desc: 'Private stand-alone luxury villa or holiday chalet' },
    { id: 'Guest House', label: 'Guest House / B&B', icon: 'guesthouse', desc: 'Cozy guest house with personalized host service' },
    { id: 'Apartment', label: 'Serviced Apartment', icon: 'apartment', desc: 'Self-contained apartment with kitchen and amenities' }
  ];

  const availableAmenities = [
    { id: 'Free High-Speed WiFi', icon: 'wifi' },
    { id: 'Air Conditioning', icon: 'ac_unit' },
    { id: 'Swimming Pool', icon: 'pool' },
    { id: 'Free Parking', icon: 'local_parking' },
    { id: 'Breakfast Included', icon: 'free_breakfast' },
    { id: 'Fitness Center / Gym', icon: 'fitness_center' },
    { id: 'Restaurant & Dining', icon: 'restaurant' },
    { id: 'Spa & Wellness', icon: 'spa' },
    { id: 'Airport Shuttle', icon: 'airport_shuttle' },
    { id: 'Ocean / Mountain View', icon: 'landscape' },
    { id: 'Pet Friendly', icon: 'pets' },
    { id: '24/7 Front Desk', icon: 'reception_4' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenityId)
          : [...prev.amenities, amenityId]
      };
    });
  };

  const handleAddImage = () => {
    if (!formData.newImageUrl) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl],
      newImageUrl: ''
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name || "New Luxury Property",
      description: formData.description,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      starRating: formData.starRating,
      category: formData.category,
      pricePerNight: formData.pricePerNight,
      amenities: formData.amenities,
      images: formData.images,
      rooms: [
        {
          type: formData.roomType,
          quantity: formData.roomQuantity,
          bedType: formData.bedType,
          maxOccupancy: formData.maxOccupancy,
          price: formData.pricePerNight
        }
      ]
    };

    try {
      let created = null;
      try {
        created = await hotelApi.createHotel(payload);
      } catch (err) {
        console.warn("Backend hotel creation API unavailable, simulating local creation", err);
      }

      const newHotelObj = created || {
        id: `owner-prop-${Date.now()}`,
        title: formData.name || "New Luxury Hotel",
        location: `${formData.city}, ${formData.country}`,
        occupancy: "0%",
        occColor: "bg-amber-500",
        image: formData.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        revenue: "$0",
        rooms: `${formData.roomQuantity} Rooms`,
        price: `$${formData.pricePerNight} / night`,
        status: "Pending Verification" // Booking.com style Verification status
      };

      if (onPropertyCreated) {
        onPropertyCreated(newHotelObj);
      }
      if (onBackToDashboard) {
        onBackToDashboard();
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans antialiased">
      
      {/* Top Header Bar (Matching Navbar.jsx exact theme) */}
      <header className="bg-[#0a2540] border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-2xl md:text-3xl tracking-tighter leading-none font-inter select-none">
              <span className="text-[#FF385C]">s</span>
              <span className="text-[#38bdf8]">t</span>
              <span className="text-[#FABB05]">a</span>
              <span className="text-[#FF385C]">y</span>
              <span className="text-[#38bdf8]">s</span>
              <span className="text-[#FABB05]">p</span>
              <span className="text-[#FF385C]">h</span>
              <span className="text-[#38bdf8]">e</span>
              <span className="text-[#FABB05]">r</span>
              <span className="text-[#38bdf8]">e</span>
            </span>
            <span className="text-[11px] bg-white/10 text-sky-200 border border-white/15 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Partner Hub • List Property
            </span>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/15"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Save & Exit to Dashboard</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-surface-white border-t border-outline-variant/40 px-4 md:px-6 py-3 shadow-xs">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            {[
              { num: 1, label: 'Property Type' },
              { num: 2, label: 'Basic Info & Location' },
              { num: 3, label: 'Rooms & Pricing' },
              { num: 4, label: 'Amenities' },
              { num: 5, label: 'Photos Gallery' },
              { num: 6, label: 'Policies & Payout' }
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${currentStep === s.num ? 'text-primary font-bold' : currentStep > s.num ? 'text-success font-semibold' : 'text-on-surface-variant/50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === s.num ? 'bg-secondary text-white shadow-md ring-4 ring-secondary/20' : currentStep > s.num ? 'bg-success text-white' : 'bg-surface-container text-on-surface-variant border border-outline-variant'}`}>
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span className="hidden md:inline text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Form Content Area */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* PAGE 1: Category & Type */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 1 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">What type of accommodation are you listing?</h1>
              <p className="text-sm text-on-surface-variant mt-1">Select the primary category that best describes your property to help travelers find you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {propertyTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleInputChange('category', type.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${formData.category === type.id ? 'border-secondary bg-secondary/5 shadow-xl ring-2 ring-secondary/20 scale-[1.01]' : 'border-outline-variant/60 bg-surface-white hover:border-outline-variant hover:shadow-md'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${formData.category === type.id ? 'bg-secondary text-white' : 'bg-surface-container text-secondary border border-outline-variant/40'}`}>
                    <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">{type.label}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 2: Basic Info & Location */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 2 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Property Details & Exact Location</h1>
              <p className="text-sm text-on-surface-variant mt-1">Enter the official name, location, and description as guests will search for it.</p>
            </div>

            <div className="bg-surface-white p-6 md:p-8 rounded-3xl border border-outline-variant space-y-6 shadow-md">
              <div>
                <label className="text-xs font-bold text-primary block mb-2">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Horizon Luxury Resort & Spa"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Star Rating</label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => handleInputChange('starRating', Number(e.target.value))}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  >
                    <option value={5}>5 Star Luxury</option>
                    <option value={4}>4 Star Deluxe</option>
                    <option value={3}>3 Star Standard</option>
                    <option value={2}>2 Star Budget</option>
                    <option value={1}>1 Star Guest Lodge</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-2">City / Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo, Kandy, Ella, Galle, Nuwara Eliya"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-2">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Galle Road, Kollupitiya"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-2">Property Description & Highlights</label>
                <textarea
                  rows={4}
                  placeholder="Describe your property views, location highlights, surroundings and atmosphere..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none resize-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: Rooms & Pricing */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 3 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Room Setup, Capacity & Base Rates</h1>
              <p className="text-sm text-on-surface-variant mt-1">Configure your primary room type, bed arrangements, and base price per night.</p>
            </div>

            <div className="bg-surface-white p-6 md:p-8 rounded-3xl border border-outline-variant space-y-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Main Room Type Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Double Room with Ocean View"
                    value={formData.roomType}
                    onChange={(e) => handleInputChange('roomType', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Quantity Available</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.roomQuantity}
                    onChange={(e) => handleInputChange('roomQuantity', Number(e.target.value))}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Bed Configuration</label>
                  <select
                    value={formData.bedType}
                    onChange={(e) => handleInputChange('bedType', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  >
                    <option value="1 King Bed">1 King Bed</option>
                    <option value="1 Queen Bed">1 Queen Bed</option>
                    <option value="2 Twin Beds">2 Twin Beds</option>
                    <option value="2 Double Beds">2 Double Beds</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Max Occupancy (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxOccupancy}
                    onChange={(e) => handleInputChange('maxOccupancy', Number(e.target.value))}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-outline-variant/60 pt-6">
                <label className="text-xs font-bold text-primary block mb-2">Base Price Per Night ($ USD) *</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-3.5 font-bold text-secondary text-base">$</span>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formData.pricePerNight}
                    onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3.5 bg-surface-white border border-outline-variant rounded-xl text-lg font-extrabold text-primary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: Amenities */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 4 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Select Key Amenities & Services</h1>
              <p className="text-sm text-on-surface-variant mt-1">Check all amenities available to help prospective guests filter your property.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {availableAmenities.map((item) => {
                const isChecked = formData.amenities.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAmenity(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${isChecked ? 'border-secondary bg-secondary/10 font-bold text-primary shadow-md ring-1 ring-secondary/30' : 'border-outline-variant/60 bg-surface-white text-on-surface-variant hover:border-outline-variant'}`}
                  >
                    <span className="material-symbols-outlined text-xl text-secondary">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGE 5: Photos */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 5 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">High-Quality Property Photos</h1>
              <p className="text-sm text-on-surface-variant mt-1">Add photo URLs for your hotel exterior, guest rooms, and surroundings.</p>
            </div>

            <div className="bg-surface-white p-6 md:p-8 rounded-3xl border border-outline-variant space-y-6 shadow-md">
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="Paste photo URL (e.g. https://images.unsplash.com/...)"
                  value={formData.newImageUrl}
                  onChange={(e) => handleInputChange('newImageUrl', e.target.value)}
                  className="flex-grow bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary focus:ring-2 focus:ring-secondary outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-6 py-3.5 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-secondary-container transition-all cursor-pointer shrink-0 shadow-md"
                >
                  + Add Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video bg-surface-container border border-outline-variant shadow-sm">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase">
                        Primary Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 6: Policies & Payout */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold text-secondary uppercase tracking-widest block mb-1">Step 6 of 6</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Policies & Partner Payout Setup</h1>
              <p className="text-sm text-on-surface-variant mt-1">Configure Check-in timings, Cancellation policies and bank details for payouts.</p>
            </div>

            <div className="bg-surface-white p-6 md:p-8 rounded-3xl border border-outline-variant space-y-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Check-In Time</label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-2">Check-Out Time</label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-2">Cancellation Policy</label>
                  <select
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    className="w-full bg-surface-white border border-outline-variant rounded-xl p-3.5 text-sm text-primary font-medium"
                  >
                    <option value="Flexible">Flexible (Free cancellation up to 24 hours before check-in)</option>
                    <option value="Moderate">Moderate (Free cancellation up to 5 days before check-in)</option>
                    <option value="Strict">Strict (Non-refundable / 50% cancellation fee)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-outline-variant/60 pt-6">
                <h3 className="text-sm font-bold text-primary mb-3">Partner Payout Bank Account (LKR / USD)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Bank Name (e.g. Commercial Bank)"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="bg-surface-white border border-outline-variant rounded-xl p-3 text-xs text-primary font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="bg-surface-white border border-outline-variant rounded-xl p-3 text-xs text-primary font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    className="bg-surface-white border border-outline-variant rounded-xl p-3 text-xs text-primary font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer Navigation Bar */}
      <footer className="bg-surface-white border-t border-outline-variant py-4 px-4 md:px-6 sticky bottom-0 z-30 shadow-2xl">
        <div className="max-w-[1000px] mx-auto flex justify-between items-center">
          <button
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-6 py-3 rounded-xl border border-outline-variant text-xs font-bold text-primary disabled:opacity-40 hover:bg-surface-container transition-all cursor-pointer"
          >
            Back Step
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-8 py-3 bg-secondary hover:bg-secondary-container text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next Step</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-9 py-3.5 bg-secondary hover:bg-secondary-container text-white text-xs font-black rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Publishing Property Live...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Complete Registration & Open for Bookings</span>
                </>
              )}
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
