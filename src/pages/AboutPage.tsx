import React from 'react';
import { ShieldCheck, Award, Users, CheckCircle2, ArrowRight, MapPin, Phone } from 'lucide-react';
import { DealershipSettings } from '../types';
import { updatePageSEO } from '../services/seo';

interface AboutPageProps {
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  React.useEffect(() => {
    updatePageSEO(
      {
        title: 'About MRD Car Sales | Premium Dealership in Mount Pleasant Harare',
        description:
          'Learn about MRD Car Sales in Mount Pleasant, Harare. Our standard of transparency, duty compliance, and hand-selected high-end vehicles.',
        canonicalUrl: `${window.location.origin}/about`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ],
      },
      settings
    );
  }, [settings]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Headline */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Mount Pleasant · Harare
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About MRD Car Sales
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We established MRD Car Sales with a singular premise: executive and luxury car buying in Harare should be transparent, courteous, and completely hassle-free.
        </p>
      </div>

      {/* Story & Promise */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="font-heading text-xl font-bold text-slate-900">
          Our Story & Standards
        </h2>
        <p>
          Founded in Harare [TO CONFIRM founding year], MRD Car Sales serves corporate executives, professionals, commercial farmers, and returning diaspora families seeking verified vehicles.
        </p>
        <p>
          In a local vehicle market often characterized by ambiguous duty assessments, unverified mileage, and high-pressure selling, we operate on complete clarity. We do not stock hundreds of average cars on crowded lots. Instead, every vehicle in our Mount Pleasant showroom is personally inspected for mechanical excellence, verifiable provenance, and clean ownership title.
        </p>
      </div>

      {/* 3 Core Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-slate-900">Duty Clearance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every vehicle on our floor carries authentic ZIMRA customs receipts and Bill of Entry clearance documents.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-slate-900">Mechanical Vetting</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Suspension, transfer boxes, cooling systems, and electronics undergo comprehensive physical and diagnostic evaluation.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-slate-900">Registration Guidance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We assist with Zimbabwe Republic Police clearance and CVR change of ownership documentation so your transfer is swift.
          </p>
        </div>
      </div>

      {/* Visit prompt */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading text-lg font-bold text-white">
            Visit Our Showroom in Mount Pleasant
          </h3>
          <p className="text-xs text-slate-300">
            Open Monday to Saturday. Walk-ins and mechanic inspections welcome.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/inventory')}
          className="px-6 py-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shrink-0"
        >
          View Available Cars
        </button>
      </div>
    </div>
  );
};
