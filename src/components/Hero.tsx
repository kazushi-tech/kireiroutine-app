import React from 'react';
import ExperienceCanvas from './ExperienceCanvas';

const Hero: React.FC = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full min-h-screen py-16 md:py-0 flex flex-col md:flex-row items-center justify-center overflow-hidden">
      
      {/* Background gradient for text readability - Left side */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full pointer-events-none z-0 hidden md:block"
        style={{
          background: 'linear-gradient(to right, rgba(15, 30, 50, 0.35) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Left Content - Text Zone (45%) */}
      <div className="w-full md:w-[45%] h-full flex flex-col justify-center px-6 md:px-12 lg:pl-24 z-20 order-2 md:order-1 mb-12 md:mb-0">
        <div className="max-w-[34rem]">
          
          {/* ① 肩書き - label-like */}
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-neon-cyan/80 mt-32 mb-4">
            Webマーケター / AIツール開発
          </p>

          {/* h1 Title - Digital Reality */}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-3">
            <span className="block text-slate-100 drop-shadow-md">Digital Reality</span>
          </h1>

          {/* Subline - for One (accent line) */}
          <p className="text-sm md:text-base font-medium tracking-[0.2em] text-cyan-400 uppercase leading-snug mt-3 mb-6">
            FOR ONE-PERSON CREATORS AND TOOLS.
          </p>

          {/* サブヘッド - Primary message */}
          <p className="text-[15px] md:text-base lg:text-lg font-medium text-slate-200 leading-relaxed mb-5">
            Webマーケ × フロントエンド × AIオートメーションで、<br className="hidden sm:block" />
            <span className="text-slate-100 font-semibold">"めんどうだけど大事なこと"</span>を仕組み化するクリエイター。
          </p>
          
          {/* バリュープロポジション */}
          <div className="mb-5 border-l-2 border-neon-cyan/50 pl-5">
            <p className="text-[15px] md:text-base lg:text-lg text-slate-300 leading-relaxed">
              広告・レポート・日々のルーティンを、<br className="hidden sm:block" />
              自分で使い倒したプロダクトとして形にします。
            </p>
          </div>

          {/* 詳細説明 - Tertiary level */}
          <div className="space-y-3 mb-10">
            <p className="text-[15px] md:text-base lg:text-lg text-slate-400 leading-[1.8] font-light">
              広告運用・LP改善で培った「数字を見る目」と、AIツールをフル活用した「制作スピード」で、フロントエンドとオートメーション周りを中心に作品づくりをしています。
            </p>
            <p className="text-[14px] md:text-[15px] lg:text-base text-slate-500 leading-[1.8] font-light">
              仕事ではクライアントのKPIを追いかけながら、個人ではPWAや自動化スクリプトを作り、実際に自分の生活の中で使い倒してから公開するスタイルです。
            </p>
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* プライマリボタン: VIEW PROJECTS - Solid teal */}
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-teal-400/90 text-slate-950 font-bold text-sm md:text-base uppercase tracking-wide shadow-[0_0_8px_rgba(45,212,191,0.3)] transition-all duration-200 hover:bg-teal-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(45,212,191,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              View Projects
            </button>
            {/* セカンダリボタン: DOWNLOAD RESUME - Outline */}
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-slate-900/60 border border-slate-600/60 text-slate-200 font-semibold text-sm md:text-base uppercase tracking-wide transition-all duration-200 hover:bg-slate-800/80 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Download Resume
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-14 flex flex-col items-center animate-scroll-bounce opacity-75">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-neon-cyan/70 mb-2">Scroll</span>
            <div className="w-[2px] h-10 bg-gradient-to-b from-neon-cyan/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Right Content - Visual Zone (55%) */}
      <div className="w-full md:w-[55%] h-[55vh] md:h-screen relative z-10 order-1 md:order-2 overflow-visible flex items-center justify-center md:justify-center md:pr-4 lg:pr-8">
        <div className="w-full h-full max-w-[600px] md:max-w-none opacity-85">
          <ExperienceCanvas />
        </div>
        {/* Gradient fade at bottom for mobile */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent md:hidden pointer-events-none"></div>
      </div>

    </section>
  );
};

export default Hero;