import React, { useState, useEffect } from 'react';
import {
  Car as CarIcon,
  Users,
  Layers,
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  Plus,
  Search,
  Download,
  LogOut,
  Sparkles,
  DollarSign,
  TrendingUp,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Check,
  AlertTriangle,
  RotateCcw,
  Edit2,
  Trash2,
  Copy,
} from 'lucide-react';
import { Car, Category, Lead, GuideArticle, Testimonial, DealershipSettings, LeadStatus, CarStatus } from '../types';
import { storage } from '../services/storage';
import { formatUSD, formatZiG } from '../theme';
import { CarEditModal } from './CarEditModal';
import { LeadDetailModal } from './LeadDetailModal';

interface AdminPortalProps {
  onLogout: () => void;
  onNavigateSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout, onNavigateSite }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'leads' | 'categories' | 'guides' | 'testimonials' | 'settings'>('dashboard');

  // Live Data States
  const [cars, setCars] = useState<Car[]>(storage.getCars());
  const [categories, setCategories] = useState<Category[]>(storage.getCategories());
  const [leads, setLeads] = useState<Lead[]>(storage.getLeads());
  const [posts, setPosts] = useState<GuideArticle[]>(storage.getPosts());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(storage.getTestimonials());
  const [settings, setSettings] = useState<DealershipSettings>(storage.getSettings());

  // Modals state
  const [editingCar, setEditingCar] = useState<Car | null | undefined>(undefined);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // Filters for Cars tab
  const [carSearch, setCarSearch] = useState('');
  const [carStatusFilter, setCarStatusFilter] = useState<string>('all');

  // Filters for Leads tab
  const [leadSearch, setLeadSearch] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshAllData = () => {
    setCars(storage.getCars());
    setCategories(storage.getCategories());
    setLeads(storage.getLeads());
    setPosts(storage.getPosts());
    setTestimonials(storage.getTestimonials());
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    window.addEventListener('mrd_cars_updated', refreshAllData);
    window.addEventListener('mrd_leads_updated', refreshAllData);
    window.addEventListener('mrd_settings_updated', refreshAllData);
    return () => {
      window.removeEventListener('mrd_cars_updated', refreshAllData);
      window.removeEventListener('mrd_leads_updated', refreshAllData);
      window.removeEventListener('mrd_settings_updated', refreshAllData);
    };
  }, []);

  // KPIs
  const availableCount = cars.filter((c) => c.status === 'Available').length;
  const reservedCount = cars.filter((c) => c.status === 'Reserved').length;
  const soldCount = cars.filter((c) => c.status === 'Sold').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  // Actions on Cars
  const handleDuplicateCar = (car: Car) => {
    const dup: Car = {
      ...car,
      id: `car-${Date.now()}`,
      slug: `${car.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveCar(dup);
    showToast(`Duplicated ${car.year} ${car.make} ${car.model} as Draft`);
  };

  const handleMarkAsSold = (car: Car) => {
    const soldPriceStr = window.prompt(`Enter final sold price in USD for ${car.make} ${car.model}:`, car.askingPriceUSD.toString());
    const soldPrice = soldPriceStr ? parseFloat(soldPriceStr) : car.askingPriceUSD;

    const updatedCar: Car = {
      ...car,
      status: 'Sold',
      soldDate: new Date().toISOString().split('T')[0],
      askingPriceUSD: soldPrice,
    };
    storage.saveCar(updatedCar);

    const privatePricing = storage.getPrivatePricing(car.id);
    if (privatePricing) {
      storage.savePrivatePricing({
        ...privatePricing,
        soldPriceUSD: soldPrice,
      });
    }

    showToast(`Marked ${car.make} ${car.model} as Sold!`);
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle listing? This cannot be undone.')) {
      storage.deleteCar(carId);
      showToast('Vehicle listing deleted.');
    }
  };

  // Export Leads to CSV
  const handleExportLeadsCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Status', 'Full Name', 'Phone', 'Email', 'Preferred Contact', 'Car Title', 'Asking Price USD', 'Offer USD', 'Viewing Date', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      l.type,
      l.status,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      l.preferredContactMethod,
      `"${(l.carTitle || '').replace(/"/g, '""')}"`,
      l.askingPriceUSD || '',
      l.offerUSD || '',
      l.preferredViewingDate || '',
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MRD_Car_Sales_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all inventory, leads, and settings to original demo data?')) {
      storage.resetToDemoData();
      showToast('Demo dataset refreshed successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-xl font-extrabold text-slate-900">MRD</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-l border-gray-200 pl-3">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onNavigateSite}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Public Website ↗
            </button>
            <button
              onClick={() => {
                storage.setAdminLoggedIn(false);
                onLogout();
              }}
              className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-gray-100">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'cars', label: `Cars (${cars.length})`, icon: CarIcon },
            { id: 'leads', label: `Leads Inbox (${leads.length})`, icon: Users, badge: newLeadsCount },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'guides', label: 'Buying Guides', icon: FileText },
            { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
            { id: 'settings', label: 'Settings & Verify', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'border-amber-600 text-slate-900 bg-amber-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Available on Floor</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
                    {availableCount}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">Ready to Deliver</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Reserved Vehicles</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-600 font-tabular">
                    {reservedCount}
                  </span>
                  <span className="text-xs text-amber-700 font-semibold">Deposit Placed</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Sold (Showroom Total)</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">
                    {soldCount}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Provenance Kept</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">New Enquiries</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-red-600 font-tabular">
                    {newLeadsCount}
                  </span>
                  <span className="text-xs text-red-600 font-semibold">Require Reply</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car Listing</span>
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>View All Enquiries ({leads.length})</span>
                </button>
              </div>

              <button
                onClick={handleResetDemoData}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                title="Restore fresh demo dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>

            {/* Latest 5 Leads */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-sm font-bold text-slate-900">Latest Inbound Enquiries</h3>
                  <p className="text-xs text-slate-500">Real-time enquiries from website visitors in Harare.</p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-semibold text-amber-800 hover:underline"
                >
                  View Full Inbox →
                </button>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {leads.slice(0, 5).map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setViewingLead(l)}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'New' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-slate-700'
                        }`}>
                          {l.status}
                        </span>
                        <strong className="text-slate-900 font-semibold">{l.fullName}</strong>
                        <span className="text-slate-400">· {l.type}</span>
                      </div>
                      <p className="text-slate-500">
                        {l.carTitle ? `Regarding: ${l.carTitle}` : l.message || 'General enquiry'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 block font-tabular">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </span>
                      {l.offerUSD ? (
                        <span className="font-bold text-amber-800 block font-tabular">
                          Offer: {formatUSD(l.offerUSD)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CARS INVENTORY MANAGER ================= */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by make, model, or year..."
                    value={carSearch}
                    onChange={(e) => setCarSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-gray-300 outline-none"
                  />
                </div>

                <select
                  value={carStatusFilter}
                  onChange={(e) => setCarStatusFilter(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <button
                onClick={() => setEditingCar(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>

            {/* Cars Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs divide-y divide-gray-200">
                <thead className="bg-gray-50 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Vehicle</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Private Cost</th>
                    <th className="p-3.5">Asking Price</th>
                    <th className="p-3.5">Gross Margin</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars
                    .filter((c) => {
                      if (carStatusFilter !== 'all' && c.status !== carStatusFilter) return false;
                      if (carSearch) {
                        const q = carSearch.toLowerCase();
                        return (
                          c.make.toLowerCase().includes(q) ||
                          c.model.toLowerCase().includes(q) ||
                          c.year.toString().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((c) => {
                      const privatePricing = storage.getPrivatePricing(c.id);
                      const cost = privatePricing?.costPriceUSD || 0;
                      const profit = c.askingPriceUSD - cost;
                      const marginPercent = cost > 0 ? ((profit / cost) * 100).toFixed(1) : '0';

                      return (
                        <tr key={c.id} className="hover:bg-gray-50/80">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={c.images[0] || '/assets/images/hero_luxury_showroom_1791464684452.jpg'}
                              alt={c.model}
                              className="w-12 h-9 rounded object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <strong className="text-slate-900 block font-semibold">
                                {c.year} {c.make} {c.model}
                              </strong>
                              <span className="text-slate-400 text-[11px]">{c.trim}</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-slate-600">
                            {categories.find((cat) => cat.id === c.categoryId)?.name || 'General'}
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : c.status === 'Reserved'
                                  ? 'bg-amber-100 text-amber-800'
                                  : c.status === 'Sold'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-slate-700'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>

                          <td className="p-3.5 font-tabular text-slate-500">
                            {cost > 0 ? formatUSD(cost) : 'N/A'}
                          </td>

                          <td className="p-3.5 font-tabular font-bold text-slate-900">
                            {c.priceOnRequest ? 'Price on Request' : formatUSD(c.askingPriceUSD)}
                          </td>

                          <td className="p-3.5 font-tabular">
                            <span className="font-semibold text-emerald-700">+{formatUSD(profit)}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">({marginPercent}%)</span>
                          </td>

                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setEditingCar(c)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded"
                              title="Edit listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateCar(c)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded"
                              title="Duplicate listing"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {c.status !== 'Sold' && (
                              <button
                                onClick={() => handleMarkAsSold(c)}
                                className="px-2 py-1 text-[10px] font-bold bg-gray-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded"
                              >
                                Mark Sold
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCar(c.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Delete vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LEADS INBOX ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Search buyer name or phone..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-gray-300 outline-none w-48"
                />

                <select
                  value={leadTypeFilter}
                  onChange={(e) => setLeadTypeFilter(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="Car enquiry">Car Enquiry</option>
                  <option value="Offer">Offer</option>
                  <option value="Viewing request">Viewing Request</option>
                  <option value="Sell/Trade-in">Sell/Trade-in</option>
                  <option value="Car request">Car Request</option>
                </select>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <button
                onClick={handleExportLeadsCSV}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Leads Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs divide-y divide-gray-200">
                <thead className="bg-gray-50 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Buyer</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Vehicle / Enquiry</th>
                    <th className="p-3.5">Offer / Budget</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads
                    .filter((l) => {
                      if (leadTypeFilter !== 'all' && l.type !== leadTypeFilter) return false;
                      if (leadStatusFilter !== 'all' && l.status !== leadStatusFilter) return false;
                      if (leadSearch) {
                        const q = leadSearch.toLowerCase();
                        return l.fullName.toLowerCase().includes(q) || l.phone.includes(q);
                      }
                      return true;
                    })
                    .map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => setViewingLead(l)}
                        className="hover:bg-gray-50/80 cursor-pointer"
                      >
                        <td className="p-3.5">
                          <strong className="text-slate-900 block font-semibold">{l.fullName}</strong>
                          <span className="text-slate-400 font-tabular">{l.phone}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-medium text-slate-700">{l.type}</span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              l.status === 'New'
                                ? 'bg-red-100 text-red-800'
                                : l.status === 'Negotiating'
                                ? 'bg-amber-100 text-amber-800'
                                : l.status === 'Won'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-slate-700'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-700 max-w-xs truncate">
                          {l.carTitle || (l.tradeInDetails ? `${l.tradeInDetails.year} ${l.tradeInDetails.make}` : l.message || 'General message')}
                        </td>

                        <td className="p-3.5 font-tabular">
                          {l.offerUSD ? (
                            <strong className="text-amber-800 font-bold">{formatUSD(l.offerUSD)}</strong>
                          ) : l.carRequestDetails?.budgetUSD ? (
                            <span className="text-slate-700 font-medium">{formatUSD(l.carRequestDetails.budgetUSD)}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="p-3.5 font-tabular text-slate-400">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3.5 text-right">
                          <span className="text-xs font-semibold text-amber-800 hover:underline">
                            Inspect & Reply →
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Vehicle Categories</h3>
                <p className="text-xs text-slate-500">Manage categories, descriptions, and default markup percentages.</p>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={cat.coverImage} alt={cat.name} className="w-16 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-heading text-sm font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-xs text-slate-500">{cat.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Default Markup:</span>
                    <strong className="text-slate-900 font-tabular">{cat.defaultMarkupPercent}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: GUIDES & CONTENT ================= */}
        {activeTab === 'guides' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">SEO Buying Guides</h3>
                <p className="text-xs text-slate-500">Editorial articles optimized for Harare car-buying searches.</p>
              </div>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-slate-900">{post.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading text-base font-bold text-slate-900">Customer Testimonials</h3>
              <p className="text-xs text-slate-500">
                In accordance with our strict honesty rules: fake reviews are never displayed. You can add verified client reviews here once collected.
              </p>
            </div>

            {testimonials.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No client testimonials added yet. Testimonials section remains cleanly hidden on public site until real ones are entered.
              </div>
            ) : null}
          </div>
        )}

        {/* ================= TAB 7: SETTINGS & TO CONFIRM CHECKLIST ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Business Facts Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <h3 className="font-heading text-base font-bold text-slate-900 border-b border-gray-100 pb-3">
                Dealership Business Facts & Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    value={settings.locationAddress}
                    onChange={(e) => setSettings({ ...settings, locationAddress: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sales Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ZiG Exchange Rate (1 USD = ZiG)</label>
                  <input
                    type="number"
                    step="any"
                    value={settings.zigExchangeRate}
                    onChange={(e) => setSettings({ ...settings, zigExchangeRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Default Markup %</label>
                  <input
                    type="number"
                    value={settings.defaultMarkupPercent}
                    onChange={(e) => setSettings({ ...settings, defaultMarkupPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none font-tabular"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={settings.enableZiGDisplay}
                    onChange={(e) => setSettings({ ...settings, enableZiGDisplay: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Enable Optional ZiG Currency Toggle in Header and Price Blocks</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    storage.saveSettings(settings);
                    showToast('Dealership settings saved.');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                >
                  Save Dealership Settings
                </button>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Pre-Launch [TO CONFIRM] Verification Checklist</span>
              </h3>
              <p className="text-xs text-slate-600">
                Items marked with placeholders that require confirmation with MRD Car Sales leadership before production rollout.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                {settings.toConfirmChecklist.map((item) => (
                  <div key={item.id} className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <strong className="text-slate-900 block font-semibold">{item.item}</strong>
                      <span className="text-slate-600">Current Setting: {item.currentValue}</span>
                      <p className="text-[11px] text-amber-900 font-medium">Note: {item.note}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-900 shrink-0">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Car Modal */}
      {editingCar !== undefined && (
        <CarEditModal
          car={editingCar}
          categories={categories}
          settings={settings}
          onClose={() => setEditingCar(undefined)}
          onSaved={() => {
            refreshAllData();
            showToast('Vehicle inventory saved successfully.');
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {viewingLead && (
        <LeadDetailModal
          lead={viewingLead}
          settings={settings}
          onClose={() => setViewingLead(null)}
          onUpdated={() => {
            refreshAllData();
            showToast('Enquiry updated.');
          }}
        />
      )}
    </div>
  );
};
