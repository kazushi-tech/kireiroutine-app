import React from 'react';
import { SkillCategory } from '../types';

// Extend SkillCategory type locally if needed, or just use it as is if it allows extra props (it probably doesn't).
// Since I can't see types.ts right now, I'll assume I need to update the data structure.
// Actually, I can just define the data here with the new structure and map it.

type EnhancedSkillCategory = {
  title: string;
  subTitle: string;
  skills: string[];
};

const SKILL_CATEGORIES: EnhancedSkillCategory[] = [
  {
    title: 'Web & Frontend',
    subTitle: '個人開発のPWAやポートフォリオで使っているフロントエンド技術。',
    skills: ['HTML5 & CSS3', 'TypeScript', 'React', 'Tailwind CSS', 'Vite', 'Three.js / R3F', 'Netlify / Vercel']
  },
  {
    title: 'AI & Automation',
    subTitle: 'Gemini API や Antigravity を使った自動化・ワークフロー構築まわり。',
    skills: ['Google AI Studio', 'Gemini API', 'Python Scripting', 'Prompt Engineering', 'RAG Architectures', 'Workflow Automation']
  },
  {
    title: 'Marketing & Analytics',
    subTitle: '本業の広告運用・分析で扱っているマーケティング系のスキル。',
    skills: ['Technical SEO', 'Google Analytics 4', 'Conversion Rate Optimization (CRO)', 'A/B Testing', 'Data Visualization (D3.js)']
  }
];

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Technical <span className="text-neon-orange">Arsenal</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            「仕事で実際に触れているもの」と「個人開発で深掘りしているもの」をざっくり整理したスキルセットです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div key={idx} className="p-8 bg-slate-950 border border-white/5 hover:border-neon-cyan/30 hover:bg-slate-900 transition-all duration-300 group">
              <div className="mb-6 border-b border-neon-orange/30 pb-4 group-hover:border-neon-orange transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {category.subTitle}
                </p>
              </div>
              
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                    <span className="w-1.5 h-1.5 bg-neon-orange rounded-full mr-3 group-hover:bg-neon-cyan group-hover:shadow-[0_0_5px_#00f0ff] transition-all"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;