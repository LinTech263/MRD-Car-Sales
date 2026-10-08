import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Shield, ExternalLink } from 'lucide-react';
import { DealershipSettings, Category } from '../types';
import { getWhatsAppLink } from '../theme';
import { trackEvent } from '../services/analytics';

interface FooterProps {
  settings: DealershipSettings;
  categories: Category[];
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, categories, onNavigate }) => {
  const popularBrands = [
    { name: 'Toyota Harare', slug: 'toyota' },
    { name: 'Land Rover Harare', slug: 'land-rover' },
    { name: 'Mercedes-Benz Harare', slug: 'mercedes-benz' },
    { name: 'BMW Harare', slug: 'bmw' },
    { name: 'Ford Harare', slug: 'ford' },
    { name: 'Volkswagen Harare', slug: 'volkswagen' },
  ];

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { source: 'footer' }, settings);
    const link = getWhatsAppLink(
      settings.whatsapp,
      `Hello MRD Car Sales, I am enquiring via your website footer regarding vehicles available in Mount Pleasant, Harare.`
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-slate-50 border-t border-gray-200 text-slate-600 text-sm mt-20 pb-20 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Dealership Brand & Verification */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
                  MRD
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
              </div>
              <span className="text-[10px] tracking-[0.25em] font-medium text-slate-500 uppercase">
                CAR SALES · HARARE
              </span>
            </div>

            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Premium and executive vehicle dealership based in Mount Pleasant, Harare, Zimbabwe.
              Transparent USD pricing, rigorous physical inspection, and complete ownership transfer assistance.
            </p>

            {/* Verified Dealer Badge */}
            <div className="flex items-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-lg max-w-xs text-xs text-slate-700">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Registered Zimbabwean Dealership · Full Duty & ZIMRA Compliant</span>
            </div>

            {settings.socialLinks.autotrader && (
              <a
                href={settings.socialLinks.autotrader}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-medium hover:underline pt-1"
              >
                <span>View our AutoTrader Zimbabwe dealer profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Col 2: Showroom Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Harare Showroom
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {settings.locationAddress}, {settings.suburb}, {settings.city}, Zimbabwe
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-slate-900 font-tabular">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <button onClick={handleWhatsAppClick} className="hover:text-slate-900 font-tabular font-medium text-emerald-700">
                  {settings.whatsapp} (WhatsApp)
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-slate-900 truncate">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-gray-100">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-slate-500">
                  <p>Mon - Fri: {settings.openingHours.weekdays}</p>
                  <p>Sat: {settings.openingHours.saturday}</p>
                  <p>Sun: {settings.openingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Browse by Category */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Vehicle Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/inventory/${cat.slug}`)}
                    className="hover:text-slate-900 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('/inventory')}
                  className="font-medium text-amber-800 hover:text-amber-900 pt-1"
                >
                  View All Inventory →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Makes & Popular Searches */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Popular in Harare
            </h4>
            <ul className="space-y-2 text-xs">
              {popularBrands.map((b) => (
                <li key={b.slug}>
                  <button
                    onClick={() => onNavigate(`/brands/${b.slug}`)}
                    className="hover:text-slate-900 transition-colors text-left"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('/sell-your-car')}
                  className="hover:text-slate-900 transition-colors text-left font-medium text-slate-900"
                >
                  Trade In / Sell Your Car
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/request-a-car')}
                  className="hover:text-slate-900 transition-colors text-left font-medium text-slate-900"
                >
                  Request a Specific Car
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with SEO links, Legal, and Admin Portal */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} MRD Car Sales. All rights reserved.</p>
            <span className="hidden md:inline">·</span>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-900">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/terms')} className="hover:text-slate-900">
              Terms & Duty Notes
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/guides')} className="hover:text-slate-900">
              Car Buying Guides
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/sitemap.xml')} className="hover:text-slate-900">
              Sitemap.xml
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/robots.txt')} className="hover:text-slate-900">
              Robots.txt
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/admin')}
              className="text-[11px] text-slate-500 hover:text-slate-900 px-2 py-1 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors"
            >
              Staff Portal
            </button>
            <span className="text-[11px] text-slate-500">Harare, Zimbabwe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
