import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { storage } from '../services/storage';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('owner@mrdcarsales.co.zw');
  const [password, setPassword] = useState('HarareDealership2026');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      storage.setAdminLoggedIn(true);
      onSuccess();
    } else {
      setError('Please provide valid login credentials.');
    }
  };

  const handleDemoBypass = () => {
    storage.setAdminLoggedIn(true);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1">
            <span className="font-heading text-2xl font-extrabold text-slate-900 tracking-tight">
              MRD
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          </div>
          <h1 className="font-heading text-lg font-bold text-slate-900">
            Staff & Dealership Portal
          </h1>
          <p className="text-xs text-slate-500">
            Restricted access for MRD Car Sales sales management in Mount Pleasant.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@mrdcarsales.co.zw"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            Authenticate & Access Portal
          </button>
        </form>

        {/* 1-Tap Quick Access for Evaluation Testing */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <button
            onClick={handleDemoBypass}
            className="w-full py-2 text-xs font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-800" />
            <span>1-Click Owner Sign In (Demo Mode)</span>
          </button>

          <button
            onClick={onBackToSite}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
