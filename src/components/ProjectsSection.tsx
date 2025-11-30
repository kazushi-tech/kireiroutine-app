// src/components/ProjectsSection.tsx
import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative scroll-mt-24 py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan/80">
              Projects
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-50">
              Web Marketing × AI-driven Creation
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-slate-400">
              本業のWebマーケ経験と、個人で作り込んでいるフロントエンド / AIツールの作品たち。
              数字を見る目と、AIを使った制作スピードを活かして、『自分が本当に使いたいプロダクト』を形にしています。
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-slate-500 text-right">
            <span>Stack: React / TypeScript / Tailwind / Node / Gemini</span>
            <span>Focus: UX, Automation, Personal Tools</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
