import React from 'react';
import profileImage from '../assets/profile/omats-profile.jpg';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="pt-16 pb-20 md:pt-20 md:pb-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Text Side */}
          <div className="w-full md:w-1/2">
            <div className="inline-block px-3 py-1 mb-6 border border-neon-orange rounded-full bg-neon-orange/5">
              <span className="text-neon-orange text-xs font-bold uppercase tracking-wider">About Me</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight text-white">
              テクノロジーで、<br/>
              <span className="text-[#9ca3af]">人の暮らしと時間に余白をつくる。</span>
            </h2>
            
            {/* Now / Next / Why blocks */}
            <div className="space-y-8">
              {/* NOW */}
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-neon-cyan px-2 py-0.5 border border-neon-cyan/40 rounded bg-neon-cyan/5">
                  NOW
                </span>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed">
                  Webマーケ・広告運用を本業としながら、日々AIツールの検証と個人開発を行っています。
                  業務の効率化とレポート自動化に注力中。
                </p>
              </div>

              {/* NEXT */}
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 px-2 py-0.5 border border-emerald-400/40 rounded bg-emerald-400/5">
                  NEXT
                </span>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed">
                  AI × フロントエンドの領域を深掘りし、オートメーション案件や個人PWAのクオリティを上げていきたい。
                  「自分で使い倒せるツール」を増やすのが目標。
                </p>
              </div>

              {/* WHY */}
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-neon-orange px-2 py-0.5 border border-neon-orange/40 rounded bg-neon-orange/5">
                  WHY
                </span>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed">
                  「めんどうだけど大事なこと」を仕組み化して、自分と周りの人の時間と余白を作りたいから。
                  ルーティンを自動化すれば、本当に大事なことに集中できる。
                </p>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full md:w-1/2 relative">
            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-white/5 z-0 hidden md:block"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-neon-cyan opacity-50 hidden md:block"></div>
            
            <div className="relative z-10 bg-slate-950 w-full max-w-xs mx-auto md:max-w-md md:ml-auto border border-white/10 overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,240,255,0.15)] hover:border-neon-cyan/30">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={profileImage}
                  alt="Profile of Kazushi" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Caption */}
              <div className="p-4 bg-slate-900/95 border-t border-white/5">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Healthy life + tools I actually use, all turned into products.
                </p>
              </div>
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-black/80 px-3 py-1.5 backdrop-blur-sm border border-neon-orange/30">
                <span className="text-[10px] font-mono text-neon-orange uppercase tracking-wider">Creator // KZ</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
