import React from 'react';

type Skill = {
  name: string;
  context: string;
};

type SkillCategory = {
  title: string;
  subTitle: string;
  icon: string;
  skills: Skill[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Web & Frontend',
    subTitle: '個人開発のPWAやポートフォリオで使っているフロントエンド技術。',
    icon: '</>',
    skills: [
      { name: 'React', context: '個人PWAとポートフォリオのUI実装で日常的に使用' },
      { name: 'TypeScript', context: '型安全な開発で保守性を確保' },
      { name: 'Tailwind CSS', context: 'スピーディなスタイリングに活用' },
      { name: 'Vite', context: '高速なビルド環境として採用' },
      { name: 'Three.js / R3F', context: '3Dビジュアライゼーションに挑戦中' },
      { name: 'Vercel / Netlify', context: 'デプロイ・ホスティングに利用' },
    ]
  },
  {
    title: 'AI & Automation',
    subTitle: 'Gemini API や Antigravity を使った自動化・ワークフロー構築まわり。',
    icon: '⚙️',
    skills: [
      { name: 'Gemini API', context: 'ニュース要約や自動生成に活用' },
      { name: 'Google AI Studio', context: 'プロンプト設計とテストに使用' },
      { name: 'Prompt Engineering', context: '長文プロンプトで一貫性のある出力を設計' },
      { name: 'Python Scripting', context: 'データ処理・自動化スクリプトに使用' },
      { name: 'Workflow Automation', context: '日次タスクの自動化を実践中' },
    ]
  },
  {
    title: 'Marketing & Analytics',
    subTitle: '本業の広告運用・分析で扱っているマーケティング系のスキル。',
    icon: '📊',
    skills: [
      { name: 'Google Analytics 4', context: 'トラフィック分析とレポート作成' },
      { name: 'Technical SEO', context: 'サイト改善とパフォーマンス最適化' },
      { name: 'CRO / A/B Testing', context: 'コンバージョン率改善施策の設計・検証' },
      { name: 'Data Visualization', context: 'ダッシュボードやレポートの可視化' },
      { name: 'Ad Operations', context: 'Google/Meta広告の運用と最適化' },
    ]
  }
];

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Technical <span className="text-neon-orange">Arsenal</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            「仕事で実際に触れているもの」と「個人開発で深掘りしているもの」をざっくり整理したスキルセットです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div 
              key={idx} 
              className="p-6 lg:p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-neon-cyan/40 hover:bg-slate-800/80 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-2xl mb-5 group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all">
                {category.icon}
              </div>

              {/* Header */}
              <div className="mb-6 pb-4 border-b border-slate-700/50 group-hover:border-neon-orange/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {category.subTitle}
                </p>
              </div>
              
              {/* Skills list with context */}
              <ul className="space-y-4">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="group/skill">
                    <div className="flex items-center text-slate-200 font-medium mb-0.5">
                      <span className="w-1.5 h-1.5 bg-neon-orange rounded-full mr-3 group-hover:bg-neon-cyan group-hover:shadow-[0_0_5px_#00f0ff] transition-all"></span>
                      {skill.name}
                    </div>
                    <p className="text-xs text-slate-500 ml-[18px]">
                      {skill.context}
                    </p>
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