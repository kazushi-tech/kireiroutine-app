// src/data/projects.ts
import kireiroutineThumb from "../assets/projects/kireiroutine-thumb.png";
import urbanGrindThumb from "../assets/projects/urbangrind-thumb.jpeg";
import aiNewsBotThumb from "../assets/projects/ai-news-bot-thumb.png";
import conceptVisualsThumb from "../assets/projects/concept-visuals-thumb-bright.png";

export type ProjectStatus = "in-progress" | "completed";

export type Project = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  period: string;
  status: ProjectStatus;
  problem: string;
  approach: string;
  outcome: string;
  tech: string[];
  link?: string;
  caseStudyUrl?: string;
  thumbnail: string;
};

export const projects: Project[] = [
  {
    id: "kireiroutine",
    name: "KireiRoutine",
    shortName: "KireiRoutine",
    role: "Product Designer, Frontend Engineer",
    period: "2024–2025",
    status: "completed",
    problem: '個人の掃除ルーティンを「見える化」して、続けやすくするPWA。',
    approach: "React × TypeScript × TailwindCSS を使い、カレンダー/タスクUIを実装。Antigravityで生成した初期版をリファイン。",
    outcome: "自分の部屋で1年運用しながら改善中、ポートフォリオ兼実用ツールとして公開。",
    tech: ["Vite", "React", "TypeScript", "TailwindCSS", "PWA", "Antigravity"],
    link: "https://kireiroutine-app.vercel.app/",
    caseStudyUrl: "/projects/kireiroutine",
    thumbnail: kireiroutineThumb,
  },
  {
    id: "urban-grind-tokyo",
    name: "Kazushi's Urban Grind",
    shortName: "Urban Grind",
    role: "Designer, Frontend Engineer",
    period: "2024",
    status: "completed",
    problem: '「もし自分がカフェを開くなら」を形にしたコンセプトサイト。',
    approach: "Antigravity生成の雛形をベースに、TailwindCSSでヒーロー・メニュー・ギャラリーを1ページに構成。",
    outcome: "実在しない店舗ながらリアリティのある空気感を実現、デザインの引き出しとして公開。",
    tech: ["Vite", "React", "TypeScript", "TailwindCSS", "Vercel"],
    link: "https://urban-grind-site.vercel.app/",
    caseStudyUrl: "/projects/urban-grind",
    thumbnail: urbanGrindThumb,
  },
  {
    id: "ai-news-bot",
    name: "AI News Bot",
    shortName: "AI News Bot",
    role: "Architect, Backend-like Engineer",
    period: "2024–2025",
    status: "in-progress",
    problem: "AIニュースを自動要約し、Obsidianに整理・保存するパイプライン。",
    approach: "Node.js × TypeScript × Gemini API でCLIツールを構築、ドメイン別・日次インデックスを自動生成。",
    outcome: "開発中。Publish機能やWeb UIを今後検討予定。",
    tech: ["Node.js", "TypeScript", "Gemini API", "Markdown", "Obsidian"],
    link: "",
    caseStudyUrl: "/projects/ai-news-bot",
    thumbnail: aiNewsBotThumb,
  },
  {
    id: "concept-visuals",
    name: "Concept Visuals",
    shortName: "Concept Visuals",
    role: "Art Director, Prompt Engineer",
    period: "2024–2025",
    status: "in-progress",
    problem: "ポートフォリオ全体のビジュアルアイデンティティを統一するコンセプトアート。",
    approach: "Freepik Nano Banana Pro で2,500文字の長文プロンプトを設計し、テーマごとにビジュアルを量産。",
    outcome: "KireiRoutine、Urban Grind、AI News Botなど各プロジェクトのキービジュアルとして使用中。",
    tech: ["Nano Banana Pro", "Freepik", "Prompt Design", "Branding"],
    link: "/projects/concept-visuals",
    caseStudyUrl: "/projects/concept-visuals",
    thumbnail: conceptVisualsThumb,
  },
];
