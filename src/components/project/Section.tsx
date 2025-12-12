import React from 'react';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`space-y-6 ${className}`}>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-50 border-b border-slate-700/50 pb-4">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Section;
