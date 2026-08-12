import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/mockData';

export default function Testimonials({ onAddToast }) {
  const [stories, setStories] = useState(TESTIMONIALS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", location: "", quote: "", rating: 5 });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      name: newReview.name,
      location: newReview.location,
      rating: newReview.rating,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      quote: newReview.quote
    };
    setStories([item, ...stories]);
    setShowReviewModal(false);
    setNewReview({ name: "", location: "", quote: "", rating: 5 });
    onAddToast && onAddToast("Thank you! Your story has been submitted.");
  };

  return (
    <section className="w-full max-w-container-max mx-auto px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Guest Experiences</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Stories from Our Guests</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Real reviews from travelers who experienced StaySphere hospitality.</p>
        </div>

        <button 
          onClick={() => setShowReviewModal(true)}
          className="mt-4 md:mt-0 font-bold text-xs bg-surface-container-low text-primary border border-outline-variant hover:border-secondary px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">rate_review</span>
          <span>Share Your Story</span>
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="bg-surface-white p-8 rounded-3xl shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div>
              {/* Rating Stars */}
              <div className="flex text-rating-gold mb-4 gap-0.5">
                {[...Array(story.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-lg" data-icon="star">star</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs md:text-sm text-on-surface-variant italic leading-relaxed mb-6 font-medium">
                "{story.quote}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/30">
              <img 
                src={story.avatar} 
                alt={story.name}
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-outline-variant"
              />
              <div>
                <h4 className="font-bold text-sm text-primary">{story.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium">{story.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-outline-variant animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">Share Your Travel Experience</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-primary block mb-1">Your Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius"
                  value={newReview.name}
                  onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">Location / Stay Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Stayed in Santorini, Greece"
                  value={newReview.location}
                  onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                  className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">Your Review</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe your villa, service, or stay..."
                  value={newReview.quote}
                  onChange={e => setNewReview({ ...newReview, quote: e.target.value })}
                  className="w-full border border-outline-variant rounded-xl p-3 text-xs outline-none focus:ring-secondary focus:border-secondary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-white font-bold text-xs py-3.5 rounded-xl hover:bg-secondary-container transition-colors shadow-md"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
