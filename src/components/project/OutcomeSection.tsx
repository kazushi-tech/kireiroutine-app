import React from 'react';

type OutcomeSectionProps = {
  results: string;
  learnings: string[];
};

export const OutcomeSection: React.FC<OutcomeSectionProps> = ({
  results,
  learnings,
}) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 border-b border-slate-700/50 pb-4">
        Outcome
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-400 mb-3">Results</h3>
          <p className="text-lg text-slate-300 leading-relaxed">{results}</p>
        </div>
        {learnings.length > 0 && (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-400 mb-4">What I Learned</h3>
            <ul className="space-y-3">
              {learnings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-lg text-slate-300 leading-relaxed">
                  <span className="mt-2.5 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default OutcomeSection;
