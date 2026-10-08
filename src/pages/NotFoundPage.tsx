import React from 'react';
import { ArrowLeft, Search, ShieldAlert } from 'lucide-react';
import { Car, DealershipSettings } from '../types';
import { CarCard } from '../components/CarCard';
import { updatePageSEO } from '../services/seo';

interface NotFoundPageProps {
  cars: Car[];
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onNavigate: (path: string) => void;
  onSelectCar: (car: Car) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  cars,
  settings,
  currencyMode,
  onNavigate,
  onSelectCar,
}) => {
  const featured = cars.filter((c) => c.status === 'Available').slice(0, 3);

  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Page Not Found (404) | MRD Car Sales Harare',
        description: 'The requested car or page could not be found. Browse our available luxury vehicle inventory in Mount Pleasant, Harare.',
        noindex: true,
      },
      settings
    );
  }, [settings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-md mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          Error 404
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-slate-900">
          Vehicle or Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The vehicle you are looking for may have been sold, archived, or the link has changed. Explore our current showroom selection below.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => onNavigate('/inventory')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
          >
            Browse Inventory
          </button>
        </div>
      </div>

      {featured.length > 0 && (
        <div className="border-t border-gray-200 pt-10 space-y-6">
          <h3 className="font-heading text-lg font-bold text-slate-900 text-center">
            Featured Cars Currently in Mount Pleasant
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                settings={settings}
                currencyMode={currencyMode}
                onSelect={onSelectCar}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
