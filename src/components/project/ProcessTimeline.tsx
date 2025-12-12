import React from 'react';

export type ProcessStep = {
  step: string;
  description: string;
};

type ProcessTimelineProps = {
  steps: ProcessStep[];
};

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps }) => {
  return (
    <div className="rounded-xl border border-slate-800/60 p-5 bg-slate-900/30">
      <div className="space-y-4">
        {steps.map((p, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 flex-shrink-0 border border-emerald-500/30">
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-[2px] flex-1 bg-slate-700/50 mt-2"></div>
              )}
            </div>
            <div className="pb-4 flex-1">
              <h3 className="font-semibold text-slate-100 text-base">{p.step}</h3>
              <p className="text-base text-slate-400 leading-relaxed mt-1">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessTimeline;
