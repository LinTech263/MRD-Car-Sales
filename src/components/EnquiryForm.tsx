import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { Car, DealershipSettings, LeadType } from '../types';
import { storage } from '../services/storage';
import { formatUSD, getWhatsAppLink } from '../theme';
import { trackEvent } from '../services/analytics';

interface EnquiryFormProps {
  car?: Car;
  settings: DealershipSettings;
  mode?: 'enquire' | 'offer' | 'viewing' | 'general';
  onSuccess?: () => void;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  car,
  settings,
  mode = 'enquire',
  onSuccess,
  className = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  const [offerUSD, setOfferUSD] = useState<string>('');
  const [viewingDate, setViewingDate] = useState('');
  const [interestedInFinance, setInterestedInFinance] = useState(false);
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInMake, setTradeInMake] = useState('');
  const [tradeInModel, setTradeInModel] = useState('');
  const [tradeInYear, setTradeInYear] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam trap

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{ id: string; fullName: string; phone: string } | null>(null);

  // Validate Zimbabwean phone format
  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '');
    // Zimbabwean format: starts with +263 or 07 or 263
    return /^(\+?263\d{9}|07\d{8}|024\d{7})$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Spam honeypot trap
    if (honeypot.trim() !== '') {
      return;
    }

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!phone.trim()) {
      setError('Please provide your phone or WhatsApp number.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please provide a valid phone number (e.g., +263 77 123 4567 or 0771234567).');
      return;
    }

    if (!consent) {
      setError('Please confirm consent for MRD Car Sales to contact you.');
      return;
    }

    let leadType: LeadType = 'Car enquiry';
    if (mode === 'offer') leadType = 'Offer';
    else if (mode === 'viewing') leadType = 'Viewing request';
    else if (mode === 'general') leadType = 'General contact';

    setSubmitting(true);

    try {
      const parsedOffer = offerUSD ? parseFloat(offerUSD.replace(/[^\d.]/g, '')) : undefined;

      const created = storage.addLead({
        type: leadType,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContactMethod: preferredContact,
        carId: car?.id,
        carTitle: car ? `${car.year} ${car.make} ${car.model} ${car.trim}` : undefined,
        carCoverImage: car ? car.images[0] : undefined,
        askingPriceUSD: car?.askingPriceUSD,
        offerUSD: parsedOffer,
        preferredViewingDate: viewingDate || undefined,
        interestedInFinance,
        hasTradeIn,
        tradeInDetails: hasTradeIn ? {
          make: tradeInMake.trim(),
          model: tradeInModel.trim(),
          year: tradeInYear.trim(),
        } : undefined,
        message: message.trim() || undefined,
        consentGiven: true,
      });

      // Track analytics event
      if (mode === 'offer') {
        trackEvent('offer_submit', { carId: car?.id, offerUSD: parsedOffer }, settings);
      } else {
        trackEvent('lead_submit', { type: leadType, carId: car?.id }, settings);
      }

      setSubmittedLead({ id: created.id, fullName: created.fullName, phone: created.phone });
      onSuccess?.();
    } catch {
      setError('Could not submit enquiry. Please call or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppInstantFollowup = () => {
    trackEvent('whatsapp_click', { source: 'enquiry_success' }, settings);
    let msg = `Hello MRD Car Sales, I just submitted an enquiry on your website.\nName: ${fullName}\nPhone: ${phone}`;
    if (car) {
      msg += `\nVehicle: ${car.year} ${car.make} ${car.model} (${formatUSD(car.askingPriceUSD)})`;
    }
    if (offerUSD) {
      msg += `\nMy Offer: $${offerUSD} USD`;
    }
    const link = getWhatsAppLink(settings.whatsapp, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Success State View
  if (submittedLead) {
    return (
      <div className={`p-6 sm:p-8 bg-white border border-emerald-200 rounded-xl space-y-4 ${className}`}>
        <div className="flex items-center gap-3 text-emerald-700">
          <CheckCircle2 className="w-7 h-7 shrink-0" />
          <div>
            <h4 className="font-heading text-lg font-bold">Enquiry Received</h4>
            <p className="text-xs text-emerald-800">
              Thank you, {submittedLead.fullName}. Reference ID: #{submittedLead.id.slice(-6)}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Our sales team in Mount Pleasant will contact you on{' '}
          <strong className="text-slate-900">{preferredContact}</strong> ({submittedLead.phone}) within 2 hours during showroom opening times.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppInstantFollowup}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp Now for Faster Reply</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-slate-800 ${className}`}>
      {/* Honeypot field (hidden from screen, catches bots) */}
      <input
        type="text"
        name="dealership_code_trap"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode-specific Notice */}
      {mode === 'offer' && car && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs text-amber-900">
          <p className="font-semibold">Making an Offer on {car.year} {car.make} {car.model}</p>
          <p className="text-slate-600 mt-0.5">
            Listed Asking Price: <strong className="font-tabular">{formatUSD(car.askingPriceUSD)}</strong>. Enter your proposed USD figure below.
          </p>
        </div>
      )}

      {/* Name and Phone (Required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Farai Moyo"
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+263 77 123 4567"
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none font-tabular"
          />
        </div>
      </div>

      {/* Email & Preferred Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-lg">
            {(['WhatsApp', 'Call', 'Email'] as const).map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPreferredContact(method)}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                  preferredContact === method
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offer in USD (Shown in Offer mode or optional) */}
      {(mode === 'offer' || mode === 'enquire') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {mode === 'offer' ? 'Your Offer in USD ($) *' : 'Your Offer in USD (Optional)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-semibold">$</span>
              <input
                type="text"
                value={offerUSD}
                onChange={(e) => setOfferUSD(e.target.value)}
                placeholder={car ? (car.askingPriceUSD * 0.95).toFixed(0) : '40000'}
                className="w-full text-xs pl-7 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none font-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Preferred Viewing Date (Optional)
            </label>
            <input
              type="date"
              value={viewingDate}
              onChange={(e) => setViewingDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>
        </div>
      )}

      {/* Trade-in & Finance Options */}
      <div className="space-y-2 pt-1 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={hasTradeIn}
            onChange={(e) => setHasTradeIn(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
          />
          <span>I have a vehicle I want to trade in against this purchase</span>
        </label>

        {hasTradeIn && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
            <input
              type="text"
              placeholder="Trade-in Make (e.g. Toyota)"
              value={tradeInMake}
              onChange={(e) => setTradeInMake(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="Model (e.g. Fortuner)"
              value={tradeInModel}
              onChange={(e) => setTradeInModel(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="Year (e.g. 2019)"
              value={tradeInYear}
              onChange={(e) => setTradeInYear(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            />
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={interestedInFinance}
            onChange={(e) => setInterestedInFinance(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
          />
          <span>Interested in dealership escrow or corporate asset financing guidance</span>
        </label>
      </div>

      {/* Optional Message */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Additional Notes or Questions (Optional)
        </label>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Any questions on duty clearance, mechanical inspection, or viewing time..."
          className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
        ></textarea>
      </div>

      {/* Data Protection Consent */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-500 leading-snug">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 shrink-0"
          />
          <span>
            I agree to MRD Car Sales contacting me regarding this enquiry. In compliance with Zimbabwe's Cyber & Data Protection Act, your details are strictly private and never shared.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors disabled:opacity-50"
      >
        <span>
          {submitting
            ? 'Transmitting Enquiry...'
            : mode === 'offer'
            ? 'Submit Offer to Owner'
            : mode === 'viewing'
            ? 'Request Viewing Appointment'
            : 'Check Availability & Enquire'}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
