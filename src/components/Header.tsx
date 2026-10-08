import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { DealershipSettings } from '../types';
import { storage } from '../services/storage';
import { getWhatsAppLink } from '../theme';
import { trackEvent } from '../services/analytics';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onToggleCurrency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  settings,
  currencyMode,
  onToggleCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateSaved = () => {
      setSavedCount(storage.getSavedCarIds().length);
    };
    updateSaved();
    window.addEventListener('mrd_saved_updated', updateSaved);
    return () => window.removeEventListener('mrd_saved_updated', updateSaved);
  }, []);

  const navLinks = [
    { label: 'Inventory', path: '/inventory' },
    { label: 'Sell Your Car', path: '/sell-your-car' },
    { label: 'Request a Car', path: '/request-a-car' },
    { label: 'Guides', path: '/guides' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { source: 'header' }, settings);
    const link = getWhatsAppLink(
      settings.whatsapp,
      `Hello MRD Car Sales, I am browsing your showroom website from Mount Pleasant, Harare, and would like to make an enquiry.`
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCallClick = () => {
    trackEvent('call_click', { source: 'header' }, settings);
    window.location.href = `tel:${settings.phone}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
              className="flex flex-col group cursor-pointer focus:outline-none"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  MRD
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
              </div>
              <span className="text-[10px] tracking-[0.25em] font-medium text-slate-500 uppercase">
                CAR SALES · HARARE
              </span>
            </a>

            {/* Zone 2: 4-6 clean text navigation links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`text-sm font-medium transition-colors hover:text-slate-900 focus:outline-none ${
                      isActive ? 'text-amber-700 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: 1-2 primary actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Optional ZiG Currency Toggle if enabled in Settings */}
              {settings.enableZiGDisplay && (
                <button
                  onClick={onToggleCurrency}
                  title="Toggle USD / ZiG price display"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-slate-700 hover:bg-gray-100 transition-colors"
                >
                  <span className={currencyMode === 'USD' ? 'text-amber-700 font-bold' : 'text-slate-500'}>USD</span>
                  <span className="text-gray-300">/</span>
                  <span className={currencyMode === 'ZiG' ? 'text-amber-700 font-bold' : 'text-slate-500'}>ZiG</span>
                </button>
              )}

              {/* Saved Cars Icon */}
              <button
                onClick={() => handleNavClick('/saved')}
                className="relative p-2 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors"
                title="View saved cars"
              >
                <Heart className="w-5 h-5 text-slate-700" />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>

              {/* Phone quick call (Desktop) */}
              <button
                onClick={handleCallClick}
                className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                title="Call MRD Car Sales"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-tabular">{settings.phone}</span>
              </button>

              {/* Gold WhatsApp CTA */}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all focus:outline-none"
              >
                <MessageCircle className="w-4 h-4 text-slate-900" />
                <span className="hidden sm:inline">WhatsApp Us</span>
                <span className="sm:hidden">WhatsApp</span>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className="w-full text-left py-2.5 px-3 text-base font-medium text-slate-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={handleCallClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-800 bg-gray-100 rounded-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call {settings.phone}</span>
              </button>
              {settings.enableZiGDisplay && (
                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600 bg-gray-50 rounded-lg">
                  <span>Display Currency:</span>
                  <button
                    onClick={onToggleCurrency}
                    className="font-bold text-amber-700 px-2 py-1 bg-white border border-gray-200 rounded"
                  >
                    {currencyMode} (Click to switch)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Action Bar (<= 15% mobile viewport cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center gap-2 shadow-lg">
        <button
          onClick={handleCallClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4 text-slate-600" />
          <span>Call</span>
        </button>

        <button
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => handleNavClick('/inventory')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Browse Cars</span>
        </button>
      </div>
    </>
  );
};
