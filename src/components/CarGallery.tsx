import React, { useState } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CarGalleryProps {
  images: string[];
  title: string;
}

export const CarGallery: React.FC<CarGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0] || '/assets/images/hero_luxury_showroom_1791464684452.jpg';

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-slate-900 rounded-xl overflow-hidden border border-gray-200 group">
        <img
          src={currentImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          fetchPriority={selectedIndex === 0 ? 'high' : 'auto'}
          loading={selectedIndex === 0 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-opacity duration-200"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Expand / Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand ({selectedIndex + 1}/{images.length})</span>
        </button>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] w-20 sm:w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx ? 'border-amber-600 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between text-white">
            <h4 className="text-sm font-semibold truncate max-w-md">{title}</h4>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-lg bg-white/10"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 max-h-[80vh]">
            <img
              src={currentImage}
              alt={`${title} enlarged view`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-xs text-white/60">
            Photo {selectedIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
};
