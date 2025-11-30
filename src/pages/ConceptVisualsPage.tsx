import React, { useState } from 'react';

import lifeRoutineHub from '../assets/projects/concept-visuals/life-routine-hub.jpeg';
import aiNewsCommandCenter from '../assets/projects/concept-visuals/ai-news-command-center-bright.jpeg';
import aiNewsDataStream from '../assets/projects/concept-visuals/ai-news-data-stream.jpeg';
import kzIdentityCore from '../assets/projects/concept-visuals/portfolio-symbol.jpg';
import urbanGrindDessertHero from '../assets/projects/concept-visuals/urban-grind-dessert-hero.jpeg';
import urbanGrindNightExterior from '../assets/projects/concept-visuals/concept-visuals-urban-night-city.jpg';
import kzWorkspaceNightDesk from '../assets/projects/concept-visuals/kz-workspace-night-desk.jpeg';
import responsiveDashboardMulti from '../assets/projects/concept-visuals/responsive-dashboard-multi-device.jpeg';

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  usage: string;
  project: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
};

const galleryItems: GalleryItem[] = [
  {
    id: 'life-routine-hub',
    title: 'Life Routine Hub',
    description:
      'リビングスペース、ルーティンダッシュボード、デスク、KZコアを4分割で構成した「生活全体のコントロールパネル」をイメージしたビジュアル。',
    usage: 'KireiRoutine および生活ルーティン系プロジェクトのヒーロー／紹介セクション用',
    project: 'KireiRoutine',
    imageSrc: lifeRoutineHub,
    imageAlt: 'Life Routine Hub コンセプトビジュアル',
    tags: ['KireiRoutine', 'Dashboard', 'Lifestyle', 'Concept'],
  },
  {
    id: 'kireiroutine-dashboard-alt',
    title: 'KireiRoutine Dashboard (Alt)',
    description:
      '週次・月次の掃除タスクがカードとカレンダーで整理されたダークテーマのダッシュボードUIコンセプト。',
    usage: 'KireiRoutine プロジェクト詳細ページのUIモックアップとして使用',
    project: 'KireiRoutine',
    imageSrc: lifeRoutineHub, // Placeholder: Original image missing
    imageAlt: 'KireiRoutine のダッシュボードUIコンセプト',
    tags: ['KireiRoutine', 'Product UI', 'Dark mode'],
  },
  {
    id: 'ai-news-command-center',
    title: 'AI News Command Center',
    description:
      '複数のニュースカードや時間軸、タグフィルタが並ぶニュースダッシュボード。Geminiによる要約モジュールを中央に配置。',
    usage: 'AI News Bot のヒーロー／機能紹介セクション用',
    project: 'AI News Bot',
    imageSrc: aiNewsCommandCenter,
    imageAlt: 'AIニュースコマンドセンターのコンセプトビジュアル',
    tags: ['AI News Bot', 'Dashboard', 'Gemini', 'Obsidian'],
  },
  {
    id: 'ai-news-stream',
    title: 'AI News Data Stream',
    description:
      'ニュース記事が光のストリームとして流れ込み、要約されたカードに変換されていく様子をビジュアル化したコンセプト。',
    usage: 'AI News Bot の「仕組み説明」図解や背景ビジュアルとして使用',
    project: 'AI News Bot',
    imageSrc: aiNewsDataStream,
    imageAlt: 'AIニュースのデータストリームを表現したビジュアル',
    tags: ['AI News Bot', 'Data flow', 'Pipeline'],
  },
  {
    id: 'kz-identity-core',
    title: 'KZ Identity Core',
    description:
      'KZロゴ／シンボルを中心に、リング状のUI要素や軌道が巡る「デジタルアイデンティティのコア」を表現したビジュアル。',
    usage: 'ポートフォリオのABOUTやトップページのブランド紹介セクション用',
    project: 'Identity',
    imageSrc: kzIdentityCore,
    imageAlt: 'KZアイデンティティのコアビジュアル',
    tags: ['Identity', 'Logo', 'Brand', 'Core'],
  },
  {
    id: 'urban-grind-dessert-hero',
    title: "Urban Grind Dessert Hero",
    description:
      '都会の夜カフェを背景に、グラスやデザートプレートにフォーカスした「甘味が主役」のヒーロービジュアル。',
    usage: "Kazushi's Urban Grind のトップ／メニュー導線用ヒーローイメージ",
    project: "Kazushi's Urban Grind",
    imageSrc: urbanGrindDessertHero,
    imageAlt: '都会の夜カフェとデザートのコンセプトビジュアル',
    tags: ['Urban Grind', 'Dessert', 'Cafe', 'Hero'],
  },
  {
    id: 'urban-grind-night-exterior',
    title: 'Urban Grind Night Exterior',
    description:
      'ネオンサインとガラス張りの外観から、店内の暖かい光が漏れている夜のカフェ外観シーン。',
    usage: "Kazushi's Urban Grind サイトのセクション背景／サブヒーローとして使用",
    project: "Kazushi's Urban Grind",
    imageSrc: urbanGrindNightExterior,
    imageAlt: '夜のカフェ外観を描いたビジュアル',
    tags: ['Urban Grind', 'Exterior', 'Night', 'Neon'],
  },
  {
    id: 'kz-workspace-night-desk',
    title: 'KZ Workspace – Night Desk',
    description:
      'モニター、ノート、コーヒー、少しだけトレーニングギアが置かれたKZの「夜の作業デスク」をイメージしたワークスペース。',
    usage: 'ABOUT ページやワークスタイル紹介セクション用',
    project: 'Workstyle',
    imageSrc: kzWorkspaceNightDesk,
    imageAlt: 'KZの夜のワークスペースを描いたビジュアル',
    tags: ['Workspace', 'Night', 'Lifestyle'],
  },
  {
    id: 'responsive-dashboard-mobile',
    title: 'Responsive Dashboard – Multi Device',
    description:
      'スマホ・タブレット・PCに同じダッシュボードUIが表示されている、レスポンシブデザインのコンセプト。',
    usage: 'フロントエンドスキル／実装スタイルを説明するための背景ビジュアル',
    project: 'Frontend',
    imageSrc: responsiveDashboardMulti,
    imageAlt: 'マルチデバイスに表示されたレスポンシブダッシュボード',
    tags: ['Frontend', 'Responsive', 'Dashboard'],
  },
];

const ConceptVisualsPage: React.FC = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
        <span className="text-slate-500">Projects</span>
        <span className="mx-2 text-slate-600">/</span>
        <span className="text-slate-100">Concept Visuals</span>
      </div>

      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-3 py-1 border border-slate-700/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-slate-300">
              IN PROGRESS
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
              Concept Visuals
            </h1>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300/80">
              GENERATIVE ART SERIES WITH NANO BANANA PRO
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            KireiRoutine の掃除ルーティンアプリ、AI News Bot のニュースパイプライン、
            架空カフェサイト「Kazushi&apos;s Urban Grind」、そして KZ 自身のデジタルアイデンティティ。
            これらのプロジェクトで共通する世界観を、Freepik の Nano Banana Pro を使って
            「ダーク＋ネオン＋実用的UI」なコンセプトビジュアルとして設計しています。
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            1つの長文プロンプトを軸にしつつ、用途ごとに構図・ライティング・UI要素だけを微調整することで、
            すべてのプロジェクトにまたがったトーン＆マナーを維持しながら、
            実際のプロダクトやポートフォリオに組み込みやすいビジュアルシリーズを目指しています。
          </p>

          {/* Prompt summary card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-5 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <h2 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] text-emerald-300">
                NB
              </span>
              Nano Banana Pro Prompt Design
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-3">
              2,500 文字制限を前提に、「世界観」「色」「カメラワーク」「UI要素」「想定用途」までを1本の
              プロンプトで定義し、プロジェクトごとに小さな差し替えだけで運用できるようにしています。
            </p>
            <ul className="text-xs text-slate-400 space-y-1 mb-4 list-disc list-inside">
              <li>共通の KZ トーン（ダーク＋ネオン＋都市＋実用UI）を全シリーズで共有</li>
              <li>プロジェクトごとに小さな差分（ロゴ／テキスト／UI形状）だけを変更</li>
              <li>後から再現・再生成しやすいように構造化したプロンプトメモを管理</li>
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/projects/concept-visuals/prompt-sample"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-emerald-400 transition"
              >
                View full prompt sample
                <span aria-hidden>↗</span>
              </a>
              <button
                type="button"
                onClick={() => setIsPromptOpen(true)}
                className="text-xs text-slate-300 hover:text-emerald-300 underline-offset-4 hover:underline"
              >
                ページ内の Prompt Notes を開く
              </button>
            </div>
          </div>
        </div>

        {/* Meta / side panel */}
        <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
              PROJECT TYPE
            </h3>
            <p className="text-sm text-slate-100">
              Visual identity &amp; product concept art
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
              TOOLS
            </h3>
            <p className="text-sm text-slate-200">
              Freepik Nano Banana Pro, Figma, Obsidian
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
              FOCUS
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Prompt design for consistent branding</li>
              <li>Dark UI &amp; cyber-inspired compositions</li>
              <li>Product mockups for real projects</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
              Gallery
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              各プロジェクトで実際に使用している、または使用予定のコンセプトビジュアルです。
              プロダクトごとのストーリーを保ちつつ、全体としては「KZ / Kazushi」らしいトーンに統一しています。
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {item.title}
                  </h3>
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                    {item.project}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-[11px] text-emerald-300/90">
                  <span className="font-medium text-emerald-300">Use case: </span>
                  {item.usage}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Prompt Notes (accordion) */}
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => setIsPromptOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-left hover:border-emerald-500/50 hover:bg-slate-900/80 transition-colors"
        >
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Prompt Notes (Nano Banana Pro)
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              ネオ東京の路地裏シーンをベースにした、コンセプトビジュアル共通プロンプトの要約メモです。
            </p>
          </div>
          <span className="ml-4 text-slate-300">
            {isPromptOpen ? '−' : '+'}
          </span>
        </button>

        {isPromptOpen && (
          <div className="space-y-4 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-4 sm:p-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                COMPOSITION
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                Wide-angle shot / 3分割構図を基本に、「路地」「UIパネル」「ブランドコア」の3要素を同時に見せる構成。
                奥行き感を出しつつ、画面手前には実用的なUIやロゴを配置します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                LIGHTING &amp; COLOR
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                Night scene, strong neon lights, soft volumetric fog, high contrast.
                メインカラーはエメラルド〜シアン系、サブでパープルを少しだけ足してサイバー感を出します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                UI &amp; DETAILS
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                画面内に「ダッシュボードUI」「ニュースカード」「ロゴマーク」「ステータスピル」をさりげなく埋め込むことで、
                単なる背景ではなく「プロダクトと繋がった世界観」であることを示します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                VARIATIONS
              </h3>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                <li>プロジェクト名とロゴだけを差し替えてシリーズ化</li>
                <li>カメラアングルを「路地」「室内」「デスク」「空撮」で変える</li>
                <li>UIパネルの内容を「掃除ルーティン」「ニュースカード」「売上ダッシュボード」などに切り替え</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              <a
                href="/projects/concept-visuals/prompt-sample"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
              >
                フルテキストのプロンプトサンプルを表示する
                <span aria-hidden>↗</span>
              </a>
              <p className="text-[11px] text-slate-500">
                （現在 /projects/concept-visuals で表示されている Markdown ベースの画面を、
                この URL にマッピングしてください）
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConceptVisualsPage;
