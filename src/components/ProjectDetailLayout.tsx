import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  ProjectHero,
  SummaryCard,
  KeyScreens,
  FeatureWalkthrough,
  TimelineProcess,
  OutcomeSection,
  ProjectGallery,
  ProjectNavigation,
} from './project';
import type { CoverImage, MetricItem, KeyScreen, FeatureItem, TimelineStep, GalleryItem } from './project';

export type ProjectDetailLayoutProps = {
  // Hero
  name: string;
  subtitle: string;
  status: 'completed' | 'in-progress';
  coverImage?: CoverImage;
  projectType: string;
  role: string;
  period: string;
  tools: string[];
  metrics?: MetricItem[];
  liveUrl?: string;
  githubUrl?: string;
  
  // Summary
  summary: {
    problem: string;
    solution: string;
    impact: string;
  };
  
  // Key Screens
  keyScreens?: KeyScreen[];
  
  // Features
  features?: FeatureItem[];
  
  // Process
  process?: TimelineStep[];
  
  // Outcome
  outcome: {
    results: string;
    learnings: string[];
  };
  
  // Gallery
  gallery?: GalleryItem[];
  
  // Navigation
  prevProject?: { name: string; url: string };
  nextProject?: { name: string; url: string };
};

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  name,
  subtitle,
  status,
  coverImage,
  projectType,
  role,
  period,
  tools,
  metrics,
  liveUrl,
  githubUrl,
  summary,
  keyScreens,
  features,
  process,
  outcome,
  gallery,
  prevProject,
  nextProject,
}) => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background text-slate-50 font-sans text-lg">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero */}
        <ProjectHero
          name={name}
          subtitle={subtitle}
          status={status}
          coverImage={coverImage}
          projectType={projectType}
          role={role}
          period={period}
          tools={tools}
          metrics={metrics}
          liveUrl={liveUrl}
          githubUrl={githubUrl}
        />

        {/* Summary */}
        <SummaryCard
          problem={summary.problem}
          solution={summary.solution}
          impact={summary.impact}
        />

        {/* Key Screens */}
        {keyScreens && keyScreens.length > 0 && (
          <KeyScreens screens={keyScreens} />
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <FeatureWalkthrough features={features} />
        )}

        {/* Process */}
        {process && process.length > 0 && (
          <TimelineProcess steps={process} />
        )}

        {/* Outcome */}
        <OutcomeSection
          results={outcome.results}
          learnings={outcome.learnings}
        />

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <ProjectGallery items={gallery} />
        )}

        {/* Navigation */}
        <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailLayout;
