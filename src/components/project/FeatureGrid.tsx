import React from 'react';

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

type FeatureGridProps = {
  features: Feature[];
};

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  // Force 2 columns for 4 items to prevent orphan card
  const gridCols = features.length === 4 
    ? 'grid-cols-1 sm:grid-cols-2' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-emerald-500/30 transition-colors flex flex-col"
        >
          <div className="text-3xl mb-3">{feature.icon}</div>
          <h3 className="font-semibold text-slate-100 text-base mb-2">{feature.title}</h3>
          <p className="text-base text-slate-400 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;
