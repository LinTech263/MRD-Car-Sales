export type CarStatus = 'Draft' | 'Available' | 'Reserved' | 'Sold';
export type CarCondition = 'Used' | 'New';
export type TransmissionType = 'Automatic' | 'Manual' | 'Tiptronic' | 'CVT';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type DrivetrainType = '4x4' | 'AWD' | 'RWD' | 'FWD';

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  categoryId: string;
  bodyType: string;
  condition: CarCondition;
  mileage: number; // in km
  transmission: TransmissionType;
  fuel: FuelType;
  engineSize: string; // e.g. "3.3L Twin-Turbo V6", "2.8L GD-6", "3.0L Inline-6"
  drivetrain: DrivetrainType;
  exteriorColor: string;
  interiorColor: string;
  doors: number;
  seats: number;
  features: string[];
  description: string;
  images: string[];
  coverImageIndex: number;
  status: CarStatus;
  featured: boolean;
  negotiable: boolean;
  priceOnRequest: boolean;
  askingPriceUSD: number;
  soldDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarPrivatePricing {
  carId: string;
  vin?: string;
  stockNumber?: string;
  costPriceUSD: number;
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  manualPriceOverride?: number;
  soldPriceUSD?: number;
  internalNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  defaultMarkupPercent: number;
  seoTitle: string;
  seoDescription: string;
  order: number;
}

export type LeadType = 
  | 'Car enquiry' 
  | 'Offer' 
  | 'Viewing request' 
  | 'Sell/Trade-in' 
  | 'Car request' 
  | 'General contact';

export type LeadStatus = 'New' | 'Contacted' | 'Negotiating' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  fullName: string;
  phone: string;
  email?: string;
  preferredContactMethod: 'WhatsApp' | 'Call' | 'Email';
  carId?: string;
  carTitle?: string;
  carCoverImage?: string;
  askingPriceUSD?: number;
  offerUSD?: number;
  preferredViewingDate?: string;
  interestedInFinance?: boolean;
  hasTradeIn?: boolean;
  tradeInDetails?: {
    make: string;
    model: string;
    year: string;
    mileage?: string;
    condition?: string;
    askingPrice?: string;
    photos?: string[];
  };
  carRequestDetails?: {
    make: string;
    model: string;
    yearMin?: number;
    yearMax?: number;
    budgetUSD?: number;
    mustHaves?: string;
  };
  message?: string;
  consentGiven: boolean;
  notes?: string;
  createdAt: string;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  coverImage: string;
  author: string;
  readTimeMinutes: number;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrLocation: string;
  carPurchased?: string;
  quote: string;
  rating: number;
  published: boolean;
  date: string;
}

export interface ToConfirmItem {
  id: string;
  item: string;
  currentValue: string;
  status: 'pending_confirmation' | 'verified';
  note: string;
}

export interface DealershipSettings {
  businessName: string;
  locationAddress: string; // [TO CONFIRM]
  suburb: string; // Mount Pleasant
  city: string; // Harare
  country: string; // Zimbabwe
  phone: string; // +263 77 696 1977 [TO CONFIRM]
  whatsapp: string; // +263 77 696 1977 [TO CONFIRM]
  email: string; // [TO CONFIRM]
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  primaryCurrency: 'USD';
  enableZiGDisplay: boolean;
  zigExchangeRate: number; // e.g. 26.5
  defaultMarkupPercent: number; // e.g. 15
  logoUrl?: string;
  heroImageUrl?: string;
  googleMapsEmbedUrl?: string;
  googleMapsUrl?: string;
  googleAnalyticsId?: string;
  searchConsoleVerification?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    autotrader?: string;
  };
  homeFeaturedCarIds: string[];
  toConfirmChecklist: ToConfirmItem[];
}
