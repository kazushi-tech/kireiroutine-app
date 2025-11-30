// src/data/projects.ts
import kireiroutineThumb from '../assets/projects/kireiroutine-thumb.png';
import urbanGrindThumb from '../assets/projects/urbangrind-thumb.jpeg';
import aiNewsBotThumb from '../assets/projects/ai-news-bot-thumb.png';
import conceptVisualsThumb from '../assets/projects/concept-visuals-thumb.png';

export type ProjectStatus = 'in-progress' | 'completed';

export type Project = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  period: string;
  status: ProjectStatus;
  summary: string;
  highlight: string;
  tech: string[];
  link?: string;
  repo?: string;
  thumbnail: string;
};

export const projects: Project[] = [
  {
    id: 'kireiroutine',
    name: 'KireiRoutine – Personal Cleaning Routine PWA',
    shortName: 'KireiRoutine',
    role: 'Product Designer / Frontend Engineer',
    period: '2024–2025',
    status: 'completed',
    summary:
      '自分の部屋の掃除ルーティンを、週1〜年1まで「頻度 × エリア」で整理して管理できる個人用PWA。カレンダー画面から、その日にやるべき掃除タスクが一目で分かるように設計。',
    highlight:
      '自分が本当に使いたいことだけを詰め込んだ“自分専用アプリ”。Antigravityで生成した初期版から、React + TypeScript + TailwindCSSでUIを作り直し、スマホでの見やすさと操作感を重視してリファイン。',
    tech: ['Vite', 'React', 'TypeScript', 'TailwindCSS', 'PWA', 'Antigravity'],
    link: 'https://kireiroutine-app.netlify.app/',
    repo: 'https://github.com/your-name/kireiroutine',
    thumbnail: kireiroutineThumb
  },
  {
    id: 'urban-grind-tokyo',
    name: "Kazushi's Urban Grind – Concept Coffee Shop Website",
    shortName: "Kazushi's Urban Grind",
    role: 'Designer / Frontend Engineer',
    period: '2024',
    status: 'completed',
    summary:
      '「もし自分がカフェを開くなら」という妄想を形にしたコンセプトサイト。好みの世界観を詰め込み、ヒーロービジュアルからメニュー、ギャラリーまでを1ページで完結させたLP型デザイン。',
    highlight:
      'Google AI Studio（Antigravity）で生成した雛形をベースに、TailwindCSSで細部を調整。「将来的に実店舗を持つとしたらこういう雰囲気にしたい」というこだわりを反映し、実在しない店舗ながらもリアリティのある空気感を目指して制作。',
    tech: ['Vite', 'React', 'TypeScript', 'TailwindCSS', 'Netlify'],
    link: 'https://admirable-kleicha-092d54.netlify.app/',
    repo: 'https://github.com/your-name/urban-grind-tokyo',
    thumbnail: urbanGrindThumb
  },
  {
    id: 'ai-news-bot',
    name: 'AI News Bot – Gemini-powered News Summarization Pipeline',
    shortName: 'AI News Bot',
    role: 'Architect / Backend-like Engineer',
    period: '2024–2025',
    status: 'in-progress',
    summary:
      'AI関連ニュースの記事URLをキューに流し込み、Gemini APIで要約し、frontmatter付きMarkdownとしてObsidianのVaultに自動保存するためのローカル用ニュースパイプライン。',
    highlight:
      'まだ開発中のCLIツール群。Node.js + TypeScriptで実装しており、contextURL付きGemini要約、ドメイン別インデックス、日次・週次インデックス自動生成などを順次実装中。PublishやWeb UIは今後検討予定。',
    tech: ['Node.js', 'TypeScript', 'Gemini API', 'Markdown', 'Obsidian', 'GitHub'],
    link: '',
    repo: 'https://github.com/your-name/ai-news-bot',
    thumbnail: aiNewsBotThumb
  },
  {
    id: 'concept-visuals',
    name: 'Concept Visuals – Generative Art Series with Nano Banana Pro',
    shortName: 'Concept Visuals',
    role: 'Art Director / Prompt Engineer',
    period: '2024–2025',
    status: 'in-progress',
    summary:
      'Freepik の Nano Banana Pro を使って制作しているコンセプトビジュアルのシリーズ。掃除ルーティン管理アプリ、AI News Bot、カフェワークスペース、デジタルアイデンティティなど、自分のプロダクトやポートフォリオのキービジュアルとして使用。',
    highlight:
      '2,500文字制限を意識した長文プロンプト設計で、各ツールやサイトのテーマに合わせてビジュアルを量産。サイバーパンク、アーバンナイト、ミニマルデザインなどのスタイルで、ポートフォリオ全体のビジュアルアイデンティティを統一。',
    tech: ['Nano Banana Pro', 'Freepik', 'Prompt Design', 'Branding'],
    link: '/projects/concept-visuals',
    repo: '',
    thumbnail: conceptVisualsThumb
  }
];
