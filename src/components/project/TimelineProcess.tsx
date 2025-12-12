import React from 'react';

export type TimelineStep = {
  step: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
};

type TimelineProcessProps = {
  steps: TimelineStep[];
};

export const TimelineProcess: React.FC<TimelineProcessProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 border-b border-slate-700/50 pb-4">
        Process
      </h2>
      <div className="space-y-6">
        {steps.map((p, idx) => (
          <div key={idx} className="flex gap-5">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-base font-bold text-emerald-400 flex-shrink-0 border-2 border-emerald-500/40">
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-[2px] flex-1 bg-gradient-to-b from-emerald-500/40 to-slate-700/30 mt-2"></div>
              )}
            </div>
            
            {/* Content */}
            <div className={`flex-1 pb-6 ${p.image ? 'grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start' : ''}`}>
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{p.step}</h3>
                <p className="text-lg text-slate-400 leading-relaxed">{p.description}</p>
              </div>
              {p.image && (
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-800/60 bg-slate-800/30">
                  <img
                    src={p.image.src}
                    alt={p.image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineProcess;
