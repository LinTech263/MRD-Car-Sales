import React, { useState, useEffect } from 'react';
import { X, Sparkles, DollarSign, Image as ImageIcon, Eye, Save, Trash2, Plus } from 'lucide-react';
import { Car, CarPrivatePricing, Category, DealershipSettings, CarStatus, CarCondition, TransmissionType, FuelType, DrivetrainType } from '../types';
import { storage } from '../services/storage';
import { formatUSD } from '../theme';

interface CarEditModalProps {
  car?: Car | null;
  categories: Category[];
  settings: DealershipSettings;
  onClose: () => void;
  onSaved: () => void;
}

export const CarEditModal: React.FC<CarEditModalProps> = ({
  car,
  categories,
  settings,
  onClose,
  onSaved,
}) => {
  // Load existing or default values
  const [make, setMake] = useState(car?.make || '');
  const [model, setModel] = useState(car?.model || '');
  const [year, setYear] = useState<number>(car?.year || 2023);
  const [trim, setTrim] = useState(car?.trim || '');
  const [categoryId, setCategoryId] = useState(car?.categoryId || categories[0]?.id || '');
  const [bodyType, setBodyType] = useState(car?.bodyType || 'SUV');
  const [condition, setCondition] = useState<CarCondition>(car?.condition || 'Used');
  const [mileage, setMileage] = useState<number>(car?.mileage || 20000);
  const [transmission, setTransmission] = useState<TransmissionType>(car?.transmission || 'Automatic');
  const [fuel, setFuel] = useState<FuelType>(car?.fuel || 'Diesel');
  const [engineSize, setEngineSize] = useState(car?.engineSize || '3.0L V6');
  const [drivetrain, setDrivetrain] = useState<DrivetrainType>(car?.drivetrain || '4x4');
  const [exteriorColor, setExteriorColor] = useState(car?.exteriorColor || 'Pearl White');
  const [interiorColor, setInteriorColor] = useState(car?.interiorColor || 'Black Leather');
  const [doors, setDoors] = useState<number>(car?.doors || 5);
  const [seats, setSeats] = useState<number>(car?.seats || 5);
  const [featuresInput, setFeaturesInput] = useState(car?.features?.join(', ') || 'Sunroof, Leather Seats, 360 Camera');
  const [description, setDescription] = useState(car?.description || '');
  const [images, setImages] = useState<string[]>(
    car?.images?.length ? car.images : ['/assets/images/car_land_cruiser_300_1791464701859.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [coverIndex, setCoverIndex] = useState(car?.coverImageIndex || 0);
  const [status, setStatus] = useState<CarStatus>(car?.status || 'Available');
  const [featured, setFeatured] = useState<boolean>(car?.featured || false);
  const [negotiable, setNegotiable] = useState<boolean>(car?.negotiable || true);
  const [priceOnRequest, setPriceOnRequest] = useState<boolean>(car?.priceOnRequest || false);

  // Private Pricing Engine
  const existingPrivate = car ? storage.getPrivatePricing(car.id) : null;
  const [vin, setVin] = useState(existingPrivate?.vin || '');
  const [stockNumber, setStockNumber] = useState(existingPrivate?.stockNumber || `MRD-${Date.now().toString().slice(-4)}`);
  const [costPriceUSD, setCostPriceUSD] = useState<number>(existingPrivate?.costPriceUSD || 50000);
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>(existingPrivate?.markupType || 'percentage');
  const [markupValue, setMarkupValue] = useState<number>(existingPrivate?.markupValue || settings.defaultMarkupPercent || 15);
  const [manualPriceOverride, setManualPriceOverride] = useState<string>(
    existingPrivate?.manualPriceOverride ? existingPrivate.manualPriceOverride.toString() : ''
  );
  const [internalNotes, setInternalNotes] = useState(existingPrivate?.internalNotes || '');

  // Live Pricing Calculations
  const calculatedAskingPrice = Math.round(
    markupType === 'percentage'
      ? costPriceUSD * (1 + markupValue / 100)
      : costPriceUSD + markupValue
  );

  const finalAskingPrice = manualPriceOverride ? parseFloat(manualPriceOverride) : calculatedAskingPrice;
  const projectedProfit = finalAskingPrice - costPriceUSD;
  const projectedMargin = costPriceUSD > 0 ? ((projectedProfit / costPriceUSD) * 100).toFixed(1) : '0';

  // Live SEO Slug & Meta preview
  const autoSlug = `${year}-${make.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase().replace(/\s+/g, '-')}-${car?.id || Date.now()}`;
  const [slug, setSlug] = useState(car?.slug || autoSlug);
  const autoMetaTitle = `${year} ${make} ${model} ${trim} for Sale in Harare | US$${finalAskingPrice.toLocaleString()} | MRD`;
  const autoMetaDesc = `This ${year} ${make} ${model} ${trim} offers ${transmission}, ${fuel} power and ${mileage.toLocaleString()} km. Available at MRD Car Sales in Mount Pleasant, Harare.`;
  const [seoTitle, setSeoTitle] = useState(autoMetaTitle);
  const [seoDescription, setSeoDescription] = useState(autoMetaDesc);

  // Auto-generate standard copy template per brief
  const generateDescriptionTemplate = () => {
    const template = `This ${year} ${make} ${model} ${trim} offers ${transmission}, ${fuel} power and ${mileage.toLocaleString()} km on the clock, finished in ${exteriorColor}. Available now at MRD Car Sales in Mount Pleasant, Harare. Japanese auction grade inspected, verified ZIMRA duty clearance, and all ownership transfer documentation looked after.`;
    setDescription(template);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    if (coverIndex >= updated.length) setCoverIndex(0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const carId = car?.id || `car-${Date.now()}`;
    const featuresList = featuresInput.split(',').map((f) => f.trim()).filter(Boolean);

    // 1. Save Public Car (Strictly public fields - NO cost, markup, profit or private VIN!)
    const publicCarData: Car = {
      id: carId,
      slug: slug || autoSlug,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      trim: trim.trim(),
      categoryId,
      bodyType,
      condition,
      mileage: Number(mileage),
      transmission,
      fuel,
      engineSize: engineSize.trim(),
      drivetrain,
      exteriorColor: exteriorColor.trim(),
      interiorColor: interiorColor.trim(),
      doors: Number(doors),
      seats: Number(seats),
      features: featuresList,
      description: description.trim() || autoMetaDesc,
      images,
      coverImageIndex: coverIndex,
      status,
      featured,
      negotiable,
      priceOnRequest,
      askingPriceUSD: finalAskingPrice,
      createdAt: car?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveCar(publicCarData);

    // 2. Save Private Pricing Engine (Stored exclusively in private storage)
    const privatePricingData: CarPrivatePricing = {
      carId,
      vin: vin.trim() || undefined,
      stockNumber: stockNumber.trim(),
      costPriceUSD: Number(costPriceUSD),
      markupType,
      markupValue: Number(markupValue),
      manualPriceOverride: manualPriceOverride ? parseFloat(manualPriceOverride) : undefined,
      internalNotes: internalNotes.trim() || undefined,
    };

    storage.savePrivatePricing(privatePricingData);

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50/50">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {car ? `Edit Listing: ${car.year} ${car.make} ${car.model}` : 'Add New Vehicle to Floor'}
            </h2>
            <p className="text-xs text-slate-500">
              Update inventory specifications, private pricing margins, and SEO metadata.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
          {/* SECTION 1: BASIC SPECS */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              1. Basic Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Make *</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Toyota"
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Land Cruiser 300"
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Year *</label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Trim / Grade</label>
                <input
                  type="text"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  placeholder="e.g. ZX V6 Twin-Turbo"
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Body Type</label>
                <input
                  type="text"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as CarCondition)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="Used">Used / Pre-Owned</option>
                  <option value="New">Brand New</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mileage (km) *</label>
                <input
                  type="number"
                  required
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Tiptronic">Tiptronic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Fuel Type</label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value as FuelType)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Engine Size</label>
                <input
                  type="text"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  placeholder="e.g. 3.3L Twin-Turbo"
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Drivetrain</label>
                <select
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value as DrivetrainType)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="4x4">4x4</option>
                  <option value="AWD">AWD</option>
                  <option value="RWD">RWD</option>
                  <option value="FWD">FWD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Exterior Colour</label>
                <input
                  type="text"
                  value={exteriorColor}
                  onChange={(e) => setExteriorColor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Interior Upholstery</label>
                <input
                  type="text"
                  value={interiorColor}
                  onChange={(e) => setInteriorColor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Doors</label>
                <input
                  type="number"
                  value={doors}
                  onChange={(e) => setDoors(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Seats</label>
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRIVATE PRICING & MARGIN CALCULATOR */}
          <div className="p-5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
              <h3 className="font-heading text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>2. Private Pricing & Margin Engine (Admin Only)</span>
              </h3>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Never Exposed to Public API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Cost Price (USD) *</label>
                <input
                  type="number"
                  required
                  value={costPriceUSD}
                  onChange={(e) => setCostPriceUSD(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-tabular font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Markup Type</label>
                <select
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (USD)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Markup Value ({markupType === 'percentage' ? '%' : 'USD'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-tabular"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Manual Price Override (USD)
                </label>
                <input
                  type="number"
                  value={manualPriceOverride}
                  onChange={(e) => setManualPriceOverride(e.target.value)}
                  placeholder={`Calc: $${calculatedAskingPrice}`}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-tabular"
                />
              </div>
            </div>

            {/* Profit Margin Preview Box */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-white border border-amber-200 rounded-lg text-center font-tabular">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Public Asking Price</span>
                <span className="text-sm font-bold text-slate-900">{formatUSD(finalAskingPrice)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Projected Profit</span>
                <span className="text-sm font-bold text-emerald-600">+{formatUSD(projectedProfit)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Margin</span>
                <span className="text-sm font-bold text-amber-700">{projectedMargin}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">VIN / Chassis Number (Private)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="e.g. JTMHX01J704..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Dealership Stock Reference</label>
                <input
                  type="text"
                  value={stockNumber}
                  onChange={(e) => setStockNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: STATUS & LISTING CONTROLS */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              3. Status & Listing Visibility
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Floor Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarStatus)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none font-semibold"
                >
                  <option value="Available">Available for Sale</option>
                  <option value="Reserved">Reserved (Deposit Placed)</option>
                  <option value="Sold">Sold (Preserved for Reference)</option>
                  <option value="Draft">Draft (Hidden from Public)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Show "Price Negotiable"</span>
                </label>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={priceOnRequest}
                    onChange={(e) => setPriceOnRequest(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>"Price on Request"</span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: IMAGES & GALLERIES */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              4. Photography & Cover Image
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Image URL or asset path (e.g. /assets/images/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-gray-300 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                    coverIndex === idx ? 'border-amber-600 shadow-md' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="Vehicle thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                        coverIndex === idx ? 'bg-amber-600 text-white' : 'bg-white/80 text-slate-800'
                      }`}
                    >
                      {coverIndex === idx ? 'Cover Image' : 'Set Cover'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: FEATURES & PROSE DESCRIPTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Features & Detailed Prose
              </h3>
              <button
                type="button"
                onClick={generateDescriptionTemplate}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate Description Template</span>
              </button>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Feature Highlights (comma separated tags)
              </label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="e.g. JBL Audio, Sunroof, Multi-Terrain Select, Adaptive Cruise Control"
                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Full Description (Customer View)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 outline-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* SECTION 6: SEO METADATA & SERP PREVIEW */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2">
              6. SEO Metadata & Google SERP Preview
            </h3>

            {/* Google SERP Snippet Preview */}
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>mrdcarsales.co.zw</span>
                <span>›</span>
                <span>cars</span>
                <span>›</span>
                <span className="truncate max-w-[200px]">{slug}</span>
              </div>
              <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                {seoTitle}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                {seoDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>SEO Title Tag</span>
                  <span>{seoTitle.length}/60 chars</span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>SEO Meta Description</span>
                  <span>{seoDescription.length}/155 chars</span>
                </div>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Vehicle Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
