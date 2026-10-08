import {
  Car,
  CarPrivatePricing,
  Category,
  Lead,
  GuideArticle,
  Testimonial,
  DealershipSettings,
} from '../types';
import { INITIAL_BUSINESS_SETTINGS } from '../config/business';

const STORAGE_KEYS = {
  CARS: 'mrd_cars_v1',
  PRIVATE_PRICING: 'mrd_private_pricing_v1',
  CATEGORIES: 'mrd_categories_v1',
  LEADS: 'mrd_leads_v1',
  POSTS: 'mrd_posts_v1',
  TESTIMONIALS: 'mrd_testimonials_v1',
  SETTINGS: 'mrd_settings_v1',
  SAVED_CARS: 'mrd_saved_cars_v1',
  ADMIN_SESSION: 'mrd_admin_session_v1',
};

// Seed Categories
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-suv',
    name: 'SUVs & 4x4s',
    slug: 'suvs-and-4x4s',
    description: 'Commanding luxury four-wheel-drive vehicles engineered for Harare streets and cross-country terrain across Zimbabwe.',
    coverImage: '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
    defaultMarkupPercent: 12,
    seoTitle: 'SUVs & 4x4s for Sale in Harare | MRD Car Sales',
    seoDescription: 'Explore our premium selection of luxury SUVs and 4x4s in Mount Pleasant, Harare. Toyota Land Cruiser, Prado, BMW X5 and more with transparent USD pricing.',
    order: 1,
  },
  {
    id: 'cat-double-cab',
    name: 'Double Cabs & Pick-ups',
    slug: 'double-cabs-and-pickups',
    description: 'Workhorse capability paired with executive comfort. Rugged Hilux and Ranger double cabs inspected and ready to drive.',
    coverImage: '/src/assets/images/car_toyota_hilux_gd6_1791464710852.jpg',
    defaultMarkupPercent: 10,
    seoTitle: 'Double Cabs & Pick-ups for Sale in Harare | MRD Car Sales',
    seoDescription: 'Find pristine Toyota Hilux and Ford Ranger double cabs for sale in Harare. Clean condition, verified mileage, duty paid.',
    order: 2,
  },
  {
    id: 'cat-sedans',
    name: 'Sedans',
    slug: 'sedans',
    description: 'Refined executive saloons delivering smooth power, prestige, and quiet highway comfort.',
    coverImage: '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
    defaultMarkupPercent: 14,
    seoTitle: 'Luxury Sedans for Sale in Harare | MRD Car Sales',
    seoDescription: 'Prestige Mercedes-Benz, BMW, and executive sedans in Mount Pleasant, Harare. Hand-picked condition with all paperwork handled.',
    order: 3,
  },
  {
    id: 'cat-luxury',
    name: 'Luxury & Performance',
    slug: 'luxury-and-performance',
    description: 'High-specification vehicles offering unparalleled refinement, craftsmanship, and performance.',
    coverImage: '/src/assets/images/car_range_rover_sport_1791464693124.jpg',
    defaultMarkupPercent: 15,
    seoTitle: 'Luxury & Performance Cars Harare | MRD Car Sales',
    seoDescription: 'Top-tier luxury vehicles in Harare. Range Rover, Mercedes-AMG, and BMW M Sport editions available for viewing in Mount Pleasant.',
    order: 4,
  },
  {
    id: 'cat-hatchbacks',
    name: 'Hatchbacks',
    slug: 'hatchbacks',
    description: 'Compact agility and modern performance for effortless urban driving in Harare.',
    coverImage: '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
    defaultMarkupPercent: 12,
    seoTitle: 'Premium Hatchbacks for Sale in Harare | MRD Car Sales',
    seoDescription: 'Clean premium hatchbacks in Mount Pleasant. Inspected, low mileage, transparent USD pricing.',
    order: 5,
  },
];

// Seed Cars
const SEED_CARS: Car[] = [
  {
    id: 'car-lc300',
    slug: '2023-toyota-land-cruiser-300-zx-diesel-car-lc300',
    make: 'Toyota',
    model: 'Land Cruiser 300',
    year: 2023,
    trim: 'ZX V6 Twin-Turbo Diesel',
    categoryId: 'cat-suv',
    bodyType: 'SUV',
    condition: 'Used',
    mileage: 18500,
    transmission: 'Automatic',
    fuel: 'Diesel',
    engineSize: '3.3L Twin-Turbo V6',
    drivetrain: '4x4',
    exteriorColor: 'Pearl White',
    interiorColor: 'Beige & Black Leather',
    doors: 5,
    seats: 7,
    features: [
      'Multi-Terrain Select',
      'JBL Synthesis 14-Speaker Audio',
      'Head-Up Display',
      'Rear Entertainment Screens',
      'Sunroof',
      'Adaptive Variable Suspension (AVS)',
      'Cooler Box',
      'Surround View 360 Camera',
    ],
    description: 'This 2023 Toyota Land Cruiser 300 ZX offers Automatic, Diesel power and 18,500 km on the clock, finished in Pearl White. Available now at MRD Car Sales in Mount Pleasant, Harare. Featuring the sought-after 3.3L Twin-Turbo V6 diesel powerplant, full service record, Japanese auction grade 5 equivalent, duty fully cleared with ZIMRA, and ready for immediate transfer.',
    images: [
      '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
      '/src/assets/images/car_range_rover_sport_1791464693124.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: true,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 128000,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'car-rr-sport',
    slug: '2022-land-rover-range-rover-sport-hse-dynamic-car-rr-sport',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2022,
    trim: 'HSE Dynamic P400',
    categoryId: 'cat-luxury',
    bodyType: 'SUV',
    condition: 'Used',
    mileage: 24000,
    transmission: 'Automatic',
    fuel: 'Petrol',
    engineSize: '3.0L Turbocharged I6 MHEV',
    drivetrain: 'AWD',
    exteriorColor: 'Firenze Red',
    interiorColor: 'Ivory / Ebony Windsor Leather',
    doors: 5,
    seats: 5,
    features: [
      'Panoramic Sliding Glass Roof',
      'Meridian Surround Audio 825W',
      'Matrix LED Headlights',
      'Electronic Air Suspension',
      'Soft Close Doors',
      '21-inch Gloss Black Alloy Wheels',
      'Heated and Ventilated Front Seats',
    ],
    description: 'This 2022 Land Rover Range Rover Sport HSE Dynamic P400 offers Automatic, Petrol power and 24,000 km on the clock, finished in Firenze Red. Available now at MRD Car Sales in Mount Pleasant, Harare. Spotless condition throughout with premium Windsor leather, full service history, and pristine interior.',
    images: [
      '/src/assets/images/car_range_rover_sport_1791464693124.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
      '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: true,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 94000,
    createdAt: '2026-09-18T14:30:00Z',
    updatedAt: '2026-10-02T09:00:00Z',
  },
  {
    id: 'car-hilux-gd6',
    slug: '2022-toyota-hilux-2-8-gd-6-double-cab-4x4-legend-50-car-hilux-gd6',
    make: 'Toyota',
    model: 'Hilux',
    year: 2022,
    trim: '2.8 GD-6 Legend 4x4 Auto',
    categoryId: 'cat-double-cab',
    bodyType: 'Double Cab',
    condition: 'Used',
    mileage: 42000,
    transmission: 'Automatic',
    fuel: 'Diesel',
    engineSize: '2.8L GD-6 Turbodiesel',
    drivetrain: '4x4',
    exteriorColor: 'Glacier White',
    interiorColor: 'Black Leather',
    doors: 4,
    seats: 5,
    features: [
      'Locking Rear Differential',
      'JBL Premium Sound System',
      'Toyota Safety Sense with Pre-Crash',
      'Roller Shutter Load Bed Cover',
      'Tow Bar & Ball Attachment',
      'LED Projector Headlamps',
      'Push Start & Keyless Entry',
    ],
    description: 'This 2022 Toyota Hilux 2.8 GD-6 Legend 4x4 offers Automatic, Diesel power and 42,000 km on the clock, finished in Glacier White. Available now at MRD Car Sales in Mount Pleasant, Harare. The ultimate double cab for executive commuting and rugged Zimbabwean farm travel. Flawless maintenance history.',
    images: [
      '/src/assets/images/car_toyota_hilux_gd6_1791464710852.jpg',
      '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: true,
    negotiable: false,
    priceOnRequest: false,
    askingPriceUSD: 47500,
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-10-04T16:00:00Z',
  },
  {
    id: 'car-merc-c200',
    slug: '2022-mercedes-benz-c200-amg-line-w206-car-merc-c200',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2022,
    trim: 'C200 AMG Line (W206)',
    categoryId: 'cat-sedans',
    bodyType: 'Sedan',
    condition: 'Used',
    mileage: 29000,
    transmission: 'Automatic',
    fuel: 'Petrol',
    engineSize: '1.5L Turbocharged Mild-Hybrid',
    drivetrain: 'RWD',
    exteriorColor: 'Iridium Silver Metallic',
    interiorColor: 'Black Artico Leather',
    doors: 4,
    seats: 5,
    features: [
      'MBUX Portrait 11.9-inch Touchscreen',
      'Digital Light Headlamps',
      'AMG Styling Package',
      'Ambient Lighting 64 Colors',
      'Wireless Apple CarPlay & Android Auto',
      'Active Parking Assist with PARKTRONIC',
    ],
    description: 'This 2022 Mercedes-Benz C-Class C200 AMG Line offers Automatic, Petrol power and 29,000 km on the clock, finished in Iridium Silver Metallic. Available now at MRD Car Sales in Mount Pleasant, Harare. Latest generation W206 with pristine cabin, ultra-quiet ride, and exceptional fuel efficiency.',
    images: [
      '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: true,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 41500,
    createdAt: '2026-09-22T08:30:00Z',
    updatedAt: '2026-10-05T14:00:00Z',
  },
  {
    id: 'car-bmw-x5',
    slug: '2021-bmw-x5-xdrive30d-m-sport-car-bmw-x5',
    make: 'BMW',
    model: 'X5',
    year: 2021,
    trim: 'xDrive30d M Sport',
    categoryId: 'cat-suv',
    bodyType: 'SUV',
    condition: 'Used',
    mileage: 38000,
    transmission: 'Automatic',
    fuel: 'Diesel',
    engineSize: '3.0L TwinPower Turbo I6',
    drivetrain: 'AWD',
    exteriorColor: 'Mineral White Metallic',
    interiorColor: 'Vernasca Cognac Leather',
    doors: 5,
    seats: 5,
    features: [
      'BMW Laserlight',
      'Panoramic Sky Lounge Roof',
      'Harman Kardon Surround Sound',
      'Adaptive 2-Axle Air Suspension',
      'Comfort Access System',
      '20-inch M Star-Spoke Alloys',
    ],
    description: 'This 2021 BMW X5 xDrive30d M Sport offers Automatic, Diesel power and 38,000 km on the clock, finished in Mineral White Metallic. Available now at MRD Car Sales in Mount Pleasant, Harare. Reserved for a verified client pending final financing approval.',
    images: [
      '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
    ],
    coverImageIndex: 0,
    status: 'Reserved',
    featured: false,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 72000,
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z',
  },
  {
    id: 'car-prado-vx',
    slug: '2021-toyota-land-cruiser-prado-2-8-gd-6-vx-car-prado-vx',
    make: 'Toyota',
    model: 'Prado',
    year: 2021,
    trim: '2.8 GD-6 VX Auto 4x4',
    categoryId: 'cat-suv',
    bodyType: 'SUV',
    condition: 'Used',
    mileage: 49000,
    transmission: 'Automatic',
    fuel: 'Diesel',
    engineSize: '2.8L GD-6 Turbodiesel',
    drivetrain: '4x4',
    exteriorColor: 'Graphite Grey Metallic',
    interiorColor: 'Black Leather',
    doors: 5,
    seats: 7,
    features: [
      'KDSS Kinetic Dynamic Suspension',
      '14-Speaker JBL Premium Sound',
      'Multi-Terrain Monitor with Underfloor View',
      'Electric Folding 3rd Row Seats',
      'Centre Console Cool Box',
      'Heated & Ventilated Front Seats',
    ],
    description: 'This 2021 Toyota Prado 2.8 GD-6 VX offers Automatic, Diesel power and 49,000 km on the clock, finished in Graphite Grey Metallic. Available now at MRD Car Sales in Mount Pleasant, Harare. Renowned reliability, immaculate 7-seater luxury.',
    images: [
      '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
      '/src/assets/images/car_toyota_hilux_gd6_1791464710852.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: false,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 68500,
    createdAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-10-06T11:00:00Z',
  },
  {
    id: 'car-ranger-wildtrak',
    slug: '2022-ford-ranger-wildtrak-2-0-bi-turbo-4x4-car-ranger-wildtrak',
    make: 'Ford',
    model: 'Ranger',
    year: 2022,
    trim: 'Wildtrak 2.0 Bi-Turbo 4x4',
    categoryId: 'cat-double-cab',
    bodyType: 'Double Cab',
    condition: 'Used',
    mileage: 35000,
    transmission: 'Automatic',
    fuel: 'Diesel',
    engineSize: '2.0L Bi-Turbo 157kW',
    drivetrain: '4x4',
    exteriorColor: 'Saber Orange',
    interiorColor: 'Wildtrak Leather with Orange Stitching',
    doors: 4,
    seats: 5,
    features: [
      'Ford SYNC 3 with Navigation',
      'Adaptive Cruise Control',
      'Electric Mountain Top Roller Shutter',
      'Lane Keep Assist',
      'Factory Fitted Towbar',
      '18-inch Wildtrak Alloy Wheels',
    ],
    description: 'This 2022 Ford Ranger Wildtrak offers Automatic, Diesel power and 35,000 km on the clock, finished in Saber Orange. Delivered to an executive buyer in Borrowdale, Harare. Sold status maintained for market valuation and provenance transparency.',
    images: [
      '/src/assets/images/car_toyota_hilux_gd6_1791464710852.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
    ],
    coverImageIndex: 0,
    status: 'Sold',
    soldDate: '2026-10-01',
    featured: false,
    negotiable: false,
    priceOnRequest: false,
    askingPriceUSD: 44000,
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-10-01T15:30:00Z',
  },
  {
    id: 'car-vw-golf-gti',
    slug: '2020-volkswagen-golf-gti-tcr-car-vw-golf-gti',
    make: 'Volkswagen',
    model: 'Golf GTI',
    year: 2020,
    trim: 'TCR 2.0 TSI Performance',
    categoryId: 'cat-hatchbacks',
    bodyType: 'Hatchback',
    condition: 'Used',
    mileage: 52000,
    transmission: 'Automatic',
    fuel: 'Petrol',
    engineSize: '2.0L TSI 213kW Turbo',
    drivetrain: 'FWD',
    exteriorColor: 'Pure White with Black Roof',
    interiorColor: 'TCR Microfleece & Leather',
    doors: 5,
    seats: 5,
    features: [
      'Akrapovic Titanium Exhaust Option',
      'Dynaudio Excite 400W Sound System',
      'Digital Cockpit Pro',
      '19-inch Reifnitz Matt Black Wheels',
      'Dynamic Chassis Control (DCC)',
      'Front Differential Lock (VAQ)',
    ],
    description: 'This 2020 Volkswagen Golf GTI TCR offers Automatic, Petrol power and 52,000 km on the clock, finished in Pure White. Available now at MRD Car Sales in Mount Pleasant, Harare. Pristine condition with complete agent service records.',
    images: [
      '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
      '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
    ],
    coverImageIndex: 0,
    status: 'Available',
    featured: false,
    negotiable: true,
    priceOnRequest: false,
    askingPriceUSD: 29500,
    createdAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-10-06T12:00:00Z',
  },
];

// Seed Private Pricing (Admin only - NEVER exposed on public API or public documents)
const SEED_PRIVATE_PRICING: CarPrivatePricing[] = [
  {
    carId: 'car-lc300',
    vin: 'JTMHX01J704098231',
    stockNumber: 'MRD-26-042',
    costPriceUSD: 112000,
    markupType: 'percentage',
    markupValue: 14.28,
    internalNotes: 'Purchased directly from Japanese export broker with CIF Beira + ZIMRA duty paid. Exceptional margins.',
  },
  {
    carId: 'car-rr-sport',
    vin: 'SALWR2VF5NA872391',
    stockNumber: 'MRD-26-048',
    costPriceUSD: 81000,
    markupType: 'percentage',
    markupValue: 16.05,
    internalNotes: 'Consigned from diplomat returning home. Clear documentation and VID test passed.',
  },
  {
    carId: 'car-hilux-gd6',
    vin: 'AHTBB3CD607018392',
    stockNumber: 'MRD-26-051',
    costPriceUSD: 42000,
    markupType: 'fixed',
    markupValue: 5500,
    internalNotes: 'Locally supplied by Croco Motors originally. Very high local demand vehicle.',
  },
  {
    carId: 'car-merc-c200',
    vin: 'W1KAF4GB3NR019284',
    stockNumber: 'MRD-26-053',
    costPriceUSD: 36000,
    markupType: 'percentage',
    markupValue: 15.28,
    internalNotes: 'UK direct import, spotless underside and paintwork.',
  },
  {
    carId: 'car-bmw-x5',
    vin: 'WBACR62010LP93821',
    stockNumber: 'MRD-26-039',
    costPriceUSD: 63000,
    markupType: 'percentage',
    markupValue: 14.28,
    internalNotes: 'Customer deposit received of $5,000 USD via CBZ Escrow.',
  },
  {
    carId: 'car-prado-vx',
    vin: 'JTEBX3FJ800192831',
    stockNumber: 'MRD-26-055',
    costPriceUSD: 60000,
    markupType: 'fixed',
    markupValue: 8500,
    internalNotes: 'Recently serviced with full fluid change.',
  },
  {
    carId: 'car-ranger-wildtrak',
    vin: 'AFAPXXMJ2PNL19382',
    stockNumber: 'MRD-26-031',
    costPriceUSD: 38500,
    markupType: 'fixed',
    markupValue: 5500,
    soldPriceUSD: 43500,
    internalNotes: 'Sold to commercial farmer in Mazowe. Gross profit $5,000 USD realized.',
  },
  {
    carId: 'car-vw-golf-gti',
    vin: 'WVWZZZAUZLP019283',
    stockNumber: 'MRD-26-058',
    costPriceUSD: 25500,
    markupType: 'fixed',
    markupValue: 4000,
    internalNotes: 'Trade-in taken on previous Mercedes sale.',
  },
];

// Seed Leads
const SEED_LEADS: Lead[] = [
  {
    id: 'lead-001',
    type: 'Car enquiry',
    status: 'New',
    fullName: 'Tinashe Moyo',
    phone: '+263 77 234 5678',
    email: 'tmoyo@zimresources.co.zw',
    preferredContactMethod: 'WhatsApp',
    carId: 'car-lc300',
    carTitle: '2023 Toyota Land Cruiser 300 ZX',
    carCoverImage: '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
    askingPriceUSD: 128000,
    preferredViewingDate: '2026-10-10',
    message: 'Good day. Is the Land Cruiser 300 still available for viewing this Saturday in Mount Pleasant? I am ready with cash USD.',
    consentGiven: true,
    createdAt: '2026-10-07T14:20:00Z',
  },
  {
    id: 'lead-002',
    type: 'Offer',
    status: 'Negotiating',
    fullName: 'Dr. Kudzai Chidzero',
    phone: '+263 71 890 1234',
    email: 'kchidzero@harareclinic.org',
    preferredContactMethod: 'Call',
    carId: 'car-merc-c200',
    carTitle: '2022 Mercedes-Benz C200 AMG Line',
    carCoverImage: '/src/assets/images/car_mercedes_c_class_1791464721738.jpg',
    askingPriceUSD: 41500,
    offerUSD: 39000,
    message: 'Offering $39,000 USD prompt settlement. Please call me back on my mobile.',
    consentGiven: true,
    notes: 'Cost is $36k. Margin at $39k is $3,000 (8.3%). Counter-offered at $40,500.',
    createdAt: '2026-10-06T11:15:00Z',
  },
  {
    id: 'lead-003',
    type: 'Viewing request',
    status: 'Contacted',
    fullName: 'Farai Ndlovu',
    phone: '+263 77 456 7890',
    preferredContactMethod: 'WhatsApp',
    carId: 'car-rr-sport',
    carTitle: '2022 Land Rover Range Rover Sport HSE Dynamic',
    carCoverImage: '/src/assets/images/car_range_rover_sport_1791464693124.jpg',
    askingPriceUSD: 94000,
    preferredViewingDate: '2026-10-09',
    interestedInFinance: false,
    message: 'Would like to come check the Range Rover Sport at your Mount Pleasant yard on Friday at 11am.',
    consentGiven: true,
    createdAt: '2026-10-05T09:40:00Z',
  },
  {
    id: 'lead-004',
    type: 'Sell/Trade-in',
    status: 'New',
    fullName: 'Rumbidzai Matongo',
    phone: '+263 78 512 3456',
    email: 'rmatongo@gmail.com',
    preferredContactMethod: 'WhatsApp',
    hasTradeIn: true,
    tradeInDetails: {
      make: 'Toyota',
      model: 'Fortuner 2.8 GD-6 4x4',
      year: '2019',
      mileage: '78,000 km',
      condition: 'Excellent',
      askingPrice: '$38,000 USD',
    },
    message: 'Looking to trade in my 2019 Fortuner against the 2021 Prado VX on your floor. Car is registered in Harare with full service history at Zimoco/Croco.',
    consentGiven: true,
    createdAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'lead-005',
    type: 'Car request',
    status: 'Contacted',
    fullName: 'Tatenda Mugabe',
    phone: '+263 77 987 6543',
    preferredContactMethod: 'WhatsApp',
    carRequestDetails: {
      make: 'Lexus',
      model: 'LX600 F-Sport or Land Cruiser 300 GR Sport',
      yearMin: 2022,
      yearMax: 2024,
      budgetUSD: 140000,
      mustHaves: 'Black exterior, low mileage under 25,000km, duty fully cleared.',
    },
    message: 'Can you source a clean LX600 or LC300 GR Sport? I need it in Harare within 3 weeks.',
    consentGiven: true,
    createdAt: '2026-10-04T13:10:00Z',
  },
];

// Seed 3 Comprehensive SEO Guides
const SEED_POSTS: GuideArticle[] = [
  {
    id: 'guide-luxury-checklist',
    slug: 'how-to-buy-a-used-luxury-car-in-zimbabwe-checklist',
    title: 'How to Buy a Used Luxury Car in Zimbabwe: A Step-by-Step Checklist',
    excerpt: 'Navigating luxury car buying in Harare requires verification of duty clearance, genuine service records, and local suspension compatibility. Here is your essential buyer guide.',
    author: 'MRD Editorial Team',
    readTimeMinutes: 6,
    published: true,
    seoTitle: 'How to Buy a Used Luxury Car in Zimbabwe | Buyer Checklist',
    seoDescription: 'Essential checklist for buying a pre-owned luxury car in Harare, Zimbabwe. ZIMRA duty clearance, mechanical inspection, and transfer of ownership guide.',
    createdAt: '2026-09-10T10:00:00Z',
    coverImage: '/src/assets/images/car_range_rover_sport_1791464693124.jpg',
    contentMarkdown: `Buying an executive or luxury vehicle in Zimbabwe is a substantial investment. Whether you are looking at a Range Rover Sport, a Mercedes-Benz C-Class, or a BMW X5 in Harare, protecting your capital demands a structured approach.

### 1. Insist on Transparent ZIMRA Duty and Clearance Documentation
The most critical risk in Zimbabwe's used vehicle market is non-compliant import duty. When an imported luxury vehicle enters Zimbabwe, customs duties and surcharges must be fully cleared. 
- Always request to inspect the original **ZIMRA Bill of Entry (Form 21)** and the official customs clearance receipt.
- Ensure the chassis / VIN number on the registration document matches the stamped customs documentation exactly.
- Confirm there are no pending rebate bond queries or disputed duty assessments attached to the chassis. At MRD Car Sales, all vehicles on our showroom floor carry fully cleared, verifiable ZIMRA documentation.

### 2. Verify Police Clearance and Ownership Transfer Trail
Before any money changes hands, the vehicle must obtain official Vehicle Inspection Department (VID) and Zimbabwe Republic Police (ZRP) Clearance.
- Check the Blue Book (Registration Book) to confirm the registered owner's name matches the seller's national identity documents.
- If buying through a dealership, ensure the dealer holds genuine power of attorney or dealer title.
- Make sure the vehicle is cleared for change of ownership at the Central Vehicle Registry (CVR).

### 3. Mechanical Inspection Tailored for Zimbabwean Road Conditions
Harare road surfaces and highway conditions place unique demands on luxury vehicle suspension and cooling systems:
- **Air Suspension Compressors & Airbags:** Common on Range Rovers, BMW X5s, and Mercedes-Benz SUVs. Check that the vehicle rises and levels smoothly without throwing chassis warning lights.
- **Cooling System Integrity:** High ambient temperatures during Harare summers require radiators, water pumps, and electric fans to be in peak operational condition.
- **Tire Profiles & Alloy Condition:** Low-profile tires on 21" or 22" rims are vulnerable to road surface imperfections. Check alloy rims for previous structural welds or hairline cracks.

### 4. Transparent USD Pricing
Currency volatility in Zimbabwe means pricing transparency is paramount. Reputable dealerships quote clear, fixed USD amounts without hidden conversion surcharges. If you have an offer in mind, a professional dealer will evaluate it transparently and give you a straight answer.`,
  },
  {
    id: 'guide-import-vs-local',
    slug: 'import-vs-local-purchase-what-harare-buyers-should-know',
    title: 'Import vs Local Purchase: What Harare Buyers Should Know',
    excerpt: 'Comparing the true cost, transit delays, customs duty risks, and peace of mind between personal direct import and buying showroom-ready in Harare.',
    author: 'MRD Editorial Team',
    readTimeMinutes: 7,
    published: true,
    seoTitle: 'Import vs Local Car Purchase in Harare, Zimbabwe | Comparison',
    seoDescription: 'Should you import a car directly or buy locally in Harare? Analyze CIF shipping, port delays in Durban and Beira, ZIMRA duty calculations, and risk.',
    createdAt: '2026-09-18T12:00:00Z',
    coverImage: '/src/assets/images/hero_luxury_showroom_1791464684452.jpg',
    contentMarkdown: `Many motorists in Harare debate whether to import a vehicle personally from the UK or Japan, or buy directly from an established dealership in Mount Pleasant or Borrowdale. Both routes have distinct realities.

### The True Cost of Direct Import
When calculating the cost of an imported vehicle from auction sites, initial FOB (Free On Board) prices look tempting. However, the final landed price includes:
- **Ocean Freight & Insurance (CIF):** Shipping to Durban or Beira ports.
- **Port Handling & Clearing Fees:** Clearing agents, container destuffing, and port storage.
- **Bonded Carrier Transport:** Moving the car from Beira or Durban to Beitbridge / Forbes border posts.
- **ZIMRA Import Duty and Surcharges:** Depending on vehicle age, engine capacity, and vehicle category. Note: customs rules and tariffs are subject to government gazettes, so always verify current ZIMRA tariff schedules.
- **Storage and Demurrage:** Any paperwork delay at the border accumulates daily USD storage charges rapidly.

### The Hidden Risk: Buying Sight-Unseen
Importing personally means buying from online photos and grade sheets. In transit, vehicles can suffer:
- Battery drain, flat spots on tires, and cosmetic damage in port storage.
- Unexpected mechanical failures that have no local dealer warranty or comeback.
- Delivery delays ranging from 6 to 16 weeks, tying up your USD capital without a vehicle to drive.

### The Advantages of Showroom-Ready Local Purchase
When you choose a vehicle from an established local dealership like MRD Car Sales:
1. **Immediate Inspection:** You can physically inspect, touch, and test-drive the vehicle on Harare roads before paying a single dollar.
2. **Duty Already Cleared:** The vehicle is already compliant with ZIMRA, with original documentation ready for transfer.
3. **Zero Transit Risk:** What you see on the floor is what you drive home today.
4. **Trade-In Flexibility:** You can trade in your current vehicle to offset the purchase price, an option impossible with overseas auctions.`,
  },
  {
    id: 'guide-used-suv-checklist',
    slug: 'what-to-check-before-you-buy-a-used-suv-in-harare',
    title: 'What to Check Before You Buy a Used SUV in Harare',
    excerpt: 'Toyota Land Cruisers, Prados, and double cabs dominate Zimbabwean roads for good reason. Here is how to inspect engine health, 4WD transfer cases, and chassis condition.',
    author: 'MRD Editorial Team',
    readTimeMinutes: 5,
    published: true,
    seoTitle: 'What to Check Before Buying a Used SUV in Harare | 4x4 Guide',
    seoDescription: 'Expert guide to inspecting used SUVs and 4x4s in Harare, Zimbabwe. Check transfer boxes, diesel injectors, chassis corrosion, and suspension.',
    createdAt: '2026-09-24T15:00:00Z',
    coverImage: '/src/assets/images/car_land_cruiser_300_1791464701859.jpg',
    contentMarkdown: `SUVs and double cabs are the workhorses of Zimbabwe, prized for ground clearance, pothole resilience, and long-distance touring capabilities. But a poorly maintained 4x4 can become an expensive headache.

### 1. Test the 4x4 System and Low-Range Transfer Case
Many SUV owners in Harare rarely engage four-wheel drive, leading to seized actuators:
- Shift into 4H and 4L on unpaved ground or grass to confirm the transfer motor engages smoothly.
- Listen for clunking sounds or grinding from the centre or rear differential.
- Confirm the differential lock disengages cleanly without remaining stuck.

### 2. Common-Rail Diesel Injector Health
Modern diesel engines like the Toyota 2.8 GD-6, 1GD-FTV, and 3.3L V6 depend on high-pressure injectors:
- Start the engine completely cold. Watch for blue or white smoke, which signals unburnt fuel or injector tip wear.
- Listen for diesel knock at idle and during light acceleration.
- Check the service history for regular fuel filter replacements, essential given varying regional diesel quality.

### 3. Undercarriage and Bushings
- Inspect the control arm bushings, ball joints, and anti-roll bar links. Squeaks over speed humps indicate worn rubber.
- Look at the shock absorbers for oily residue, indicating blown seals.
- Inspect the chassis rails for severe off-road scrapes, dents, or signs of accident repair.

### Why Verified Provenance Matters
At MRD Car Sales, every SUV on our floor is thoroughly vetted for structural integrity, mechanical condition, and clear title. We invite you to bring your trusted mechanic to our Mount Pleasant showroom to inspect any vehicle before you commit.`,
  },
];

export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.initializeDefaults();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private initializeDefaults(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(SEED_CARS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRIVATE_PRICING)) {
      localStorage.setItem(STORAGE_KEYS.PRIVATE_PRICING, JSON.stringify(SEED_PRIVATE_PRICING));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_CARS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_CARS, JSON.stringify(['car-lc300']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify([]));
    }
  }

  // --- CARS (PUBLIC) ---
  public getCars(): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      return data ? JSON.parse(data) : SEED_CARS;
    } catch {
      return SEED_CARS;
    }
  }

  public getCarById(id: string): Car | undefined {
    return this.getCars().find((c) => c.id === id);
  }

  public getCarBySlug(slug: string): Car | undefined {
    return this.getCars().find((c) => c.slug === slug || c.id === slug);
  }

  public saveCar(car: Car): void {
    const cars = this.getCars();
    const index = cars.findIndex((c) => c.id === car.id);
    if (index >= 0) {
      cars[index] = { ...car, updatedAt: new Date().toISOString() };
    } else {
      cars.unshift({ ...car, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    window.dispatchEvent(new Event('mrd_cars_updated'));
  }

  public deleteCar(id: string): void {
    const cars = this.getCars().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    // also remove private pricing
    const pricing = this.getPrivatePricingList().filter((p) => p.carId !== id);
    localStorage.setItem(STORAGE_KEYS.PRIVATE_PRICING, JSON.stringify(pricing));
    window.dispatchEvent(new Event('mrd_cars_updated'));
  }

  // --- PRIVATE PRICING (ADMIN ONLY) ---
  public getPrivatePricingList(): CarPrivatePricing[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRIVATE_PRICING);
      return data ? JSON.parse(data) : SEED_PRIVATE_PRICING;
    } catch {
      return SEED_PRIVATE_PRICING;
    }
  }

  public getPrivatePricing(carId: string): CarPrivatePricing | undefined {
    return this.getPrivatePricingList().find((p) => p.carId === carId);
  }

  public savePrivatePricing(pricing: CarPrivatePricing): void {
    const list = this.getPrivatePricingList();
    const index = list.findIndex((p) => p.carId === pricing.carId);
    if (index >= 0) {
      list[index] = pricing;
    } else {
      list.push(pricing);
    }
    localStorage.setItem(STORAGE_KEYS.PRIVATE_PRICING, JSON.stringify(list));
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : SEED_CATEGORIES;
    } catch {
      return SEED_CATEGORIES;
    }
  }

  public saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('mrd_categories_updated'));
  }

  public deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('mrd_categories_updated'));
  }

  // --- LEADS ---
  public getLeads(): Lead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      return data ? JSON.parse(data) : SEED_LEADS;
    } catch {
      return SEED_LEADS;
    }
  }

  public addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'> & { id?: string }): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: lead.id || `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event('mrd_leads_updated'));
    return newLead;
  }

  public updateLead(updated: Lead): void {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === updated.id);
    if (index >= 0) {
      leads[index] = updated;
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      window.dispatchEvent(new Event('mrd_leads_updated'));
    }
  }

  public deleteLead(id: string): void {
    const leads = this.getLeads().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event('mrd_leads_updated'));
  }

  // --- POSTS / GUIDES ---
  public getPosts(): GuideArticle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : SEED_POSTS;
    } catch {
      return SEED_POSTS;
    }
  }

  public getPostBySlug(slug: string): GuideArticle | undefined {
    return this.getPosts().find((p) => p.slug === slug || p.id === slug);
  }

  public savePost(post: GuideArticle): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    window.dispatchEvent(new Event('mrd_posts_updated'));
  }

  public deletePost(id: string): void {
    const posts = this.getPosts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    window.dispatchEvent(new Event('mrd_posts_updated'));
  }

  // --- TESTIMONIALS ---
  public getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveTestimonial(testimonial: Testimonial): void {
    const items = this.getTestimonials();
    const index = items.findIndex((t) => t.id === testimonial.id);
    if (index >= 0) {
      items[index] = testimonial;
    } else {
      items.unshift(testimonial);
    }
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(items));
    window.dispatchEvent(new Event('mrd_testimonials_updated'));
  }

  public deleteTestimonial(id: string): void {
    const items = this.getTestimonials().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(items));
    window.dispatchEvent(new Event('mrd_testimonials_updated'));
  }

  // --- SETTINGS ---
  public getSettings(): DealershipSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...INITIAL_BUSINESS_SETTINGS, ...JSON.parse(data) } : INITIAL_BUSINESS_SETTINGS;
    } catch {
      return INITIAL_BUSINESS_SETTINGS;
    }
  }

  public saveSettings(settings: DealershipSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('mrd_settings_updated'));
  }

  // --- SAVED CARS (WISHLIST) ---
  public getSavedCarIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CARS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public toggleSavedCar(carId: string): boolean {
    const saved = this.getSavedCarIds();
    const exists = saved.includes(carId);
    const updated = exists ? saved.filter((id) => id !== carId) : [...saved, carId];
    localStorage.setItem(STORAGE_KEYS.SAVED_CARS, JSON.stringify(updated));
    window.dispatchEvent(new Event('mrd_saved_updated'));
    return !exists;
  }

  public isCarSaved(carId: string): boolean {
    return this.getSavedCarIds().includes(carId);
  }

  // --- ADMIN SESSION ---
  public isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  }

  public setAdminLoggedIn(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
    window.dispatchEvent(new Event('mrd_admin_auth_changed'));
  }

  // Reset to seed demo data
  public resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(SEED_CARS));
    localStorage.setItem(STORAGE_KEYS.PRIVATE_PRICING, JSON.stringify(SEED_PRIVATE_PRICING));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify([]));
    window.dispatchEvent(new Event('mrd_cars_updated'));
    window.dispatchEvent(new Event('mrd_leads_updated'));
    window.dispatchEvent(new Event('mrd_settings_updated'));
  }
}

export const storage = StorageService.getInstance();
