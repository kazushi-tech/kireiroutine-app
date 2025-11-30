import React from 'react';
import Button from './Button';
import ExperienceCanvas from './ExperienceCanvas';

const Hero: React.FC = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full min-h-screen pt-24 md:pt-0 flex flex-col md:flex-row items-center justify-center overflow-hidden">
      
      {/* Left Content */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 lg:pl-24 z-20 order-2 md:order-1 mb-12 md:mb-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
          <span className="block text-slate-100 drop-shadow-md">Digital Reality</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-cyan-200">
            for One
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-slate-400 mt-2">
            – Kazushi Portfolio
          </span>
        </h1>
        
        <div className="mb-8 space-y-4 border-l-2 border-neon-cyan pl-6">
          <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
            「Webマーケ × AI × 個人開発」で、<br />
            自分が本当に使いたいツールと体験を、<br className="hidden sm:block" />
            ちゃんと形にする。
          </p>
        </div>

        <p className="max-w-lg text-slate-400 text-base md:text-lg mb-10 leading-relaxed font-light">
          広告運用・レポート・LP改善で培った「数字を見る目」と、
          AIツールをフル活用した「制作スピード」で、
          フロントエンドとオートメーション周りを中心に作品づくりをしています。
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={scrollToProjects} className="shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
            View Projects
          </Button>
          <Button variant="outline" href="#" className="border-slate-700 text-slate-300 hover:border-neon-orange hover:text-neon-orange hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            Download Resume
          </Button>
        </div>
      </div>

      {/* Right Content / Background on Mobile */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative z-10 order-1 md:order-2">
        <ExperienceCanvas />
        {/* Gradient fade at bottom for mobile to blend into text */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent md:hidden pointer-events-none"></div>
      </div>

      {/* Scroll Indicator - Neon Cyan */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center animate-bounce z-20 opacity-80">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan mb-2 shadow-[0_0_5px_#00f0ff]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neon-cyan to-transparent shadow-[0_0_5px_#00f0ff]"></div>
      </div>

    </section>
  );
};

export default Hero;