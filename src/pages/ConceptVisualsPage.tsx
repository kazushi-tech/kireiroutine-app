import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';

import lifeRoutineHubBright from '../assets/projects/concept-visuals/life-routine-hub-bright.png';
import kireiroutineDashboardAltBright from '../assets/projects/concept-visuals/kireiroutine-dashboard-alt-bright.png';
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
  concept: string;
  useCase: string;
  category: string; // Filter category
  imageSrc: string;
  imageAlt: string;
  tags: string[];
};

// Filter categories
const FILTER_CATEGORIES = [
  'All',
  'KireiRoutine',
  'AI News Bot',
  'Urban Grind',
  'Identity',
  'Other',
] as const;

type FilterCategory = typeof FILTER_CATEGORIES[number];

const galleryItems: GalleryItem[] = [
  {
    id: 'life-routine-hub',
    title: 'Life Routine Hub',
    concept: '生活全体を「コントロールパネル」としてビジュアル化したコンセプト。',
    useCase: 'KireiRoutine トップページのヒーローセクション用ビジュアル。',
    category: 'KireiRoutine',
    imageSrc: lifeRoutineHubBright,
    imageAlt: 'Life Routine Hub コンセプトビジュアル',
    tags: ['Dashboard', 'Lifestyle'],
  },
  {
    id: 'kireiroutine-dashboard-alt',
    title: 'KireiRoutine Dashboard (Alt)',
    concept: '掃除タスクをカードとカレンダーで整理したダッシュボードUIコンセプト。',
    useCase: 'KireiRoutine プロジェクト詳細ページのモックアップ。',
    category: 'KireiRoutine',
    imageSrc: kireiroutineDashboardAltBright,
    imageAlt: 'KireiRoutine Dashboard UIコンセプト',
    tags: ['Product UI'],
  },
  {
    id: 'ai-news-command-center',
    title: 'AI News Command Center',
    concept: 'ニュースカードとGemini要約モジュールが並ぶダッシュボード。',
    useCase: 'AI News Bot のヒーロー／機能紹介セクション用。',
    category: 'AI News Bot',
    imageSrc: aiNewsCommandCenter,
    imageAlt: 'AIニュースコマンドセンター',
    tags: ['Dashboard', 'Gemini'],
  },
  {
    id: 'ai-news-stream',
    title: 'AI News Data Stream',
    concept: 'ニュース記事が光のストリームとなり要約カードに変換される様子。',
    useCase: 'AI News Bot の仕組み説明図解として使用。',
    category: 'AI News Bot',
    imageSrc: aiNewsDataStream,
    imageAlt: 'AIニュースのデータストリーム',
    tags: ['Data flow'],
  },
  {
    id: 'kz-identity-core',
    title: 'KZ Identity Core',
    concept: 'KZロゴを中心としたデジタルアイデンティティのコア表現。',
    useCase: 'ポートフォリオ ABOUT やブランド紹介セクション用。',
    category: 'Identity',
    imageSrc: kzIdentityCore,
    imageAlt: 'KZアイデンティティのコアビジュアル',
    tags: ['Logo', 'Brand'],
  },
  {
    id: 'urban-grind-dessert-hero',
    title: 'Urban Grind Dessert Hero',
    concept: '都会の夜カフェを背景にデザートにフォーカスしたヒーロービジュアル。',
    useCase: 'Urban Grind のトップ／メニュー導線用ヒーローイメージ。',
    category: 'Urban Grind',
    imageSrc: urbanGrindDessertHero,
    imageAlt: 'Urban Grind デザートヒーロー',
    tags: ['Cafe', 'Hero'],
  },
  {
    id: 'urban-grind-night-exterior',
    title: 'Urban Grind Night Exterior',
    concept: 'ネオンサインと暖かい光が漏れるカフェ外観シーン。',
    useCase: 'Urban Grind サイトの背景／サブヒーロー。',
    category: 'Urban Grind',
    imageSrc: urbanGrindNightExterior,
    imageAlt: '夜のカフェ外観',
    tags: ['Exterior', 'Neon'],
  },
  {
    id: 'kz-workspace-night-desk',
    title: 'KZ Workspace – Night Desk',
    concept: 'モニター、ノート、コーヒーが並ぶKZの夜の作業デスク。',
    useCase: 'ABOUT ページやワークスタイル紹介セクション用。',
    category: 'Other',
    imageSrc: kzWorkspaceNightDesk,
    imageAlt: 'KZの夜のワークスペース',
    tags: ['Workspace', 'Lifestyle'],
  },
  {
    id: 'responsive-dashboard-mobile',
    title: 'Responsive Dashboard – Multi Device',
    concept: 'スマホ・タブレット・PCで同じUIを表示するレスポンシブコンセプト。',
    useCase: 'フロントエンドスキル説明の背景ビジュアル。',
    category: 'Other',
    imageSrc: responsiveDashboardMulti,
    imageAlt: 'マルチデバイスダッシュボード',
    tags: ['Responsive', 'Dashboard'],
  },
];

const ConceptVisualsPage: React.FC = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  // SEO
  useDocumentHead({
    title: 'Concept Visuals – Generative Art Series',
    description: 'Nano Banana Proを使ったコンセプトビジュアルシリーズ。KireiRoutine、AI News Bot、Urban Grindなど各プロジェクトのキービジュアルをダーク＋ネオンで制作。',
  });

  // Filter gallery items
  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-slate-500">
        <Link to="/" className="text-slate-500 hover:text-emerald-400 transition-colors">
          Home
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-500">Projects</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-100">Concept Visuals</span>
      </div>

      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-1.5 border border-slate-700/60">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-medium tracking-[0.2em] text-slate-300">
              IN PROGRESS
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-50">
              Concept Visuals
            </h1>
            <p className="text-base font-medium uppercase tracking-[0.25em] text-emerald-300/80">
              GENERATIVE ART SERIES WITH NANO BANANA PRO
            </p>
          </div>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            KireiRoutine、AI News Bot、Urban Grind、そして KZ のデジタルアイデンティティ。
            これらのプロジェクトで共通する世界観を、Freepik の Nano Banana Pro を使って
            「ダーク＋ネオン＋実用的UI」なコンセプトビジュアルとして設計しています。
          </p>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            1つの長文プロンプトを軸に、用途ごとに構図・ライティング・UI要素を微調整。
            すべてのプロジェクトにまたがったトーン＆マナーを維持しながら、
            実際のプロダクトに組み込みやすいビジュアルシリーズを目指しています。
          </p>

          {/* Prompt summary card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <h2 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
                NB
              </span>
              Nano Banana Pro Prompt Design
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-4">
              2,500 文字制限を前提に、「世界観」「色」「カメラワーク」「UI要素」「想定用途」までを1本の
              プロンプトで定義し、プロジェクトごとに小さな差し替えだけで運用できるようにしています。
            </p>
            <ul className="text-sm text-slate-400 space-y-2 mb-5 list-disc list-inside">
              <li>共通の KZ トーン（ダーク＋ネオン＋都市＋実用UI）を全シリーズで共有</li>
              <li>プロジェクトごとに小さな差分（ロゴ／テキスト／UI形状）だけを変更</li>
              <li>後から再現・再生成しやすいように構造化したプロンプトメモを管理</li>
            </ul>

            <button
              type="button"
              onClick={() => setIsPromptOpen(true)}
              className="text-sm text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline"
            >
              ↓ Prompt Notes を見る
            </button>
          </div>
        </div>

        {/* Meta / side panel */}
        <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">
              PROJECT TYPE
            </h3>
            <p className="text-base text-slate-100">
              Visual identity &amp; product concept art
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">
              TOOLS
            </h3>
            <p className="text-base text-slate-200">
              Freepik Nano Banana Pro, Figma, Obsidian
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">
              FOCUS
            </h3>
            <ul className="text-sm text-slate-300 space-y-1.5">
              <li>Prompt design for consistent branding</li>
              <li>Dark UI &amp; cyber-inspired compositions</li>
              <li>Product mockups for real projects</li>
            </ul>
          </div>

          {/* PROCESS */}
          <div className="pt-4 border-t border-slate-700/50">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-3">
              PROCESS
            </h3>
            <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
              <li>Obsidian でプロンプトの下書きを作成</li>
              <li>Nano Banana Pro で複数バリエーション生成</li>
              <li>実際のプロジェクト（KireiRoutine / Urban Grind / AI News Bot）にマッピング</li>
              <li>必要に応じて Figma で微修正・構図調整</li>
            </ol>
          </div>
        </aside>
      </section>

      {/* Prompt Notes */}
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => setIsPromptOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/30 bg-slate-900/80 px-6 py-5 text-left hover:border-emerald-500/60 hover:bg-slate-900 transition-colors"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-50">
              Prompt Notes（Nano Banana Pro）
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              同じ世界観で量産するためのプロンプト設計メモ
            </p>
          </div>
          <span className="ml-4 text-emerald-400 text-xl font-bold">
            {isPromptOpen ? '−' : '+'}
          </span>
        </button>

        {isPromptOpen && (
          <div className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-6 sm:p-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                COMPOSITION
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Wide-angle shot / 3分割構図を基本に、「路地」「UIパネル」「ブランドコア」の3要素を同時に見せる構成。
                奥行き感を出しつつ、画面手前には実用的なUIやロゴを配置します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                LIGHTING &amp; COLOR
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Night scene, strong neon lights, soft volumetric fog, high contrast.
                メインカラーはエメラルド〜シアン系、サブでパープルを少しだけ足してサイバー感を出します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                UI &amp; DETAILS
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                画面内に「ダッシュボードUI」「ニュースカード」「ロゴマーク」「ステータスピル」をさりげなく埋め込むことで、
                単なる背景ではなく「プロダクトと繋がった世界観」であることを示します。
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                VARIATIONS
              </h3>
              <ul className="text-sm text-slate-300 list-disc list-inside space-y-1.5">
                <li>プロジェクト名とロゴだけを差し替えてシリーズ化</li>
                <li>カメラアングルを「路地」「室内」「デスク」「空撮」で変える</li>
                <li>UIパネルの内容を「掃除ルーティン」「ニュースカード」「売上ダッシュボード」などに切り替え</li>
              </ul>
            </div>

            {/* Full Prompt Sample Link */}
            <div className="pt-4 border-t border-slate-800/80">
              <a
                href="/projects/concept-visuals/prompt-sample"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition"
              >
                View full prompt sample in Obsidian-style note
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Gallery */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-50">
              Gallery
            </h2>
            <p className="mt-3 text-base text-slate-400 max-w-2xl">
              各プロジェクトで実際に使用している、または使用予定のコンセプトビジュアルです。
            </p>
          </div>
        </div>

        {/* Filter Buttons - Horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeFilter === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800/50 text-slate-300 border-slate-600/50 hover:border-emerald-500/50 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-50">
                    {item.title}
                  </h3>
                </div>
                {/* Concept (short) */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.concept}
                </p>
                {/* Use case */}
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">Use case:</span> {item.useCase}
                </p>
                {/* Tags - enhanced contrast */}
                <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-600/60"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
                    {item.category}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">このカテゴリに該当するビジュアルはありません。</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConceptVisualsPage;
