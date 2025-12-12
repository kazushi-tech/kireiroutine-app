import React from 'react';

type SummaryCardProps = {
  problem: string;
  solution: string;
  impact: string;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  problem,
  solution,
  impact,
}) => {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-400 mb-3">
            Problem
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed">{problem}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
            Solution
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed">{solution}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 mb-3">
            Impact
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed">{impact}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
