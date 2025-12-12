import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {
  Section,
  QuickSummary,
  FeatureGrid,
  ProcessTimeline,
  GalleryGrid,
  ProjectNavigation,
} from './project';
import type { MetricCard, Feature, ProcessStep, GalleryItem } from './project';

export type ProjectLayoutProps = {
  // Hero section
  name: string;
  subtitle: string;
  status: 'completed' | 'in-progress';
  
  // Info card
  projectType: string;
  role: string;
  period: string;
  tools: string[];
  
  // Quick Summary
  quickSummary: {
    problem: string;
    solution: string;
    impact: string;
    metrics?: MetricCard[];
  };
  
  // Key Features
  features: Feature[];
  
  // My Role
  responsibilities: string[];
  
  // Process
  process: ProcessStep[];
  
  // Outcome
  outcome: {
    results: string;
    learnings: string[];
  };
  
  // Gallery
  gallery?: GalleryItem[];
  
  // Navigation
  liveUrl?: string;
  githubUrl?: string;
  prevProject?: { name: string; url: string };
  nextProject?: { name: string; url: string };
};

const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  name,
  subtitle,
  status,
  projectType,
  role,
  period,
  tools,
  quickSummary,
  features,
  responsibilities,
  process,
  outcome,
  gallery,
  liveUrl,
  githubUrl,
  prevProject,
  nextProject,
}) => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background text-slate-50 font-sans">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/#projects" className="hover:text-emerald-400 transition-colors">Projects</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-100">{name}</span>
        </nav>

        {/* Hero Section */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] items-start">
          <div className="space-y-4">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 border border-slate-700/60">
              <span className={`h-2 w-2 rounded-full ${status === 'completed' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} />
              <span className="text-xs font-medium tracking-[0.15em] text-slate-300 uppercase">
                {status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-50 leading-tight">
                {name}
              </h1>
              <p className="mt-2 text-lg font-medium uppercase tracking-[0.15em] text-emerald-400/80">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Info Card (compact) */}
          <aside className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 space-y-4 text-base">
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="text-slate-200">{projectType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Role</span>
              <span className="text-slate-200 text-right max-w-[60%]">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Period</span>
              <span className="text-slate-200">{period}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-2">Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300 border border-slate-700/60">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Quick Summary */}
        <QuickSummary
          problem={quickSummary.problem}
          solution={quickSummary.solution}
          impact={quickSummary.impact}
          metrics={quickSummary.metrics}
          liveUrl={liveUrl}
          githubUrl={githubUrl}
        />

        {/* Key Features */}
        {features.length > 0 && (
          <Section title="Key Features">
            <FeatureGrid features={features} />
          </Section>
        )}

        {/* My Role */}
        {responsibilities.length > 0 && (
          <Section title="My Role">
            <ul className="grid gap-3 sm:grid-cols-2">
              {responsibilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base text-slate-300 leading-relaxed">
                  <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Process */}
        {process.length > 0 && (
          <Section title="Process">
            <ProcessTimeline steps={process} />
          </Section>
        )}

        {/* Outcome & Learnings */}
        <Section title="Outcome">
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-400 mb-2">Results</h3>
              <p className="text-base text-slate-300 leading-relaxed">{outcome.results}</p>
            </div>
            {outcome.learnings.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-400 mb-3">What I Learned</h3>
                <ul className="space-y-2">
                  {outcome.learnings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base text-slate-300 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <Section title="Gallery">
            <GalleryGrid items={gallery} />
          </Section>
        )}

        {/* Navigation */}
        <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectLayout;
