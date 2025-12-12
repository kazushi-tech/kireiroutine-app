import React from 'react';

export type MetricCard = {
  label: string;
  value: string;
};

type QuickSummaryProps = {
  problem: string;
  solution: string;
  impact: string;
  metrics?: MetricCard[];
  liveUrl?: string;
  githubUrl?: string;
};

export const QuickSummary: React.FC<QuickSummaryProps> = ({
  problem,
  solution,
  impact,
  metrics,
  liveUrl,
  githubUrl,
}) => {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 space-y-6">
      {/* Problem / Solution / Impact */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400 mb-2">
            Problem
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">{problem}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
            Solution
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">{solution}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">
            Impact
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">{impact}</p>
        </div>
      </div>

      {/* At a glance metrics */}
      {metrics && metrics.length > 0 && (
        <div className="pt-5 border-t border-slate-700/50">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-3">At a glance</p>
          <div className="flex flex-wrap gap-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="px-5 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <p className="text-xl font-bold text-slate-100">{m.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      {(liveUrl || githubUrl) && (
        <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-700/50">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-6 py-2.5 text-base font-semibold text-slate-950 hover:bg-emerald-400 transition"
            >
              Live Site
              <span aria-hidden>↗</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/50 px-6 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-700/50 transition"
            >
              GitHub
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickSummary;
