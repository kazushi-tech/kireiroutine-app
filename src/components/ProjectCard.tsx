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
    <article className="group relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/90 p-[1px] shadow-[0_0_40px_rgba(0,240,255,0.12)]">
      <div className="relative h-full rounded-3xl bg-slate-950/95 flex flex-col">
        {/* サムネ画像 */}
        <div className="relative w-full overflow-hidden rounded-t-3xl aspect-[16/9] md:aspect-[21/9]">
          <img
            src={project.thumbnail}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/0 to-slate-950/0" />
        </div>

        {/* コンテンツ */}
        <div className="relative flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <header className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.25em] text-neon-cyan/80 uppercase">
                {project.shortName}
              </p>
              <h3 className="text-base sm:text-lg font-semibold text-slate-50">
                {project.name}
              </h3>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase ${statusColor}`}
            >
              {statusLabel}
            </span>
          </header>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-200/80">
            {project.summary}
          </p>
          <p className="text-[11px] sm:text-xs leading-relaxed text-slate-400">
            {project.highlight}
          </p>

          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-neon-cyan"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-neon-cyan" />
              {project.role}
            </span>
            <span className="text-slate-600">/</span>
            <span>{project.period}</span>
          </div>

          {(project.link || project.repo) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {project.link && (
                <>
                  {project.link.startsWith('/') ? (
                    <Link
                      to={project.link}
                      className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-1 font-medium text-neon-cyan transition hover:bg-neon-cyan/20 hover:text-cyan-50"
                    >
                      <span className="text-[11px]">View Gallery</span>
                      <span className="text-[14px]">→</span>
                    </Link>
                  ) : (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-1 font-medium text-neon-cyan transition hover:bg-neon-cyan/20 hover:text-cyan-50"
                    >
                      <span className="text-[11px]">Live Site</span>
                      <span className="text-[14px]">↗</span>
                    </a>
                  )}
                </>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-slate-600/80 bg-slate-800/80 px-3 py-1 font-medium text-slate-200 transition hover:border-slate-300 hover:bg-slate-700"
                >
                  <span className="text-[11px]">GitHub</span>
                  <span className="text-[14px]">⤴</span>
                </a>
              )}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent opacity-60" />
        </div>
      </div>
    </article>
  );
};
