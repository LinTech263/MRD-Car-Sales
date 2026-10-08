import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  ShieldCheck,
  DollarSign,
  FileCheck,
  RefreshCw,
  ChevronDown,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Car, Category, DealershipSettings, Testimonial } from '../types';
import { CarCard } from '../components/CarCard';
import { getWhatsAppLink } from '../theme';
import { trackEvent } from '../services/analytics';
import { updatePageSEO, buildFAQSchema } from '../services/seo';

interface HomePageProps {
  cars: Car[];
  categories: Category[];
  testimonials: Testimonial[];
  settings: DealershipSettings;
  currencyMode: 'USD' | 'ZiG';
  onNavigate: (path: string) => void;
  onSelectCar: (car: Car) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  cars,
  categories,
  testimonials,
  settings,
  currencyMode,
  onNavigate,
  onSelectCar,
}) => {
  // Quick Search Bar state
  const [searchMake, setSearchMake] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Available makes for search dropdown
  const availableMakes = Array.from(new Set(cars.filter((c) => c.status === 'Available').map((c) => c.make)));
  const availableCars = cars.filter((c) => c.status === 'Available');
  const featuredCars = cars.filter((c) => c.featured && c.status === 'Available').slice(0, 6);

  // 7 FAQs from the user brief
  const faqs = [
    {
      question: 'Can I negotiate the price on your vehicles?',
      answer:
        'Yes. Many of our vehicles feature negotiable asking prices. You can use our "Make an Offer" feature online or discuss directly with our sales team on WhatsApp. We evaluate every serious cash USD offer promptly.',
    },
    {
      question: 'Do you handle registration, duty, and ownership transfer paperwork?',
      answer:
        'All vehicles on our showroom floor carry fully cleared ZIMRA documentation and verified duty payment. We guide you step-by-step through Central Vehicle Registry (CVR) ownership transfer, police clearance, and change of ownership so you drive away fully compliant.',
    },
    {
      question: 'Can I trade in my current car against a vehicle on your floor?',
      answer:
        'Yes. We welcome trade-ins for clean, locally registered vehicles with verifiable service history. Submit your vehicle details via our Sell/Trade-in page or bring it to our Mount Pleasant yard for a prompt physical valuation.',
    },
    {
      question: 'Do you offer financing or escrow payment options?',
      answer:
        'We work with major Zimbabwean banking institutions and asset finance providers, and can provide formal pro-forma invoices for approved institutional finance facilities.',
    },
    {
      question: 'Can I view and test drive a car before buying?',
      answer:
        'Absolutely. Our showroom in Mount Pleasant is open Monday through Saturday. We encourage private viewings and allow your trusted mechanic to perform a comprehensive physical and diagnostic inspection.',
    },
    {
      question: 'Are your cars mechanically inspected before being listed?',
      answer:
        'Every vehicle in our collection undergoes a multi-point inspection covering suspension, cooling, engine health, common-rail injection, electronics, and structural chassis integrity before entering our inventory.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept USD cash, Nostro FCA bank wire transfers, and verified bank escrow settlements. Where applicable, statutory local currency charges can be settled via approved channels.',
    },
  ];

  // Set SEO on mount
  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'Premium & Luxury Cars for Sale in Harare | MRD Car Sales',
        description:
          'Hand-picked premium cars at MRD Car Sales, Mount Pleasant, Harare. Transparent USD prices, paperwork handled. Enquire or make an offer today.',
        canonicalUrl: window.location.origin + '/',
        schema: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.businessName,
            url: window.location.origin,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${window.location.origin}/inventory?make={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          buildFAQSchema(faqs),
        ],
      },
      settings
    );
  }, [settings]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('filter_used', { source: 'hero_search', searchMake, searchCategory, searchMaxPrice });
    const params = new URLSearchParams();
    if (searchMake) params.set('make', searchMake);
    if (searchCategory) params.set('category', searchCategory);
    if (searchMaxPrice) params.set('maxPrice', searchMaxPrice);
    onNavigate(`/inventory?${params.toString()}`);
  };

  const handleWhatsAppHero = () => {
    trackEvent('whatsapp_click', { source: 'hero_banner' }, settings);
    const link = getWhatsAppLink(
      settings.whatsapp,
      `Hello MRD Car Sales, I am browsing your showroom collection online and would like to chat about available vehicles in Harare.`
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline & Action Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-md text-xs font-semibold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Mount Pleasant Showroom · Harare, Zimbabwe</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
                Premium Cars in Harare. Handled Properly.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Hand-picked high-end vehicles, clear USD pricing and all the paperwork looked after, from your first enquiry to the day you drive away.
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/inventory')}
                  className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all focus:outline-none flex items-center gap-2"
                >
                  <span>Browse Our Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppHero}
                  className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all focus:outline-none flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              {/* Compact Quick Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="mt-6 p-4 bg-gray-50/90 border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Make
                  </label>
                  <select
                    value={searchMake}
                    onChange={(e) => setSearchMake(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
                  >
                    <option value="">All Makes</option>
                    {availableMakes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Body Type
                  </label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-gray-300 bg-white text-slate-800 outline-none focus:border-amber-600"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Cars</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Visual Banner Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 group">
                <img
                  src={settings.heroImageUrl || '/src/assets/images/hero_luxury_showroom_1791464684452.jpg'}
                  alt="MRD Car Sales Mount Pleasant Harare Dealership Showroom"
                  fetchPriority="high"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
                      Showroom Floor · Harare
                    </span>
                    <p className="text-sm font-medium text-white/95">
                      Selected executive & luxury vehicles inspected and ready for immediate delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP (4 items, icon + 3-5 words each) */}
      <section className="border-y border-gray-200 bg-gray-50/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg shrink-0 text-amber-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Hand-Picked Vehicles</h4>
                <p className="text-[11px] text-slate-500">Every car verified personally</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg shrink-0 text-amber-800">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Clear USD Pricing</h4>
                <p className="text-[11px] text-slate-500">Transparent with zero surprises</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg shrink-0 text-amber-800">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Paperwork Handled</h4>
                <p className="text-[11px] text-slate-500">Transfer, ZIMRA & police clearance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg shrink-0 text-amber-800">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Trade-Ins Welcome</h4>
                <p className="text-[11px] text-slate-500">Upgrade seamlessly against our floor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CARS (6 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Selected Inventory
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Featured Cars on Our Floor
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/inventory')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-900"
          >
            <span>View Full Inventory ({availableCars.length} cars)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredCars.map((car, idx) => (
            <CarCard
              key={car.id}
              car={car}
              settings={settings}
              currencyMode={currencyMode}
              onSelect={onSelectCar}
              priority={idx < 2}
            />
          ))}
        </div>
      </section>

      {/* 4. BROWSE BY BODY TYPE (Only categories that have available cars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Explore Categories
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Browse by Body Type
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Filter vehicles engineered for executive commuting and cross-country travel in Zimbabwe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .filter((cat) => cars.some((c) => c.categoryId === cat.id && c.status === 'Available'))
            .map((cat) => {
              const count = cars.filter((c) => c.categoryId === cat.id && c.status === 'Available').length;
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(`/inventory/${cat.slug}`)}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden relative">
                    <img
                      src={cat.coverImage}
                      alt={`${cat.name} in Harare`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                      {count} {count === 1 ? 'vehicle' : 'vehicles'} available
                    </span>
                  </div>

                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{cat.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 5. WHY MRD (4 Pillars from user copy) */}
      <section className="bg-gray-50/70 border-y border-gray-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              The MRD Standard
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Why Harare Buyers Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <span className="font-heading text-xl font-bold text-amber-800">01</span>
              <h3 className="font-heading text-base font-bold text-slate-900">Selected, not stocked</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We choose each car for condition, history and value, so you are not wading through lots of average ones.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <span className="font-heading text-xl font-bold text-amber-800">02</span>
              <h3 className="font-heading text-base font-bold text-slate-900">Straight pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The price you see is the price we discuss. Have a number in mind? Make an offer and we will respond personally.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <span className="font-heading text-xl font-bold text-amber-800">03</span>
              <h3 className="font-heading text-base font-bold text-slate-900">Paperwork off your plate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We guide you through ownership transfer, police clearance, and registration so you drive away fully compliant.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <span className="font-heading text-xl font-bold text-amber-800">04</span>
              <h3 className="font-heading text-base font-bold text-slate-900">Easy to reach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call, WhatsApp or visit us in Mount Pleasant. A real person replies immediately during business hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3 Steps from user copy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-heading font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">Choose your car</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse online or tell us what you want. Every car listed has real photos, genuine specs, and transparent USD pricing.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-heading font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">Enquire or make an offer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send your details and your number. Have a specific price in mind? Submit an offer and we will review it fast.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-heading font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">View, agree, drive away</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See the car in Mount Pleasant, bring your mechanic, sign off the paperwork, and collect your keys with complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SELL OR TRADE IN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Valuation & Upgrades
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Selling or upgrading your car?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tell us about your car and get an offer. Trade it in against any car on our floor with zero hassle and fast turnaround.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/sell-your-car')}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
            >
              Get a Valuation & Trade-In
            </button>
            <button
              onClick={() => onNavigate('/request-a-car')}
              className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Request a Specific Car
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Only shown if real testimonials exist) */}
      {testimonials.filter((t) => t.published).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Client Feedback
            </span>
            <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight mt-1">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials
              .filter((t) => t.published)
              .map((t) => (
                <div key={t.id} className="p-6 bg-white border border-gray-200 rounded-xl space-y-3">
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{t.quote}"</p>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    <span className="text-slate-400">{t.roleOrLocation}</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Common Questions
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Clear answers about car purchasing, ZIMRA duty, and viewing appointments in Harare.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm sm:text-base font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. VISIT THE SHOWROOM (Mount Pleasant NAP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Details Column */}
          <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Visit Us
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Mount Pleasant Showroom
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Experience our curated vehicles in a relaxed, secure environment. Walk-ins and private mechanic inspections are always welcome.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Location</strong>
                    <span className="text-slate-600">
                      {settings.locationAddress}, {settings.suburb}, {settings.city}, Zimbabwe
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Showroom Hours</strong>
                    <span className="text-slate-600">
                      Mon-Fri: {settings.openingHours.weekdays} · Sat: {settings.openingHours.saturday}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Telephone & WhatsApp</strong>
                    <span className="text-slate-600 font-tabular">{settings.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-lg text-center transition-colors"
              >
                Call Dealership
              </a>
              <button
                onClick={handleWhatsAppHero}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg text-center transition-colors"
              >
                WhatsApp Us
              </button>
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 border border-gray-300 hover:bg-gray-50 rounded-lg text-center transition-colors"
                >
                  Get Directions on Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Map Embed Column */}
          <div className="lg:col-span-7 bg-gray-100 min-h-[340px] relative">
            <iframe
              src={settings.googleMapsEmbedUrl}
              title="MRD Car Sales Mount Pleasant Harare Map"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA BAND (from user copy) */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to find your next car?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Browse the collection or message us now. We will take it from there.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/inventory')}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
            >
              Browse Full Collection
            </button>
            <button
              onClick={handleWhatsAppHero}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Us on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
