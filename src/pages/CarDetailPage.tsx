import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Check,
  MessageCircle,
  Phone,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Calendar,
  Fuel,
  Gauge,
  Sliders,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Car, DealershipSettings, Category } from '../types';
import { CarGallery } from '../components/CarGallery';
import { EnquiryForm } from '../components/EnquiryForm';
import { CarCard } from '../components/CarCard';
import { formatUSD, formatZiG, formatMileage, getWhatsAppLink } from '../theme';
import { storage } from '../services/storage';
import { updatePageSEO, buildCarSchema } from '../services/seo';
import { trackEvent } from '../services/analytics';

interface CarDetailPageProps {
  car: Car;
  allCars: Car[];
  categories: Category[];
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onNavigate: (path: string) => void;
  onSelectCar: (car: Car) => void;
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  car,
  allCars,
  categories,
  settings,
  currencyMode,
  onNavigate,
  onSelectCar,
}) => {
  const [formMode, setFormMode] = useState<'enquire' | 'offer' | 'viewing'>('enquire');
  const [copiedLink, setCopiedLink] = useState(false);
  const isSaved = storage.isCarSaved(car.id);

  const isSold = car.status === 'Sold';
  const isReserved = car.status === 'Reserved';

  // Breadcrumbs data
  const category = categories.find((c) => c.id === car.categoryId);

  // Related cars (same category or make, excluding this car)
  const relatedCars = allCars
    .filter((c) => c.id !== car.id && (c.categoryId === car.categoryId || c.make === car.make))
    .slice(0, 3);

  // SEO Update & Schema injection
  useEffect(() => {
    const pageTitle = `${car.year} ${car.make} ${car.model} ${car.trim} for Sale in Harare | ${
      car.priceOnRequest ? 'Price on Request' : `US$${car.askingPriceUSD.toLocaleString()}`
    } | MRD`;

    const pageDesc = `${car.year} ${car.make} ${car.model} ${car.trim} available at MRD Car Sales in Mount Pleasant, Harare. ${car.transmission}, ${car.fuel}, ${formatMileage(
      car.mileage
    )}. Duty cleared.`;

    const carUrl = `${window.location.origin}/cars/${car.slug}`;

    updatePageSEO(
      {
        title: pageTitle,
        description: pageDesc,
        canonicalUrl: carUrl,
        ogImage: car.images[0] || settings.heroImageUrl,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Inventory', url: '/inventory' },
          ...(category ? [{ name: category.name, url: `/inventory/${category.slug}` }] : []),
          { name: `${car.year} ${car.make} ${car.model}`, url: `/cars/${car.slug}` },
        ],
        schema: buildCarSchema(car, settings, window.location.origin),
      },
      settings
    );
  }, [car, category, settings]);

  const handleWhatsAppInquiry = () => {
    trackEvent('whatsapp_click', { source: 'car_detail_cta', carId: car.id }, settings);
    const carUrl = `${window.location.origin}/cars/${car.slug}`;
    const msg = `Hello MRD Car Sales, I am interested in this vehicle listed on your website:\n${car.year} ${car.make} ${car.model} ${car.trim}\nPrice: ${
      car.priceOnRequest ? 'Price on Request' : formatUSD(car.askingPriceUSD)
    }\nLink: ${carUrl}\nIs it available for viewing in Mount Pleasant?`;
    window.open(getWhatsAppLink(settings.whatsapp, msg), '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleSave = () => {
    const nowSaved = storage.toggleSavedCar(car.id);
    trackEvent('save_car', { carId: car.id, saved: nowSaved });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => onNavigate('/inventory')} className="hover:text-slate-900">
          Inventory
        </button>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => onNavigate(`/inventory/${category.slug}`)}
              className="hover:text-slate-900"
            >
              {category.name}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {car.year} {car.make} {car.model}
        </span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery, Specs & Story */}
        <div className="lg:col-span-7 space-y-8">
          <CarGallery images={car.images} title={`${car.year} ${car.make} ${car.model}`} />

          {/* Quick Specifications Grid */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Vehicle Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Mileage</span>
                <span className="font-tabular font-bold text-slate-900 text-sm">
                  {formatMileage(car.mileage)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Transmission</span>
                <span className="font-bold text-slate-900 text-sm">{car.transmission}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Fuel Type</span>
                <span className="font-bold text-slate-900 text-sm">{car.fuel}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Drivetrain</span>
                <span className="font-bold text-slate-900 text-sm">{car.drivetrain}</span>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                Key Specification Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-lg">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehensive Spec Table */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Technical Specifications
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
              {[
                { label: 'Year', value: car.year.toString() },
                { label: 'Make', value: car.make },
                { label: 'Model', value: car.model },
                { label: 'Trim / Grade', value: car.trim },
                { label: 'Body Style', value: car.bodyType },
                { label: 'Condition', value: car.condition },
                { label: 'Engine Capacity & Configuration', value: car.engineSize },
                { label: 'Exterior Colour', value: car.exteriorColor },
                { label: 'Interior Upholstery', value: car.interiorColor },
                { label: 'Doors / Seating', value: `${car.doors} Doors / ${car.seats} Seats` },
                { label: 'Dealership Stock Ref', value: `MRD-${car.id.slice(-6).toUpperCase()}` },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 p-3 bg-white hover:bg-gray-50/50">
                  <span className="text-slate-500 font-medium">{row.label}</span>
                  <span className="font-bold text-slate-900 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Prose */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Vehicle Description & Provenance
            </h3>
            <div className="prose prose-sm text-slate-600 leading-relaxed bg-white p-6 border border-gray-200 rounded-xl">
              <p>{car.description}</p>
            </div>
          </div>

          {/* Why buy from MRD mini block */}
          <div className="p-6 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-amber-900">
              The MRD Purchase Guarantee
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Verified ZIMRA Duty:</strong> Full import customs documentation and Bill of Entry inspected.</span>
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Harare Road Inspected:</strong> Suspension, cooling systems, and electronics fully checked.</span>
              </p>
              <p className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Ownership Transfer Assisted:</strong> Complete guidance on police clearance and CVR change of ownership.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Purchase & Action Module */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  {car.make} · {car.year}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-gray-100 transition-colors"
                    title="Share listing link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleToggleSave}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-gray-100 transition-colors"
                    title="Save to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Exact H1 per brief */}
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {car.year} {car.make} {car.model} {car.trim} for Sale in Harare
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {car.priceOnRequest ? 'Price' : isSold ? 'Final Sale Price' : 'Asking Price'}
                </span>
                {isSold ? (
                  <span className="text-xs font-bold text-red-600 uppercase">Sold</span>
                ) : isReserved ? (
                  <span className="text-xs font-bold text-amber-600 uppercase">Reserved</span>
                ) : car.negotiable && !car.priceOnRequest ? (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Price Negotiable
                  </span>
                ) : null}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
                  {car.priceOnRequest ? 'Price on Request' : formatUSD(car.askingPriceUSD)}
                </span>
              </div>

              {settings.enableZiGDisplay && !car.priceOnRequest && (
                <span className="block text-xs text-slate-500 font-tabular">
                  Approx. {formatZiG(car.askingPriceUSD, settings.zigExchangeRate)} (Rate {settings.zigExchangeRate})
                </span>
              )}
            </div>

            {/* Direct Instant Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-3.5 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp About This Car</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings.phone}`}
                  className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Dealership</span>
                </a>

                <button
                  onClick={() => setFormMode('offer')}
                  className="py-2.5 px-3 text-xs font-semibold text-slate-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Make an Offer
                </button>
              </div>
            </div>

            {/* Inline Enquiry & Offer Tabs */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <button
                  onClick={() => setFormMode('enquire')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    formMode === 'enquire'
                      ? 'border-amber-600 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Enquire Online
                </button>
                <button
                  onClick={() => setFormMode('offer')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    formMode === 'offer'
                      ? 'border-amber-600 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Make an Offer
                </button>
                <button
                  onClick={() => setFormMode('viewing')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    formMode === 'viewing'
                      ? 'border-amber-600 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Book Viewing
                </button>
              </div>

              <EnquiryForm car={car} settings={settings} mode={formMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Related & Similar Cars */}
      {relatedCars.length > 0 && (
        <section className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
              {isSold ? 'Similar Available Vehicles' : 'Other Cars You Might Consider'}
            </h3>
            <button
              onClick={() => onNavigate('/inventory')}
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              Browse All Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCars.map((rc) => (
              <CarCard
                key={rc.id}
                car={rc}
                settings={settings}
                currencyMode={currencyMode}
                onSelect={onSelectCar}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
