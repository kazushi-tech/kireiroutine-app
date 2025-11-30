import React from 'react';
import lifeRoutineHub from '../assets/projects/concept-visuals/life-routine-hub.jpeg';
import neoTokyoBackAlley from '../assets/projects/concept-visuals/concept-visuals-neo-tokyo-back-alley.jpeg';
import urbanNightCity from '../assets/projects/concept-visuals/concept-visuals-urban-night-city.jpg';
import dessertCafeHero from '../assets/projects/concept-visuals/legacy/dessert-cafe-hero.jpeg';

// Gallery data with actual project images
const CONCEPT_VISUALS = [
  {
    id: 1,
    title: 'Life Routine Hub',
    description: 'Concept art for daily routine / cleaning app visual.',
    image: lifeRoutineHub,
    alt: '掃除ルーティン管理アプリのコンセプトビジュアル',
  },
  {
    id: 2,
    title: 'Neo Tokyo Back Alley',
    description: 'Key visual for dark theme portfolio hero section.',
    image: neoTokyoBackAlley,
    alt: 'ダークテーマポートフォリオ用のネオ東京路地裏ビジュアル',
  },
  {
    id: 3,
    title: 'Urban Night Scene',
    description: 'Background visual for urban / cyberpunk themed pages.',
    image: urbanNightCity,
    alt: 'アーバンサイバーパンクテーマ背景用の都市夜景',
  },
  {
    id: 4,
    title: 'Dessert Visual for Cafe Site',
    description: "Hero image concept for Kazushi's Urban Grind.",
    image: dessertCafeHero,
    alt: 'Kazushi\'s Urban Grindカフェサイト用デザートビジュアル',
  },
];

const SAMPLE_PROMPT = `# Nano Banana Pro Prompt Sample

## Composition
- Wide-angle shot capturing a neon-lit back alley in Neo Tokyo
- Low camera angle to emphasize towering buildings
- Strong leading lines from alley walls converging to vanishing point
- Rule of thirds with focal point on right third

## Lighting
- Primary: Vibrant neon signs (cyan, magenta, orange) casting colored reflections on wet pavement
- Secondary: Warm amber street lights creating depth
- Atmospheric: Light fog/mist for depth and mystery
- Highlights: Sharp, high-contrast neon edges
- Shadows: Deep blacks with subtle blue fill light

## Color Palette
- Dominant: Deep navy (#020617) to black (#000000) base
- Accent 1: Neon cyan (#00f0ff) for signage and reflections
- Accent 2: Magenta/pink (#ff00ff, #ff1493) for secondary signs  
- Accent 3: Orange (#f97316) for warmth and contrast
- Reflections: Desaturated versions of neon colors on wet surfaces

## Technical Details
- Style: Hyper-realistic with slight cinematic color grading
- Atmosphere: Moody, cyberpunk, slightly dystopian
- Weather: Light rain, wet surfaces with puddle reflections
- Time: Night, around 2 AM
- Texture: High detail on neon tubes, rough concrete walls, glossy wet pavement

## Mood & Atmosphere
- Lonely yet captivating
- Technological advancement meets urban decay
- Sense of mystery and exploration
- Visually striking for immediate impact

## Output Requirements  
- Resolution: 4K minimum
- Aspect ratio: 16:9 for web hero sections
- File format: High-quality PNG or JPEG
- Color space: sRGB for web display`;

const ConceptVisualsPromptSample: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-background text-slate-50">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="relative z-10">
        {/* Header section */}
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-4">
            <a href="/projects/concept-visuals" className="inline-flex items-center text-sm text-neon-cyan hover:text-cyan-300 transition-colors">
              ← Back to Concept Visuals
            </a>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Concept Visuals
            <span className="block text-2xl md:text-3xl text-slate-400 mt-2 font-normal">
              Generative Art Series with Nano Banana Pro
            </span>
          </h1>
          
          <div className="max-w-3xl space-y-4 text-lg text-slate-300">
            <p>
              Freepik の Nano Banana Pro を使って制作しているコンセプトビジュアルのシリーズです。
              掃除ルーティン管理アプリ、AI News Bot、カフェワークスペース、デジタルアイデンティティ(KZシンボル)など、
              自分のプロダクトやポートフォリオのキービジュアルとして使用するために制作しています。
            </p>
            <p className="text-slate-400">
              2,500文字制限を意識した長文プロンプト設計で、同じブランド内でトーンを揃えたビジュアルを量産。
              各ツールやサイトのテーマに合わせて、サイバーパンク、アーバンナイト、ミニマルデザインなどのスタイルでアートワークを調整しています。
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-neon-cyan/30 pb-4">
            Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONCEPT_VISUALS.map((visual) => (
              <div 
                key={visual.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                  <img 
                    src={visual.image}
                    alt={visual.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {visual.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {visual.description}
                  </p>
                </div>
                {/* Bottom accent line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Sample Section */}
        <div className="max-w-6xl mx-auto px-6 py-12 mb-24">
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-neon-orange/30 pb-4">
            Prompt Engineering Sample
          </h2>
          
          <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
{SAMPLE_PROMPT}
              </pre>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-500">
                ※ This is a sample prompt structure used for generating Neo Tokyo themed visuals with Nano Banana Pro.
                Actual prompts may vary based on specific requirements and themes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptVisualsPromptSample;
