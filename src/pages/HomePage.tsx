import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background text-slate-50 font-sans">
      {/* Background Star layer simulation */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      <Header />
      
      <main className="relative z-10 flex flex-col">
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
