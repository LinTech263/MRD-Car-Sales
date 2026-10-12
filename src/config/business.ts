import { DealershipSettings } from '../types';

export const INITIAL_BUSINESS_SETTINGS: DealershipSettings = {
  businessName: 'MRD Car Sales',
  locationAddress: 'Mount Pleasant Drive (Plot 14B), Mount Pleasant', // [TO CONFIRM]
  suburb: 'Mount Pleasant',
  city: 'Harare',
  country: 'Zimbabwe',
  phone: '+263 77 696 1977', // [TO CONFIRM]
  whatsapp: '+263 77 696 1977', // [TO CONFIRM]
  email: 'sales@mrdcarsales.co.zw', // [TO CONFIRM]
  openingHours: {
    weekdays: '08:00 – 17:00',
    saturday: '08:00 – 13:00',
    sunday: 'Closed',
  },
  primaryCurrency: 'USD',
  enableZiGDisplay: true,
  zigExchangeRate: 26.5, // 1 USD = 26.5 ZiG (admin configurable)
  defaultMarkupPercent: 12.5,
  logoUrl: '', // Default placeholder wordmark used when empty
  heroImageUrl: '/assets/images/hero_luxury_showroom_1791464684452.jpg',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15194.27515157144!2d31.037922!3d-17.781373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a575b5b9e075%3A0x6b4f7a5b3a4e9!2sMount%20Pleasant%2C%20Harare!5e0!3m2!1sen!2szw!4v1700000000000',
  googleMapsUrl: 'https://maps.google.com/?q=Mount+Pleasant+Harare+Zimbabwe',
  googleAnalyticsId: 'G-MRDHARARE01',
  searchConsoleVerification: 'google-site-verification=mrd_harare_luxury_cars_verification',
  socialLinks: {
    facebook: 'https://facebook.com/mrdcarsalesharare',
    instagram: 'https://instagram.com/mrdcarsales',
    autotrader: 'https://www.autotrader.co.zw/dealer/mrd-car-sales',
  },
  homeFeaturedCarIds: ['car-lc300', 'car-rr-sport', 'car-hilux-gd6', 'car-merc-c200'],
  toConfirmChecklist: [
    {
      id: 'tc-address',
      item: 'Physical Street Address in Mount Pleasant',
      currentValue: 'Mount Pleasant Drive (Plot 14B), Mount Pleasant, Harare',
      status: 'pending_confirmation',
      note: 'Need exact stand/house number and nearest intersection in Mount Pleasant.'
    },
    {
      id: 'tc-phone',
      item: 'Primary Sales WhatsApp & Voice Line',
      currentValue: '+263 77 696 1977',
      status: 'pending_confirmation',
      note: 'Confirm if Econet line is also the dedicated WhatsApp Business number.'
    },
    {
      id: 'tc-email',
      item: 'Dealership Notification Email',
      currentValue: 'sales@mrdcarsales.co.zw',
      status: 'pending_confirmation',
      note: 'Confirm domain mailbox or Gmail address used for receiving lead notifications.'
    },
    {
      id: 'tc-hours',
      item: 'Operating & Viewing Hours',
      currentValue: 'Mon-Fri 08:00 - 17:00, Sat 08:00 - 13:00',
      status: 'pending_confirmation',
      note: 'Confirm Saturday afternoon appointments policy.'
    },
    {
      id: 'tc-paperwork',
      item: 'Ownership Transfer & Police Clearance Assistance',
      currentValue: 'Registration, ZIMRA duty clearance, and change of ownership guidance',
      status: 'pending_confirmation',
      note: 'Confirm whether MRD executes police clearance directly or provides documentation assistance.'
    }
  ]
};
