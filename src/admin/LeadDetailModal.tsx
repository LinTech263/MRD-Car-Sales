import React, { useState } from 'react';
import { X, Phone, MessageCircle, Mail, DollarSign, CheckCircle2, User, Clock, FileText } from 'lucide-react';
import { Lead, LeadStatus, Car, DealershipSettings } from '../types';
import { storage } from '../services/storage';
import { formatUSD, getWhatsAppLink } from '../theme';

interface LeadDetailModalProps {
  lead: Lead;
  settings: DealershipSettings;
  onClose: () => void;
  onUpdated: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  settings,
  onClose,
  onUpdated,
}) => {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');

  // Look up linked car and private pricing
  const linkedCar = lead.carId ? storage.getCarById(lead.carId) : undefined;
  const privatePricing = lead.carId ? storage.getPrivatePricing(lead.carId) : undefined;

  // Calculate Offer Difference and Profit Margin impact
  const asking = lead.askingPriceUSD || linkedCar?.askingPriceUSD || 0;
  const offer = lead.offerUSD || 0;
  const cost = privatePricing?.costPriceUSD || 0;

  const diffUSD = offer > 0 && asking > 0 ? offer - asking : 0;
  const diffPercent = asking > 0 ? ((diffUSD / asking) * 100).toFixed(1) : '0';

  const marginAtOffer = cost > 0 && offer > 0 ? offer - cost : 0;
  const marginPercentAtOffer = cost > 0 && offer > 0 ? ((marginAtOffer / cost) * 100).toFixed(1) : '0';

  const handleSaveStatusAndNotes = () => {
    storage.updateLead({
      ...lead,
      status,
      notes: notes.trim() || undefined,
    });
    onUpdated();
  };

  const handleMarkContacted = () => {
    setStatus('Contacted');
    storage.updateLead({
      ...lead,
      status: 'Contacted',
      notes: notes.trim() || undefined,
    });
    onUpdated();
  };

  const handleWhatsAppReply = () => {
    let msg = `Hello ${lead.fullName}, thank you for contacting MRD Car Sales in Mount Pleasant, Harare.`;
    if (lead.carTitle) {
      msg += ` Regarding the ${lead.carTitle}`;
      if (lead.offerUSD) {
        msg += ` and your offer of ${formatUSD(lead.offerUSD)}:`;
      } else {
        msg += `:`;
      }
    }
    msg += ` When would you like to arrange a private viewing at our showroom?`;
    window.open(getWhatsAppLink(lead.phone, msg), '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
  };

  const handleEmail = () => {
    if (lead.email) {
      const subject = encodeURIComponent(`Regarding your enquiry at MRD Car Sales`);
      const body = encodeURIComponent(`Dear ${lead.fullName},\n\nThank you for reaching out to MRD Car Sales in Mount Pleasant, Harare...`);
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                {lead.type}
              </span>
              <span className="text-xs text-slate-400">
                Received: {new Date(lead.createdAt).toLocaleString()}
              </span>
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900 mt-1">
              {lead.fullName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleWhatsAppReply}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Reply</span>
            </button>
            <button
              onClick={handleCall}
              className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              <span>Call ({lead.phone})</span>
            </button>
            {lead.email && (
              <button
                onClick={handleEmail}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            )}
            {lead.status === 'New' && (
              <button
                onClick={handleMarkContacted}
                className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg"
              >
                Mark Contacted
              </button>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div>
              <span className="text-slate-400 block font-medium">Telephone</span>
              <strong className="text-slate-900 font-tabular">{lead.phone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email</span>
              <span className="text-slate-800 truncate block">{lead.email || 'None provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Preferred Channel</span>
              <span className="text-amber-800 font-bold">{lead.preferredContactMethod}</span>
            </div>
            {lead.preferredViewingDate && (
              <div>
                <span className="text-slate-400 block font-medium">Viewing Date Requested</span>
                <span className="text-slate-800 font-bold">{lead.preferredViewingDate}</span>
              </div>
            )}
            {lead.interestedInFinance && (
              <div>
                <span className="text-slate-400 block font-medium">Financing Guidance</span>
                <span className="text-emerald-700 font-semibold">Interested</span>
              </div>
            )}
          </div>

          {/* Vehicle & Offer Margin Analysis (If lead is attached to car or offer) */}
          {lead.carTitle && (
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                {lead.carCoverImage && (
                  <img
                    src={lead.carCoverImage}
                    alt={lead.carTitle}
                    className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                  />
                )}
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Linked Vehicle</span>
                  <h4 className="font-heading text-sm font-bold text-slate-900">{lead.carTitle}</h4>
                </div>
              </div>

              {/* Offer vs Asking Comparison */}
              {lead.offerUSD && lead.offerUSD > 0 && (
                <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center p-3 bg-amber-50/60 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Asking Price</span>
                    <strong className="text-slate-800">{formatUSD(asking)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Client Offer</span>
                    <strong className="text-amber-800 text-sm">{formatUSD(offer)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Difference</span>
                    <strong className={diffUSD >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {diffUSD >= 0 ? `+${formatUSD(diffUSD)}` : `-${formatUSD(Math.abs(diffUSD))}`} ({diffPercent}%)
                    </strong>
                  </div>
                </div>
              )}

              {/* Private Profit Preview for Dealership Owner */}
              {privatePricing && lead.offerUSD && lead.offerUSD > 0 && (
                <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Owner Profit Impact (Private)
                    </span>
                    <span className="text-slate-300">
                      Vehicle Cost: <strong>{formatUSD(cost)}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 font-tabular">
                      +{formatUSD(marginAtOffer)} Net Profit
                    </span>
                    <span className="text-[11px] text-slate-400 block font-tabular">
                      Margin: {marginPercentAtOffer}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trade In Details if present */}
          {lead.hasTradeIn && lead.tradeInDetails && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900">Trade-In Vehicle Details</h4>
              <p className="text-slate-700">
                <strong>{lead.tradeInDetails.year} {lead.tradeInDetails.make} {lead.tradeInDetails.model}</strong>
                {lead.tradeInDetails.mileage && ` · ${lead.tradeInDetails.mileage}`}
                {lead.tradeInDetails.condition && ` · ${lead.tradeInDetails.condition}`}
                {lead.tradeInDetails.askingPrice && ` · Expected: ${lead.tradeInDetails.askingPrice}`}
              </p>
            </div>
          )}

          {/* Car Request Details if present */}
          {lead.carRequestDetails && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900">Requested Vehicle Query</h4>
              <p className="text-slate-700">
                <strong>{lead.carRequestDetails.make} {lead.carRequestDetails.model}</strong>
                {lead.carRequestDetails.yearMin && ` (${lead.carRequestDetails.yearMin} - ${lead.carRequestDetails.yearMax || 'Newer'})`}
                {lead.carRequestDetails.budgetUSD && ` · Budget: ${formatUSD(lead.carRequestDetails.budgetUSD)}`}
              </p>
              {lead.carRequestDetails.mustHaves && (
                <p className="text-slate-600 italic">Requirements: "{lead.carRequestDetails.mustHaves}"</p>
              )}
            </div>
          )}

          {/* Message Content */}
          {lead.message && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Customer Message
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-slate-800 leading-relaxed italic border border-gray-200">
                "{lead.message}"
              </div>
            </div>
          )}

          {/* Status & Internal Notes */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Deal Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="py-1.5 px-3 rounded-lg border border-gray-300 bg-white font-semibold text-slate-800 outline-none"
              >
                <option value="New">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Negotiating">Negotiating Offer</option>
                <option value="Won">Won (Deal Completed)</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                Internal Dealership Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log call outcome, counter-offers, or appointment times..."
                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={handleSaveStatusAndNotes}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
          >
            Save Status & Notes
          </button>
        </div>
      </div>
    </div>
  );
};
