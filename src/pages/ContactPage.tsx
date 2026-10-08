import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import { DealershipSettings } from '../types';
import { EnquiryForm } from '../components/EnquiryForm';
import { updatePageSEO } from '../services/seo';
import { getWhatsAppLink } from '../theme';

interface ContactPageProps {
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Contact MRD Car Sales | Mount Pleasant, Harare | +263 77 696 1977',
        description:
          'Get in touch with MRD Car Sales in Mount Pleasant, Harare. Call +263 77 696 1977, chat on WhatsApp, or visit our showroom.',
        canonicalUrl: `${window.location.origin}/contact`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' },
        ],
      },
      settings
    );
  }, [settings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact MRD Car Sales
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Have an enquiry about a specific vehicle, valuation, or sourcing? Reach out via phone, WhatsApp, or drop by our showroom in Mount Pleasant, Harare.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="font-heading text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
            Harare Dealership Details
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Showroom Address</strong>
                <p className="text-slate-600 leading-relaxed mt-0.5">
                  {settings.locationAddress}, {settings.suburb}, {settings.city}, Zimbabwe
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Direct Telephone</strong>
                <a href={`tel:${settings.phone}`} className="text-slate-600 hover:text-slate-900 font-tabular">
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">WhatsApp Business</strong>
                <a
                  href={getWhatsAppLink(settings.whatsapp, 'Hello MRD Car Sales, I am enquiring from your contact page.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-tabular font-medium"
                >
                  {settings.whatsapp}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Email Enquiries</strong>
                <a href={`mailto:${settings.email}`} className="text-slate-600 hover:text-slate-900">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-slate-600">
                <strong className="text-slate-900 block font-semibold">Showroom Opening Hours</strong>
                <p>Monday – Friday: {settings.openingHours.weekdays}</p>
                <p>Saturday: {settings.openingHours.saturday}</p>
                <p>Sunday: {settings.openingHours.sunday}</p>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video relative">
            <iframe
              src={settings.googleMapsEmbedUrl}
              title="MRD Car Sales Map"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Send an Online Message
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Leave your details below and a member of our sales desk in Mount Pleasant will get back to you promptly.
            </p>
          </div>

          <EnquiryForm settings={settings} mode="general" />
        </div>
      </div>
    </div>
  );
};
