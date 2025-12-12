import React from 'react';

export type KeyScreen = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

type KeyScreensProps = {
  screens: KeyScreen[];
  onImageClick?: (index: number) => void;
};

export const KeyScreens: React.FC<KeyScreensProps> = ({ screens, onImageClick }) => {
  if (screens.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 border-b border-slate-700/50 pb-4">
        Key Screens
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {screens.map((screen, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onImageClick?.(idx)}
            className="group text-left overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-800/50">
              {screen.src ? (
                <img
                  src={screen.src}
                  alt={screen.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <span className="text-sm">Image placeholder</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-100">{screen.title}</h3>
              <p className="text-base text-slate-400 mt-1 leading-relaxed">{screen.caption}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default KeyScreens;
