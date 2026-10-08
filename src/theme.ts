/**
 * Central Theme & Formatting Configuration for MRD Car Sales
 * All colors and visual tokens are managed here with CSS variables
 */

export const THEME = {
  colors: {
    bgMain: '#FFFFFF',
    bgSubtle: '#F8F9FA',
    bgElevated: '#FFFFFF',
    borderHairline: '#E5E7EB',
    borderSubtle: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accentGold: '#B89542',
    accentGoldHover: '#9E7D30',
    accentGoldSubtle: '#FDF9EE',
    accentGoldBorder: '#E8D9B4',
    success: '#16A34A',
    danger: '#DC2626',
  },
  typography: {
    headingFont: "'Sora', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
  },
  layout: {
    maxContentWidth: 'max-w-7xl',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
  }
};

/**
 * Format USD currency
 */
export function formatUSD(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format Zimbabwe Gold (ZiG) currency
 */
export function formatZiG(usdAmount: number, rate: number): string {
  const zig = Math.round(usdAmount * (rate || 26.5));
  return `ZiG ${new Intl.NumberFormat('en-US').format(zig)}`;
}

/**
 * Format Mileage in Kilometres
 */
export function formatMileage(km: number | undefined | null): string {
  if (km === undefined || km === null || isNaN(km)) return '0 km';
  return `${new Intl.NumberFormat('en-US').format(km)} km`;
}

/**
 * Clean phone number for WhatsApp wa.me links
 */
export function cleanWhatsAppNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Build prefilled WhatsApp link
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanNumber = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
