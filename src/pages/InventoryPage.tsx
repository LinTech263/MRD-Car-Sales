import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles, AlertCircle } from 'lucide-react';
import { Car, Category, DealershipSettings } from '../types';
import { CarCard } from '../components/CarCard';
import { updatePageSEO } from '../services/seo';
import { trackEvent } from '../services/analytics';
import { formatUSD } from '../theme';

interface InventoryPageProps {
  cars: Car[];
  categories: Category[];
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onNavigate: (path: string) => void;
  onSelectCar: (car: Car) => void;
  initialCategorySlug?: string;
  initialMakeSlug?: string;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  cars,
  categories,
  settings,
  currencyMode,
  onNavigate,
  onSelectCar,
  initialCategorySlug,
  initialMakeSlug,
}) => {
  // Read initial query params from URL if present
  const queryParams = new URLSearchParams(window.location.search);

  const [selectedMake, setSelectedMake] = useState<string>(
    initialMakeSlug || queryParams.get('make') || ''
  );
  const [selectedModel, setSelectedModel] = useState<string>(queryParams.get('model') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || queryParams.get('category') || ''
  );
  const [selectedFuel, setSelectedFuel] = useState<string>(queryParams.get('fuel') || '');
  const [selectedTransmission, setSelectedTransmission] = useState<string>(
    queryParams.get('transmission') || ''
  );
  const [priceBand, setPriceBand] = useState<string>(queryParams.get('priceBand') || '');
  const [maxMileage, setMaxMileage] = useState<string>(queryParams.get('maxMileage') || '');
  const [minYear, setMinYear] = useState<string>(queryParams.get('minYear') || '');
  const [showSold, setShowSold] = useState<boolean>(queryParams.get('sold') === 'true');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state to URL and history
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedFuel) params.set('fuel', selectedFuel);
    if (selectedTransmission) params.set('transmission', selectedTransmission);
    if (priceBand) params.set('priceBand', priceBand);
    if (maxMileage) params.set('maxMileage', maxMileage);
    if (minYear) params.set('minYear', minYear);
    if (showSold) params.set('sold', 'true');

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    // Dynamic SEO update based on category or make
    const activeFiltersCount = [
      selectedMake,
      selectedModel,
      selectedCategory,
      selectedFuel,
      selectedTransmission,
      priceBand,
      maxMileage,
    ].filter(Boolean).length;

    let pageTitle = 'Cars for Sale in Harare | New & Used Premium Vehicles | MRD';
    let pageDesc =
      'Browse hand-picked premium vehicles for sale in Mount Pleasant, Harare. Verified ZIMRA duty clearance, low mileage, transparent USD prices.';

    const matchedCat = categories.find((c) => c.slug === selectedCategory);
    if (matchedCat) {
      pageTitle = `${matchedCat.name} for Sale in Harare | MRD Car Sales`;
      pageDesc = matchedCat.seoDescription;
    } else if (selectedMake) {
      pageTitle = `${selectedMake} for Sale in Harare | MRD Car Sales`;
      pageDesc = `Explore premium ${selectedMake} vehicles for sale in Mount Pleasant, Harare with clear USD pricing and full ownership transfer.`;
    }

    updatePageSEO(
      {
        title: pageTitle,
        description: pageDesc,
        noindex: activeFiltersCount >= 2, // Noindex multi-filter combinations per SEO requirements
        canonicalUrl: `${window.location.origin}/inventory`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Inventory', url: '/inventory' },
          ...(matchedCat ? [{ name: matchedCat.name, url: `/inventory/${matchedCat.slug}` }] : []),
          ...(selectedMake ? [{ name: selectedMake, url: `/brands/${selectedMake.toLowerCase()}` }] : []),
        ],
      },
      settings
    );
  }, [
    selectedMake,
    selectedModel,
    selectedCategory,
    selectedFuel,
    selectedTransmission,
    priceBand,
    maxMileage,
    minYear,
    showSold,
    categories,
    settings,
  ]);

  // ZERO-RESULT-FREE Options: Dynamically compute options that exist in inventory
  const availableInventory = useMemo(() => {
    return cars.filter((c) => c.status !== 'Draft');
  }, [cars]);

  const existingMakes = useMemo(() => {
    return Array.from(new Set(availableInventory.map((c) => c.make))).sort();
  }, [availableInventory]);

  const existingModelsForMake = useMemo(() => {
    if (!selectedMake) return [];
    return Array.from(
      new Set(
        availableInventory
          .filter((c) => c.make.toLowerCase() === selectedMake.toLowerCase())
          .map((c) => c.model)
      )
    ).sort();
  }, [availableInventory, selectedMake]);

  // Filter cars
  const filteredCars = useMemo(() => {
    return availableInventory.filter((car) => {
      // Sold status filter
      if (!showSold && car.status === 'Sold') return false;

      // Make filter
      if (selectedMake && car.make.toLowerCase() !== selectedMake.toLowerCase()) return false;

      // Model filter
      if (selectedModel && car.model.toLowerCase() !== selectedModel.toLowerCase()) return false;

      // Category filter
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && car.categoryId !== cat.id) return false;
      }

      // Fuel filter
      if (selectedFuel && car.fuel !== selectedFuel) return false;

      // Transmission filter
      if (selectedTransmission && car.transmission !== selectedTransmission) return false;

      // Min Year
      if (minYear && car.year < parseInt(minYear, 10)) return false;

      // Max Mileage
      if (maxMileage && car.mileage > parseInt(maxMileage, 10)) return false;

      // Price Bands
      if (priceBand) {
        const price = car.askingPriceUSD;
        if (priceBand === 'under-35k' && price >= 35000) return false;
        if (priceBand === '35k-50k' && (price < 35000 || price > 50000)) return false;
        if (priceBand === '50k-80k' && (price < 50000 || price > 80000)) return false;
        if (priceBand === '80k-plus' && price < 80000) return false;
      }

      return true;
    });
  }, [
    availableInventory,
    showSold,
    selectedMake,
    selectedModel,
    selectedCategory,
    selectedFuel,
    selectedTransmission,
    minYear,
    maxMileage,
    priceBand,
    categories,
  ]);

  // Sort Cars: Available first, then sold at the very end
  const sortedCars = useMemo(() => {
    return [...filteredCars].sort((a, b) => {
      // Sold cars always placed after available cars per brief
      if (a.status === 'Sold' && b.status !== 'Sold') return 1;
      if (a.status !== 'Sold' && b.status === 'Sold') return -1;

      if (sortBy === 'price-asc') return a.askingPriceUSD - b.askingPriceUSD;
      if (sortBy === 'price-desc') return b.askingPriceUSD - a.askingPriceUSD;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
      // Default: newest listed
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredCars, sortBy]);

  const resetFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedCategory('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setPriceBand('');
    setMaxMileage('');
    setMinYear('');
    setShowSold(false);
  };

  const hasActiveFilters = Boolean(
    selectedMake ||
      selectedModel ||
      selectedCategory ||
      selectedFuel ||
      selectedTransmission ||
      priceBand ||
      maxMileage ||
      minYear
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Harare Showroom
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Vehicles'
              : selectedMake
              ? `${selectedMake} for Sale in Harare`
              : 'Cars for Sale in Harare'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Showing <strong className="text-slate-900">{sortedCars.length}</strong> matching vehicles in Mount Pleasant.
          </p>
        </div>

        {/* Sort and Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 py-2 px-3.5 text-xs font-semibold text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 font-medium outline-none focus:border-amber-600"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest</option>
              <option value="mileage-asc">Mileage: Lowest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:col-span-1 space-y-6 bg-white p-6 rounded-xl border border-gray-200 h-fit`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-800" />
              <span>Refine Search</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-800 hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Make Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Make
            </label>
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel('');
              }}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">All Makes</option>
              {existingMakes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Dependent Model Filter */}
          {selectedMake && existingModelsForMake.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Model ({selectedMake})
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
              >
                <option value="">All Models</option>
                {existingModelsForMake.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category / Body Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Body Type
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Bands */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Price Range (USD)
            </label>
            <select
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">Any Price</option>
              <option value="under-35k">Under $35,000</option>
              <option value="35k-50k">$35,000 – $50,000</option>
              <option value="50k-80k">$50,000 – $80,000</option>
              <option value="80k-plus">$80,000+</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Transmission
            </label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">Any Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Fuel
            </label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">Any Fuel</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Max Mileage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Max Mileage
            </label>
            <select
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
            >
              <option value="">Any Mileage</option>
              <option value="30000">Up to 30,000 km</option>
              <option value="50000">Up to 50,000 km</option>
              <option value="80000">Up to 80,000 km</option>
            </select>
          </div>

          {/* Show Sold Vehicles Toggle */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={showSold}
                onChange={(e) => setShowSold(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span>Include Sold Cars (Reference)</span>
            </label>
          </div>
        </aside>

        {/* Cars Grid */}
        <main className="lg:col-span-3">
          {sortedCars.length === 0 ? (
            /* Empty State recommending Request-a-Car form */
            <div className="text-center py-16 px-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                No matching cars currently on our floor
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                We frequently source high-end vehicles on demand for executive clients in Harare. Tell us what you need and our procurement team will find it.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => onNavigate('/request-a-car')}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
                >
                  Request a Specific Car
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCars.map((car, idx) => (
                <CarCard
                  key={car.id}
                  car={car}
                  settings={settings}
                  currencyMode={currencyMode}
                  onSelect={onSelectCar}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}

          {/* Edmunds-Style Popular Searches Block for SEO & Internal Linking */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Popular Searches in Harare
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { label: 'Toyota Land Cruiser in Harare', query: 'make=Toyota' },
                { label: 'Toyota Hilux Double Cab', query: 'make=Toyota&category=double-cabs-and-pickups' },
                { label: 'Range Rover Sport Harare', query: 'make=Land+Rover' },
                { label: 'Mercedes-Benz C-Class', query: 'make=Mercedes-Benz' },
                { label: 'SUVs Under $70,000 USD', query: 'priceBand=50k-80k' },
                { label: 'Automatic Diesel 4x4s', query: 'fuel=Diesel&transmission=Automatic' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate(`/inventory?${item.query}`)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-slate-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
