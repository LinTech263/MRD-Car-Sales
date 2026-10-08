import React, { useState } from 'react';
import { Search, CheckCircle2, MessageCircle, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { DealershipSettings, Lead } from '../types';
import { storage } from '../services/storage';
import { updatePageSEO } from '../services/seo';
import { trackEvent } from '../services/analytics';
import { getWhatsAppLink } from '../theme';

interface RequestACarPageProps {
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const RequestACarPage: React.FC<RequestACarPageProps> = ({ settings, onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [budgetUSD, setBudgetUSD] = useState('');
  const [mustHaves, setMustHaves] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Request a Car | Sourcing Service in Harare | MRD Car Sales',
        description:
          'Cannot find the car you want? Tell MRD Car Sales your target model and budget in USD. We inspect and source verified vehicles directly.',
        canonicalUrl: `${window.location.origin}/request-a-car`,
      },
      settings
    );
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !make.trim() || !model.trim()) {
      setError('Please provide your name, phone number, and requested vehicle make and model.');
      return;
    }

    if (!consent) {
      setError('Please agree to data processing consent.');
      return;
    }

    setSubmitting(true);
    try {
      const parsedBudget = budgetUSD ? parseFloat(budgetUSD.replace(/[^\d.]/g, '')) : undefined;

      const lead = storage.addLead({
        type: 'Car request',
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContactMethod: preferredContact,
        carRequestDetails: {
          make: make.trim(),
          model: model.trim(),
          yearMin: yearMin ? parseInt(yearMin, 10) : undefined,
          yearMax: yearMax ? parseInt(yearMax, 10) : undefined,
          budgetUSD: parsedBudget,
          mustHaves: mustHaves.trim() || undefined,
        },
        message: `Budget: ${budgetUSD || 'Flexible'}. Specifications: ${mustHaves}`,
        consentGiven: true,
      });

      trackEvent('lead_submit', { type: 'Car request', make, model, budgetUSD: parsedBudget }, settings);
      setSubmittedLead(lead);
    } catch {
      setError('Could not process request. Please contact our showroom directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedLead) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
          Sourcing Request Received
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          Thank you, <strong>{fullName}</strong>. Our procurement team in Harare has logged your search for a <strong>{make} {model}</strong>. We will contact you on <strong>{preferredContact}</strong> ({phone}) with available matching options.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              const msg = `Hello MRD Car Sales, I submitted a sourcing request on your website for a ${make} ${model} with budget $${budgetUSD} USD.\nName: ${fullName}`;
              window.open(getWhatsAppLink(settings.whatsapp, msg), '_blank');
            }}
            className="px-6 py-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Sourcing Desk</span>
          </button>
          <button
            onClick={() => onNavigate('/inventory')}
            className="px-6 py-3 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Browse Current Floor Stock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Bespoke Vehicle Sourcing
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Request a Specific Car
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Looking for a specific trim, engine configuration, or colour? Our dealership leverages established Japanese, UK, and regional dealer networks to source compliant vehicles delivered to Harare.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Desired Specs */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Desired Vehicle Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lexus or Land Rover"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Model / Trim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LX600 F-Sport or Defender 110"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Min Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2022"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Max Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2024"
                value={yearMax}
                onChange={(e) => setYearMax(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Budget in USD ($)
              </label>
              <input
                type="text"
                placeholder="e.g. 95,000"
                value={budgetUSD}
                onChange={(e) => setBudgetUSD(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Must-Have Features & Preferences (Color, mileage ceiling, options)
            </label>
            <textarea
              rows={3}
              value={mustHaves}
              onChange={(e) => setMustHaves(e.target.value)}
              placeholder="e.g. Black exterior, beige leather interior, sunroof, under 30,000km, duty fully cleared..."
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 outline-none"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tatenda Mugabe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+263 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
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
                        : 'text-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500 pt-2">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 shrink-0"
            />
            <span>
              I authorize MRD Car Sales to source and present matching vehicle proposals.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>{submitting ? 'Submitting Sourcing Request...' : 'Submit Vehicle Request'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
