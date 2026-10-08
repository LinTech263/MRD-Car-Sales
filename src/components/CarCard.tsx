import React from 'react';
import { Heart, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Car, DealershipSettings } from '../types';
import { formatUSD, formatZiG, formatMileage } from '../theme';
import { storage } from '../services/storage';
import { trackEvent } from '../services/analytics';

interface CarCardProps {
  car: Car;
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onSelect: (car: Car) => void;
  priority?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  settings,
  currencyMode,
  onSelect,
  priority = false,
}) => {
  const isSaved = storage.isCarSaved(car.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowSaved = storage.toggleSavedCar(car.id);
    trackEvent('save_car', { carId: car.id, saved: nowSaved });
  };

  const coverImage = car.images[car.coverImageIndex || 0] || car.images[0] || '/src/assets/images/hero_luxury_showroom_1791464684452.jpg';

  const isSold = car.status === 'Sold';
  const isReserved = car.status === 'Reserved';

  return (
    <div
      onClick={() => onSelect(car)}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Visual Image Slot (4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        <img
          src={coverImage}
          alt={`${car.year} ${car.make} ${car.model} ${car.trim} for sale in Harare - front view`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status indicator banner */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isSold ? (
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-red-600 text-white rounded">
              Sold
            </span>
          ) : isReserved ? (
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-amber-600 text-white rounded">
              Reserved
            </span>
          ) : car.featured ? (
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-slate-900/90 text-amber-300 backdrop-blur-sm rounded">
              Featured
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={handleToggleSave}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors focus:outline-none"
          title={isSaved ? 'Remove from saved' : 'Save vehicle'}
          aria-label="Save vehicle"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Make / Model / Year Title */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              {car.make} · {car.year}
            </span>
            <span className="text-xs text-slate-400 font-medium">{car.condition}</span>
          </div>

          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors mt-0.5 line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
            {car.trim}
          </p>

          {/* Clean Unboxed Metadata with · separator (Zero-Pill Compliance) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-3 pt-3 border-t border-gray-100 font-medium">
            <span className="font-tabular">{formatMileage(car.mileage)}</span>
            <span aria-hidden="true" className="text-gray-300">·</span>
            <span>{car.transmission}</span>
            <span aria-hidden="true" className="text-gray-300">·</span>
            <span>{car.fuel}</span>
            <span aria-hidden="true" className="text-gray-300">·</span>
            <span className="flex items-center gap-0.5 text-slate-400">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Mt Pleasant</span>
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {car.priceOnRequest ? 'Pricing' : isSold ? 'Sold Price' : 'Asking Price'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-tabular font-heading text-lg sm:text-xl font-bold text-slate-900">
                {car.priceOnRequest ? 'Price on Request' : formatUSD(car.askingPriceUSD)}
              </span>
              {car.negotiable && !car.priceOnRequest && !isSold && (
                <span className="text-[10px] text-slate-500 font-medium">Neg.</span>
              )}
            </div>

            {/* Optional ZiG display */}
            {settings.enableZiGDisplay && !car.priceOnRequest && (
              <span className="block text-[11px] text-slate-400 font-tabular">
                {formatZiG(car.askingPriceUSD, settings.zigExchangeRate)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 group-hover:text-amber-800 transition-colors">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
