import React from 'react';
import { DealershipSettings } from '../types';
import { updatePageSEO } from '../services/seo';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, settings, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  React.useEffect(() => {
    updatePageSEO(
      {
        title: `${isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'} | MRD Car Sales Harare`,
        description: isPrivacy
          ? "MRD Car Sales Privacy Policy in compliance with Zimbabwe's Cyber and Data Protection Act."
          : 'Terms of sale, vehicle deposits, and ZIMRA customs duty notes for MRD Car Sales in Mount Pleasant, Harare.',
        canonicalUrl: `${window.location.origin}/${isPrivacy ? 'privacy' : 'terms'}`,
      },
      settings
    );
  }, [isPrivacy, settings]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Legal & Compliance
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          {isPrivacy ? 'Privacy & Data Protection Policy' : 'Terms of Sale & Vehicle Policies'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last updated: October 2026 · Governing Law: Republic of Zimbabwe
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {isPrivacy ? (
          <>
            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                1. Commitment to Privacy in Zimbabwe
              </h2>
              <p>
                MRD Car Sales, operating from Mount Pleasant, Harare, Zimbabwe, respects your privacy and is dedicated to safeguarding personal data submitted through our digital channels. We adhere to the principles set out in the <strong>Cyber and Data Protection Act [Chapter 12:07] of Zimbabwe</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                2. Data Collection and Legitimate Purpose
              </h2>
              <p>
                We only collect information directly submitted by you for the purposes of responding to vehicle inquiries, processing purchase offers, coordinating showroom viewing appointments, and appraising trade-in submissions. This information includes your name, phone or WhatsApp contact number, email, and vehicle preferences.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                3. Non-Disclosure & Security
              </h2>
              <p>
                MRD Car Sales never sells, leases, or trades customer data to third-party marketing companies. Data is stored securely and accessed exclusively by authorized sales personnel for order fulfillment and communication.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                4. Your Rights
              </h2>
              <p>
                Under Zimbabwean data protection regulations, you have the right to request access to any personal data we hold, or to request deletion of your contact records from our leads database at any time by contacting sales@mrdcarsales.co.zw.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                1. Vehicle Availability and Listed Pricing
              </h2>
              <p>
                All vehicles displayed on this website are subject to prior sale. Advertised prices are quoted primarily in United States Dollars (USD). Where approximate Zimbabwe Gold (ZiG) conversions are displayed, they are indicative based on the prevailing dealership rate and must be confirmed prior to contract execution.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                2. ZIMRA Duty and Customs Verification
              </h2>
              <p>
                MRD Car Sales ensures that all imported floor stock carries verified customs clearance, including stamped ZIMRA Bills of Entry and duty receipts. Buyers are provided full inspection of documentation prior to settlement.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                3. Physical Inspection & Mechanical Due Diligence
              </h2>
              <p>
                While MRD Car Sales executes comprehensive multi-point vetting on all inventory, we encourage every buyer to physically inspect and test-drive the vehicle in Mount Pleasant, Harare, accompanied by an independent qualified mechanic, before final payment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-slate-900">
                4. Deposits & Reserved Status
              </h2>
              <p>
                A vehicle marked as "Reserved" has an active deposit lodged. Holding deposits are governed by individual written agreements between MRD Car Sales and the prospective purchaser.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
