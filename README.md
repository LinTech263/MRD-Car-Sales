# MRD Car Sales — High-End Dealership Website & Admin Portal
**Mount Pleasant, Harare, Zimbabwe**

A sleek, minimalist, conversion-focused vehicle dealership web application and staff portal built for **MRD Car Sales**.

---

## 1. Quick Start & Evaluation
- **Dev Server**: Running on `http://localhost:3000`
- **Admin Portal**: Accessible at `/admin`
  - **Quick Demo Login**: Click "1-Click Owner Sign In (Demo Mode)" or enter `owner@mrdcarsales.co.zw` / `HarareDealership2026`.
- **Demo Data Reset**: Click "Reset Demo Data" inside Admin Dashboard to restore the initial 8 demo vehicles and 5 leads.

---

## 2. Business Configuration & Architecture

All business facts are centralized in `src/config/business.ts` and editable live in **Admin > Settings**.
- **Dealership Name**: MRD Car Sales
- **Physical Address**: Mount Pleasant Drive (Plot 14B), Mount Pleasant, Harare, Zimbabwe `[TO CONFIRM]`
- **Sales Phone & WhatsApp**: `+263 77 696 1977` `[TO CONFIRM]`
- **Public Contact Email**: `sales@mrdcarsales.co.zw` `[TO CONFIRM]`
- **Opening Hours**: Mon–Fri: 08:00 – 17:00, Sat: 08:00 – 13:00, Sun: Closed `[TO CONFIRM]`
- **Currencies**: Primary USD. Optional ZiG toggle with admin-configurable conversion rate.

### Theme Tokens (`src/theme.ts` & `src/index.css`)
- **Background**: `#FFFFFF` (pure white, minimalist showroom aesthetic)
- **Surfaces**: `#F8F9FA` & `#FFFFFF` with `1px` subtle borders (`#E5E7EB`)
- **Typography**: Sora (display headings), Inter (body prose), JetBrains Mono (numbers/specs)
- **High-Intent Gold Accent**: `#B89542` (warm champagne gold)

---

## 3. Data Model & Firestore Security Rules

To ensure total privacy of dealership profit margins, private fields are strictly separated from public documents:
- **Public Car Document** (`/cars/{carId}`):
  Only stores public vehicle specs, images, description, and the final asking price.
- **Private Pricing Document** (`/cars/{carId}/private/pricing`):
  Stores vehicle cost price, markup type/value, VIN, dealer stock number, and profit margins. Strictly inaccessible to unauthorized public queries.

Full deployment-ready security rules are configured in `firestore.rules` and `storage.rules`:
```javascript
// firestore.rules highlights
match /cars/{carId} {
  allow read: if resource.data.status in ['Available', 'Reserved', 'Sold'] || isAdmin();
  allow write: if isAdmin();

  match /private/{pricingDoc} {
    allow read, write: if isAdmin();
  }
}
match /leads/{leadId} {
  allow create: if request.resource.data.fullName is string && request.resource.data.phone is string;
  allow read, update, delete: if isAdmin();
}
```

---

## 4. Technical SEO Checklist

1. **Semantic HTML**: Exact single `<h1>` hierarchy, breadcrumbs, and zero-pill metadata.
2. **Schema.org Structured Data**:
   - `AutoDealer` (LocalBusiness) with Harare address, coordinates, and phone.
   - `Car` with `Offer` on every vehicle page.
   - `FAQPage` on home and FAQ sections.
   - `Article` on all buying guides.
3. **Crawlable Endpoints**:
   - Live XML Sitemap: `/sitemap.xml`
   - Robots directive: `/robots.txt` (disallows `/admin` and `/saved`)
4. **Keyword Grounding**: Naturally targets "cars for sale in Harare", "luxury cars Harare", "used SUVs Mount Pleasant", "Toyota Harare", and "Range Rover Harare".

---

## 5. Pre-Launch Verification Checklist (`[TO CONFIRM]` Items)

Before switching from staging to live production DNS:
- [ ] **Physical Street Address**: Confirm exact stand or house number on Mount Pleasant Drive.
- [ ] **Econet Line & WhatsApp**: Verify `+263 77 696 1977` is configured on WhatsApp Business.
- [ ] **Primary Notification Email**: Confirm destination email mailbox for lead alerts.
- [ ] **Saturday Afternoon Viewing Policy**: Confirm weekend appointment hours.
- [ ] **Police Clearance & CVR Assistance**: Confirm exact assistance scope provided to purchasers.
- [ ] **Google Business Profile**: Verify profile with matching NAP (Name, Address, Phone) and link to domain.
- [ ] **Google Search Console**: Paste the site verification meta tag into Admin > Settings.
