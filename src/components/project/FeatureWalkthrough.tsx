import React from 'react';

export type FeatureItem = {
  title: string;
  description: string;
  bullets: string[];
  image?: {
    src: string;
    alt: string;
  };
};

type FeatureWalkthroughProps = {
  features: FeatureItem[];
};

export const FeatureWalkthrough: React.FC<FeatureWalkthroughProps> = ({ features }) => {
  if (features.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 border-b border-slate-700/50 pb-4">
        Features
      </h2>
      <div className="space-y-12">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`grid gap-8 items-center ${
              feature.image 
                ? idx % 2 === 0 
                  ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' 
                  : 'lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'
                : 'lg:grid-cols-1 max-w-3xl'
            }`}
          >
            {/* Image (left for even, right for odd) */}
            {feature.image && idx % 2 === 0 && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-800/60 bg-slate-800/30">
                <img
                  src={feature.image.src}
                  alt={feature.image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Text content */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-100">{feature.title}</h3>
              <p className="text-lg text-slate-300 leading-relaxed">{feature.description}</p>
              {feature.bullets.length > 0 && (
                <ul className="space-y-2">
                  {feature.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-base text-slate-400">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Image (right for odd) */}
            {feature.image && idx % 2 !== 0 && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-800/60 bg-slate-800/30 lg:order-first">
                <img
                  src={feature.image.src}
                  alt={feature.image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureWalkthrough;
