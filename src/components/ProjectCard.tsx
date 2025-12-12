// src/components/ProjectCard.tsx
import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';

type Props = {
  project: Project;
};

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const statusLabel =
    project.status === 'completed' ? 'Completed' : 'In Progress';

  const statusColor =
    project.status === 'completed'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-neon-orange/20 text-neon-orange border-neon-orange/40';

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-600/80 bg-gradient-to-br from-slate-800/80 via-slate-900 to-slate-800/90 p-[1px] w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,240,255,0.2)] hover:border-neon-cyan/50">
      <div className="relative h-full rounded-3xl bg-slate-900/95 flex flex-col">
        {/* サムネ画像 */}
        <div className="relative w-full overflow-hidden rounded-t-3xl aspect-[16/9]">
          <img
            src={project.thumbnail}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 transition-opacity duration-300 group-hover:from-slate-950/95 group-hover:via-slate-950/60" />
          {/* Title overlay on hover */}
          <div className="absolute bottom-4 left-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">
              {project.name}
            </h3>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="relative flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <header className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] tracking-[0.25em] text-neon-cyan/80 uppercase">
                {project.shortName}
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-50">
                {project.name}
              </h3>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase ${statusColor}`}
            >
              {statusLabel}
            </span>
          </header>

          {/* Problem / Approach / Outcome */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
              {project.problem}
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              <span className="text-neon-cyan/70 font-medium">Approach: </span>
              {project.approach}
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              <span className="text-emerald-400/70 font-medium">Outcome: </span>
              {project.outcome}
            </p>
          </div>

          {/* Meta: Role / Year */}
          <div className="mt-2 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-400">
              <span className="text-slate-300 font-medium">Role:</span> {project.role}
              <span className="mx-2 text-slate-600">/</span>
              <span className="text-slate-300 font-medium">Year:</span> {project.period}
            </p>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-neon-cyan/80"
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-2 flex flex-wrap gap-3">
            {/* Case Study button */}
            {project.caseStudyUrl && (
              <Link
                to={project.caseStudyUrl}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-400 text-sm transition-all duration-200 hover:bg-emerald-500/20 hover:text-emerald-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Case Study
                <span className="text-sm">→</span>
              </Link>
            )}
            
            {/* Live Site button */}
            {project.link && !project.link.startsWith('/') && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-800/50 px-4 py-2 font-medium text-slate-300 text-sm transition-all duration-200 hover:bg-slate-700/50 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Live Site
                <span className="text-sm">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
