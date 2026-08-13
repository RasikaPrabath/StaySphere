import React, { useState } from 'react';

export default function Newsletter({ onAddToast }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    onAddToast && onAddToast(`Subscribed! Exclusive travel guides sent to ${email}`);
    setEmail("");
  };

  return (
    <section className="w-full bg-surface-container-low py-16 border-t border-outline-variant/30">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="material-symbols-outlined text-4xl text-secondary mb-2" data-icon="mark_email_unread">
          mark_email_unread
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3 tracking-tight">
          Get inspiration for your next trip
        </h2>

        <p className="text-xs md:text-sm text-on-surface-variant mb-8 font-medium">
          Sign up for our newsletter to receive exclusive luxury offers, hidden gem guides, and VIP invitations.
        </p>

        {subscribed ? (
          <div className="bg-success/10 border border-success/30 text-success p-4 rounded-2xl font-bold text-xs max-w-md mx-auto flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>You're on the VIP list! Check your inbox shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-grow rounded-2xl border border-outline-variant px-5 py-3.5 text-xs font-semibold focus:ring-2 focus:ring-secondary focus:border-secondary outline-none shadow-sm"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-surface-white font-bold text-xs rounded-2xl px-8 py-3.5 transition-all shadow-md whitespace-nowrap active:scale-95"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
