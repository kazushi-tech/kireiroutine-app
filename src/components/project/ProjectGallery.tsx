import React, { useState, useEffect, useCallback } from 'react';

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption?: string;
  tags?: string[];
};

type ProjectGalleryProps = {
  items: GalleryItem[];
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  }, [selectedIndex, items.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  }, [selectedIndex, items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, goNext, goPrev]);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 border-b border-slate-700/50 pb-4">
        Gallery
      </h2>

      {/* Grid */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => item.src && openModal(idx)}
            disabled={!item.src}
            className={`group text-left overflow-hidden rounded-xl border bg-slate-950/80 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              item.src 
                ? 'border-slate-800/80 hover:border-emerald-500/40 cursor-pointer' 
                : 'border-dashed border-slate-700/50 cursor-default'
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-800/30">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <div className="text-center">
                    <span className="text-2xl">📷</span>
                    <p className="text-sm mt-2">Coming soon</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-base font-medium text-slate-200">{item.title}</h3>
              {item.caption && (
                <p className="text-sm text-slate-500 mt-1">{item.caption}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-14 right-0 text-slate-400 hover:text-white text-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 p-2"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="max-h-[75vh] w-auto mx-auto rounded-xl"
            />

            {/* Caption */}
            <div className="text-center mt-5">
              <h3 className="text-xl font-semibold text-slate-100">{selectedItem.title}</h3>
              {selectedItem.caption && (
                <p className="text-base text-slate-400 mt-1">{selectedItem.caption}</p>
              )}
            </div>

            {/* Navigation */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 w-14 h-14 rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 flex items-center justify-center text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4 w-14 h-14 rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 flex items-center justify-center text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            {/* Counter */}
            <p className="text-center text-sm text-slate-500 mt-4">
              {selectedIndex !== null ? selectedIndex + 1 : 0} / {items.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;
