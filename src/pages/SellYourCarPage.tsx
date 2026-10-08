import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCw, MessageCircle, ArrowRight } from 'lucide-react';
import { DealershipSettings, Lead } from '../types';
import { storage } from '../services/storage';
import { updatePageSEO } from '../services/seo';
import { trackEvent } from '../services/analytics';
import { getWhatsAppLink } from '../theme';

interface SellYourCarPageProps {
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const SellYourCarPage: React.FC<SellYourCarPageProps> = ({ settings, onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [askingPriceUSD, setAskingPriceUSD] = useState('');
  const [isTradeIn, setIsTradeIn] = useState(false);
  const [targetVehicleNotes, setTargetVehicleNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Sell Your Car or Trade-In in Harare | MRD Car Sales',
        description:
          'Get a valuation on your executive or luxury car in Harare. Transparent cash offer or trade-in against our Mount Pleasant showroom floor.',
        canonicalUrl: `${window.location.origin}/sell-your-car`,
      },
      settings
    );
  }, [settings]);

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (uploadedPhotos.length + files.length > 6) {
      setError('You can upload a maximum of 6 photos.');
      return;
    }
    // Simulate local thumbnail previews via FileReader
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setUploadedPhotos((prev) => [...prev, loadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !make.trim() || !model.trim() || !year.trim()) {
      setError('Please fill in your name, contact phone, and vehicle details.');
      return;
    }

    if (!consent) {
      setError('Please agree to data processing consent.');
      return;
    }

    setSubmitting(true);
    try {
      const lead = storage.addLead({
        type: 'Sell/Trade-in',
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContactMethod: preferredContact,
        hasTradeIn: isTradeIn,
        tradeInDetails: {
          make: make.trim(),
          model: model.trim(),
          year: year.trim(),
          mileage: mileage.trim() || undefined,
          condition,
          askingPrice: askingPriceUSD ? `$${askingPriceUSD} USD` : undefined,
          photos: uploadedPhotos,
        },
        message: `${notes} ${isTradeIn ? `Interested in trading against: ${targetVehicleNotes}` : ''}`.trim(),
        consentGiven: true,
      });

      trackEvent('lead_submit', { type: 'Sell/Trade-in', isTradeIn }, settings);
      setSubmittedLead(lead);
    } catch {
      setError('Could not process submission. Please contact our sales yard directly.');
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
          Valuation Request Received
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          Thank you, <strong>{fullName}</strong>. Our valuation manager will review your {year} {make} {model} and contact you via <strong>{preferredContact}</strong> ({phone}) with a provisional valuation within 4 hours.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              const msg = `Hello MRD Car Sales, I just submitted a valuation/trade-in request on your website for my ${year} ${make} ${model}.\nName: ${fullName}`;
              window.open(getWhatsAppLink(settings.whatsapp, msg), '_blank');
            }}
            className="px-6 py-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Follow up on WhatsApp</span>
          </button>
          <button
            onClick={() => onNavigate('/inventory')}
            className="px-6 py-3 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Browse Available Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Direct Dealer Acquisition
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sell or Trade In Your Car
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Skip public classifieds and uncertain buyers. MRD buys clean, low-mileage vehicles for fair USD settlement or seamless trade-in credit against our showroom floor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Your Vehicle Information */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Vehicle Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prado or Hilux"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 2021"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mileage (Approx km)
              </label>
              <input
                type="text"
                placeholder="e.g. 45,000 km"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Vehicle Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-gray-300 bg-white outline-none"
              >
                <option value="Excellent">Excellent / Showroom</option>
                <option value="Very Good">Very Good / Minor Wear</option>
                <option value="Good">Good / Well Maintained</option>
                <option value="Fair">Fair / Requires Attention</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Expected Price (USD)
              </label>
              <input
                type="text"
                placeholder="e.g. 35,000"
                value={askingPriceUSD}
                onChange={(e) => setAskingPriceUSD(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none font-tabular"
              />
            </div>
          </div>

          {/* Trade In Switch */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isTradeIn}
                onChange={(e) => setIsTradeIn(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span>I want to trade this car in against a vehicle on MRD's floor</span>
            </label>

            {isTradeIn && (
              <input
                type="text"
                placeholder="Which vehicle on our floor are you interested in? (e.g. 2023 Land Cruiser 300)"
                value={targetVehicleNotes}
                onChange={(e) => setTargetVehicleNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white outline-none"
              />
            )}
          </div>

          {/* Photo Upload Simulation (up to 6 photos) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Photos of Your Vehicle (Up to 6 photos)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-600 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                Click to select exterior and interior photos (Max 6 images, under 5MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUploadSim}
                className="mt-2 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
              />
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedPhotos.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] w-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Your Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rumbidzai Matongo"
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
                Email Address (Optional)
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
                Preferred Response Channel
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

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Additional Details (Service history, license validity, ZIMRA clearance status)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Full service history with Zimoco/Croco Motors, duty fully cleared, licensed till December..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 outline-none"
            ></textarea>
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
              I confirm the details provided are accurate and authorize MRD Car Sales to contact me regarding vehicle appraisal.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>{submitting ? 'Submitting Valuation...' : 'Submit Vehicle for Valuation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
