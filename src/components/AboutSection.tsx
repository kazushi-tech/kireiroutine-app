import React from 'react';
import portfolioSymbol from '../assets/projects/concept-visuals/portfolio-symbol.jpg';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* Text Side */}
          <div className="w-full md:w-1/2">
            <div className="inline-block px-3 py-1 mb-6 border border-neon-orange rounded-full bg-neon-orange/5">
              <span className="text-neon-orange text-xs font-bold uppercase tracking-wider">About Me</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
              テクノロジーで、<br/>
              <span className="text-[#9ca3af]">人の暮らしと時間に余白をつくる。</span>
            </h2>
            
            <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed font-light">
              <p>
                WebマーケとAIツールを組み合わせて、「めんどくさいけど大事なこと」を仕組み化していくのが好きです。広告運用・レポート・掃除ルーティン・ニュースチェックなど、毎日のルーチンをできるだけ自動化し、その分の時間と集中力を、自分や周りの人のために使えるようにするプロダクトづくりを目指しています。
              </p>
              <p>
                仕事ではクライアントのKPIを追いかけながら、個人ではPWAや自動化スクリプトを作り、実際に自分の生活の中で使い倒してから、ポートフォリオとして公開するスタイルです。
              </p>
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full md:w-1/2 relative">
            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-white/5 z-0 hidden md:block"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-neon-cyan opacity-50 hidden md:block"></div>
            
            <div className="relative z-10 aspect-[3/4] bg-slate-950 w-full max-w-sm mx-auto md:max-w-none md:ml-auto flex items-center justify-center border border-white/10 overflow-hidden group">
               <img 
                 src={portfolioSymbol}
                 alt="Kazushiのポートフォリオを象徴するデジタルなシンボル" 
                 className="w-full h-full object-cover rounded-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500"
               />
               <div className="absolute bottom-4 right-4 bg-black/80 px-4 py-2 backdrop-blur-sm border border-neon-orange/30">
                 <span className="text-xs font-mono text-neon-orange">CREATOR // KZ</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;