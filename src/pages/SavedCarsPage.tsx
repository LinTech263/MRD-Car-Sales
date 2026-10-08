import React from 'react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Car, DealershipSettings } from '../types';
import { CarCard } from '../components/CarCard';
import { storage } from '../services/storage';
import { updatePageSEO } from '../services/seo';

interface SavedCarsPageProps {
  allCars: Car[];
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onNavigate: (path: string) => void;
  onSelectCar: (car: Car) => void;
}

export const SavedCarsPage: React.FC<SavedCarsPageProps> = ({
  allCars,
  settings,
  currencyMode,
  onNavigate,
  onSelectCar,
}) => {
  const savedIds = storage.getSavedCarIds();
  const savedCars = allCars.filter((c) => savedIds.includes(c.id));

  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Saved Vehicles | MRD Car Sales Harare',
        description: 'View your shortlist of saved executive and luxury vehicles at MRD Car Sales in Mount Pleasant, Harare.',
        noindex: true, // Noindex user-specific saved list
        canonicalUrl: `${window.location.origin}/saved`,
      },
      settings
    );
  }, [settings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Your Shortlist
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Saved Cars ({savedCars.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vehicles you have favourited on this device. No registration required.
          </p>
        </div>

        {savedCars.length > 0 && (
          <button
            onClick={() => onNavigate('/inventory')}
            className="text-xs font-semibold text-amber-800 hover:underline"
          >
            Browse More Cars →
          </button>
        )}
      </div>

      {savedCars.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white border border-gray-200 rounded-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            You haven't saved any vehicles yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Tap the heart icon on any vehicle card to bookmark it for quick comparison or enquiry.
          </p>
          <button
            onClick={() => onNavigate('/inventory')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
          >
            Explore Available Inventory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              settings={settings}
              currencyMode={currencyMode}
              onSelect={onSelectCar}
            />
          ))}
        </div>
      )}
    </div>
  );
};
