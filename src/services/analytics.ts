import { DealershipSettings } from '../types';

export type AnalyticsEvent = 
  | 'lead_submit'
  | 'offer_submit'
  | 'whatsapp_click'
  | 'call_click'
  | 'filter_used'
  | 'save_car';

export function trackEvent(
  eventName: AnalyticsEvent,
  params: Record<string, unknown> = {},
  settings?: DealershipSettings
): void {
  // Check cookie consent
  const consent = localStorage.getItem('mrd_cookie_consent');
  if (consent === 'declined') return;

  // Log event in debug mode or send to GA4 gtag
  if (typeof window !== 'undefined') {
    const gaId = settings?.googleAnalyticsId || 'G-MRDHARARE01';
    
    // If gtag is configured in window
    if ((window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, {
        send_to: gaId,
        ...params,
      });
    }

    // Custom browser event for UI reactivity if needed
    window.dispatchEvent(
      new CustomEvent('mrd_analytics_event', {
        detail: { eventName, params, timestamp: new Date().toISOString() },
      })
    );
  }
}
