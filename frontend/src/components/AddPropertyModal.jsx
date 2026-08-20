import React, { useState } from 'react';
import { hotelApi } from '../data/api';

export default function AddPropertyModal({ onClose, onPropertyAdded }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Category
    category: 'Hotel',
    
    // Step 2: Basic Info & Location
    name: '',
    starRating: 4,
    description: '',
    address: '',
    city: 'Colombo',
    postalCode: '',
    country: 'Sri Lanka',

    // Step 3: Room Setup & Pricing
    roomType: 'Deluxe Room',
    roomQuantity: 5,
    bedType: '1 King Bed',
    maxOccupancy: 2,
    pricePerNight: 150,

    // Step 4: Amenities
    amenities: ['Free High-Speed WiFi', 'Air Conditioning', 'Breakfast Included'],

    // Step 5: Photos
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    newImageUrl: '',

    // Step 6: Policies & Payout
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Flexible (Free cancellation up to 24h before)',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const propertyTypes = [
    { id: 'Hotel', label: 'Hotel', icon: 'hotel', desc: 'Standard hotel with reception and room service' },
    { id: 'Resort', label: 'Resort', icon: 'resort', desc: 'Luxury resort with pool, spa, and full amenities' },
    { id: 'Villa', label: 'Villa / Chalet', icon: 'villa', desc: 'Private luxury house or villa' },
    { id: 'Guest House', label: 'Guest House / B&B', icon: 'guesthouse', desc: 'Cozy guest house with bed and breakfast' },
    { id: 'Apartment', label: 'Apartment', icon: 'apartment', desc: 'Self-contained serviced apartment' }
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
      name: formData.name || "New Luxury Stay",
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
      // Attempt backend submission
      let created = null;
      try {
        created = await hotelApi.createHotel(payload);
      } catch (err) {
        console.warn("Backend hotel creation API unavailable, simulating local creation", err);
      }

      const newHotelObj = created || {
        id: `owner-prop-${Date.now()}`,
        title: formData.name || "New Luxury Stay",
        location: `${formData.city}, ${formData.country}`,
        occupancy: "100%",
        occColor: "bg-emerald-500",
        image: formData.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        revenue: "$0",
        rooms: `${formData.roomQuantity} Rooms`,
        price: `$${formData.pricePerNight} / night`,
        status: "Active"
      };

      if (onPropertyAdded) {
        onPropertyAdded(newHotelObj);
      }
      onClose();
    } catch (error) {
      console.error("Error creating hotel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-white w-full max-w-3xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-outline-variant relative">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-white sticky top-0 z-10">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Booking.com Partner Onboarding
            </span>
            <h2 className="text-xl font-extrabold text-primary">List Your Property on StaySphere</h2>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-surface-container-low px-6 py-3 border-b border-outline-variant flex items-center justify-between">
          {[
            { num: 1, label: 'Category' },
            { num: 2, label: 'Basic Info' },
            { num: 3, label: 'Rooms & Price' },
            { num: 4, label: 'Amenities' },
            { num: 5, label: 'Photos' },
            { num: 6, label: 'Policies' }
          ].map((s) => (
            <div 
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-2 cursor-pointer transition-all ${currentStep === s.num ? 'text-primary font-bold' : currentStep > s.num ? 'text-success font-semibold' : 'text-on-surface-variant/60'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === s.num ? 'bg-primary text-white' : currentStep > s.num ? 'bg-success text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          
          {/* STEP 1: Category & Type */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 1: What type of property are you listing?</h3>
              <p className="text-xs text-on-surface-variant">Select the primary category that best describes your accommodation.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleInputChange('category', type.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${formData.category === type.id ? 'border-primary bg-primary/5 shadow-md' : 'border-outline-variant/60 hover:border-outline-variant'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.category === type.id ? 'bg-primary text-white' : 'bg-surface-container text-primary'}`}>
                      <span className="material-symbols-outlined">{type.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">{type.label}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info & Location */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 2: Property Details & Location</h3>
              <p className="text-xs text-on-surface-variant">Enter the name and address your guests will see when searching.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Horizon Luxury Resort & Spa"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Star Rating</label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => handleInputChange('starRating', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value={5}>5 Star Luxury</option>
                    <option value={4}>4 Star Deluxe</option>
                    <option value={3}>3 Star Standard</option>
                    <option value={2}>2 Star Budget</option>
                    <option value={1}>1 Star Guest Lodge</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">City / Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo, Kandy, Ella, Galle"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 Galle Road, Kollupitiya"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-1">Property Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your property, views, highlights and nearby attractions..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Rooms & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 3: Room Configuration & Pricing</h3>
              <p className="text-xs text-on-surface-variant">Set up your main room type, capacity, and base price per night.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Main Room Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Double Room with Ocean View"
                    value={formData.roomType}
                    onChange={(e) => handleInputChange('roomType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Quantity Available</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.roomQuantity}
                    onChange={(e) => handleInputChange('roomQuantity', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Bed Configuration</label>
                  <select
                    value={formData.bedType}
                    onChange={(e) => handleInputChange('bedType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="1 King Bed">1 King Bed</option>
                    <option value="1 Queen Bed">1 Queen Bed</option>
                    <option value="2 Twin Beds">2 Twin Beds</option>
                    <option value="2 Double Beds">2 Double Beds</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Max Occupancy (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxOccupancy}
                    onChange={(e) => handleInputChange('maxOccupancy', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-1">Base Price Per Night ($ USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 font-bold text-primary">$</span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.pricePerNight}
                      onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Amenities */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 4: Key Amenities & Facilities</h3>
              <p className="text-xs text-on-surface-variant">Select all amenities available at your property to attract travelers.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {availableAmenities.map((item) => {
                  const isChecked = formData.amenities.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${isChecked ? 'border-primary bg-primary/10 font-bold text-primary shadow-sm' : 'border-outline-variant/60 text-on-surface-variant hover:border-outline-variant'}`}
                    >
                      <span className="material-symbols-outlined text-lg text-secondary">{item.icon}</span>
                      <span className="text-xs">{item.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Photos */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 5: High-Quality Property Photos</h3>
              <p className="text-xs text-on-surface-variant">Add photo URLs for your hotel exterior, rooms, and facilities.</p>

              {/* Add image input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  value={formData.newImageUrl}
                  onChange={(e) => handleInputChange('newImageUrl', e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors shrink-0"
                >
                  + Add Photo
                </button>
              </div>

              {/* Photos grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-surface-container border border-outline-variant shadow-sm">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        Primary Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Policies & Payout */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-primary">Step 6: House Policies & Payout Details</h3>
              <p className="text-xs text-on-surface-variant">Configure Check-in/out times and bank account details for payouts.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Check-In Time</label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Check-Out Time</label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-primary block mb-1">Cancellation Policy</label>
                  <select
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-white text-sm text-primary"
                  >
                    <option value="Flexible">Flexible (Free cancellation up to 24 hours before check-in)</option>
                    <option value="Moderate">Moderate (Free cancellation up to 5 days before check-in)</option>
                    <option value="Strict">Strict (Non-refundable / 50% cancellation fee)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 border-t border-outline-variant/60 pt-4 mt-2">
                  <h4 className="text-sm font-bold text-primary mb-2">Partner Payout Bank Account</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Bank Name (e.g. Commercial Bank)"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary"
                    />
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      value={formData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-outline-variant text-xs text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-white flex justify-between items-center sticky bottom-0">
          <button
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-primary disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            Back
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-7 py-2.5 bg-secondary text-primary text-xs font-extrabold rounded-xl hover:brightness-105 shadow-lg transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Publishing Property...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Complete & Open for Bookings</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
