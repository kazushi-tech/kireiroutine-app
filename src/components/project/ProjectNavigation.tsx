import React from 'react';
import { Link } from 'react-router-dom';

type ProjectNavigationProps = {
  prevProject?: {
    name: string;
    url: string;
  };
  nextProject?: {
    name: string;
    url: string;
  };
};

export const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  prevProject,
  nextProject,
}) => {
  return (
    <div className="pt-10 border-t border-slate-800/50 space-y-6">
      {/* Prev / Next in one row */}
      {(prevProject || nextProject) && (
        <div className="flex justify-between items-center gap-4">
          {prevProject ? (
            <Link
              to={prevProject.url}
              className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group"
            >
              <span className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                ←
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Previous</p>
                <p className="text-sm font-medium">{prevProject.name}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextProject ? (
            <Link
              to={nextProject.url}
              className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group text-right"
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Next</p>
                <p className="text-sm font-medium">{nextProject.name}</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                →
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Back to projects - centered and prominent */}
      <div className="flex justify-center pt-4">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-3 rounded-full bg-emerald-500/90 px-8 py-3 text-base font-semibold text-slate-950 hover:bg-emerald-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
};

export default ProjectNavigation;
