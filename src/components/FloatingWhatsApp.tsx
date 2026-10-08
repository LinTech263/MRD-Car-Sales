import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DealershipSettings } from '../types';
import { getWhatsAppLink } from '../theme';
import { trackEvent } from '../services/analytics';

interface FloatingWhatsAppProps {
  settings: DealershipSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const handleClick = () => {
    trackEvent('whatsapp_click', { source: 'floating_widget' }, settings);
    const link = getWhatsAppLink(
      settings.whatsapp,
      `Hello MRD Car Sales, I am viewing vehicles on your website and would like to speak to a sales representative in Mount Pleasant.`
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Direct WhatsApp contact"
      className="hidden md:flex fixed bottom-6 right-6 z-30 flex-col items-end group"
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-0.5 focus:outline-none"
        title="Chat on WhatsApp with MRD Sales"
      >
        <MessageCircle className="w-5 h-5 fill-white/20" />
        <span className="text-xs font-semibold tracking-wide">WhatsApp Us</span>
      </button>
    </aside>
  );
};
