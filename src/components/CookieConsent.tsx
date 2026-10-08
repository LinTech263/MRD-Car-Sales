import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mrd_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mrd_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('mrd_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-xl text-xs text-slate-700 space-y-3">
      <div className="flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          We use local storage and non-invasive telemetry to remember saved cars and improve your browsing experience. In compliance with Zimbabwe's Cyber & Data Protection Act.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
